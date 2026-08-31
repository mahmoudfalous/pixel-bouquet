import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export interface SendSurprisePayload {
  shortId?: string;
  bouquetId?: string;
  recipientName?: string;
  phoneNumber: string;
  sender?: string;
  message?: string;
  bouquetDbId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: SendSurprisePayload = await req.json();
    const { shortId: rawShortId, bouquetId, recipientName, phoneNumber, sender, message, bouquetDbId } = body;

    if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required.' },
        { status: 400 }
      );
    }

    let finalShortId = rawShortId?.trim();
    const finalRecipient = (recipientName || '').trim();

    // 1. Ensure the bouquet is saved in Supabase
    if (!finalShortId) {
      if (!bouquetId || !message || !sender) {
        return NextResponse.json(
          { success: false, error: 'Missing bouquet details required to generate surprise gift.' },
          { status: 400 }
        );
      }

      finalShortId = Math.random().toString(36).substring(2, 9);

      const { error: bouquetSaveError } = await supabase
        .from('bouquets')
        .insert([
          {
            short_id: finalShortId,
            bouquet_id: bouquetDbId || bouquetId,
            recipient: finalRecipient || 'Someone Special',
            message: message.trim(),
            sender: sender.trim()
          }
        ]);

      if (bouquetSaveError) {
        console.error('Failed to auto-save bouquet:', bouquetSaveError);
        return NextResponse.json(
          { success: false, error: 'Could not save bouquet before delivery.' },
          { status: 500 }
        );
      }
    }

    // 2. Create pending delivery record in Supabase
    const { data: deliveryRecord, error: deliveryInsertError } = await supabase
      .from('deliveries')
      .insert([
        {
          bouquet_id: finalShortId,
          recipient_name: finalRecipient || null,
          phone_number: phoneNumber.trim(),
          status: 'pending'
        }
      ])
      .select('id')
      .single();

    if (deliveryInsertError || !deliveryRecord) {
      console.error('Failed to create delivery record in Supabase:', deliveryInsertError);
      // Even if database delivery tracking table fails (e.g. before migration), we can still proceed with delivery if needed or return 500
    }

    const deliveryId = deliveryRecord?.id || `del_${Date.now()}`;

    // 3. Construct public gift bouquet URL
    const origin = req.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const bouquetUrl = `${origin}/gift/${finalShortId}`;

    // 4. Configure WhatsApp service communication
    const serviceUrl = (
      process.env.WHATSAPP_SERVICE_URL ||
      process.env.NEXT_PUBLIC_WHATSAPP_SERVICE_URL ||
      'http://localhost:3000'
    ).replace(/\/$/, '');

    const apiKey = process.env.WHATSAPP_SERVICE_API_KEY || 'dev-secret-key-12345';

    // 5. Update delivery record status to 'processing'
    if (deliveryRecord?.id) {
      await supabase
        .from('deliveries')
        .update({ status: 'processing' })
        .eq('id', deliveryRecord.id);
    }

    // 6. Call WhatsApp Microservice
    let whatsappResponse: Response;
    try {
      whatsappResponse = await fetch(`${serviceUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          deliveryId,
          bouquetId: finalShortId,
          recipientName: finalRecipient,
          phoneNumber: phoneNumber.trim(),
          bouquetUrl,
          platformUrl: origin
        }),
        signal: AbortSignal.timeout(15000) // 15s timeout
      });
    } catch (networkError: any) {
      console.error('Network error reaching WhatsApp service:', networkError);

      if (deliveryRecord?.id) {
        await supabase
          .from('deliveries')
          .update({
            status: 'failed',
            error_message: networkError.message || 'WhatsApp microservice is unreachable.'
          })
          .eq('id', deliveryRecord.id);
      }

      return NextResponse.json(
        {
          success: false,
          error: 'WhatsApp delivery service is currently offline or unreachable. Please try again.',
          deliveryId
        },
        { status: 503 }
      );
    }

    const result = await whatsappResponse.json().catch(() => ({}));

    // 7. Handle WhatsApp service response
    if (!whatsappResponse.ok || !result.success) {
      const errorMessage = result.error || `WhatsApp service responded with status ${whatsappResponse.status}`;

      if (deliveryRecord?.id) {
        await supabase
          .from('deliveries')
          .update({
            status: 'failed',
            error_message: errorMessage
          })
          .eq('id', deliveryRecord.id);
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          deliveryId
        },
        { status: whatsappResponse.status >= 500 ? 503 : 400 }
      );
    }

    // 8. Update delivery record to 'sent'
    if (deliveryRecord?.id) {
      await supabase
        .from('deliveries')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          error_message: null
        })
        .eq('id', deliveryRecord.id);
    }

    return NextResponse.json({
      success: true,
      deliveryId,
      messageId: result.messageId,
      shortId: finalShortId,
      bouquetUrl
    });
  } catch (error: any) {
    console.error('Unexpected error in send-surprise route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred while processing surprise delivery.'
      },
      { status: 500 }
    );
  }
}
