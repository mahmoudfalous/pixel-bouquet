'use client';

import React, { useState, useEffect } from 'react';
import { Bouquet } from '@/app/lib/bouquets';

interface SurpriseDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bouquet: Bouquet;
  shortId?: string;
  initialRecipientName?: string;
  senderName?: string;
  messageText?: string;
  onSuccess?: (shortId: string) => void;
}

type DeliveryStatus = 'idle' | 'sending' | 'success' | 'failure';

export default function SurpriseDeliveryModal({
  isOpen,
  onClose,
  bouquet,
  shortId: existingShortId,
  initialRecipientName = '',
  senderName = '',
  messageText = '',
  onSuccess
}: SurpriseDeliveryModalProps) {
  const [recipientName, setRecipientName] = useState(initialRecipientName);
  const [phoneNumber, setPhoneNumber] = useState('+20 ');
  const [status, setStatus] = useState<DeliveryStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [sentShortId, setSentShortId] = useState(existingShortId || '');
  const [isCopied, setIsCopied] = useState(false);

  // Reset modal state only when opened
  useEffect(() => {
    if (isOpen) {
      if (initialRecipientName) {
        setRecipientName(initialRecipientName);
      }
      setStatus('idle');
      setErrorMessage('');
      setSentShortId(existingShortId || '');
      if (!phoneNumber || phoneNumber.trim() === '') {
        setPhoneNumber('+20 ');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Clean and normalize phone number for validation & submission
  let cleanPhone = phoneNumber.trim().replace(/[^\d+]/g, '');
  // If user entered local Egyptian format (010..., 011..., etc.), convert to +201...
  if (cleanPhone.startsWith('01') && cleanPhone.length === 11) {
    cleanPhone = '+2' + cleanPhone;
  } else if ((cleanPhone.startsWith('10') || cleanPhone.startsWith('11') || cleanPhone.startsWith('12') || cleanPhone.startsWith('15')) && cleanPhone.length === 10) {
    cleanPhone = '+20' + cleanPhone;
  }

  const rawDigits = cleanPhone.replace(/\D/g, '');
  const isPhoneValid = rawDigits.length >= 8 && rawDigits.length <= 15;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneValid || status === 'sending') return;

    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/send-surprise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shortId: existingShortId || sentShortId || undefined,
          bouquetId: bouquet.id,
          bouquetDbId: bouquet.id,
          recipientName: recipientName.trim() || initialRecipientName || 'Someone Special',
          phoneNumber: cleanPhone,
          sender: senderName.trim() || 'A Friend',
          message: messageText.trim() || bouquet.meaning
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'تعذر إرسال الرسالة عبر واتساب، يرجى المحاولة مرة أخرى.');
      }

      const generatedId = data.shortId || existingShortId;
      setSentShortId(generatedId);
      setStatus('success');

      if (onSuccess && generatedId) {
        onSuccess(generatedId);
      }
    } catch (err: any) {
      console.error('Surprise delivery error:', err);
      setStatus('failure');
      setErrorMessage(err.message || 'حدث خطأ أثناء الاتصال بخدمة الإرسال.');
    }
  };

  const handleCopyLink = () => {
    const giftUrl = `${window.location.origin}/gift/${sentShortId}`;
    navigator.clipboard.writeText(giftUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#3D2B1F]/50 backdrop-blur-md transition-opacity"
        onClick={() => {
          if (status !== 'sending') onClose();
        }}
      />

      {/* Modal Container */}
      <div 
        className="relative bg-[#FFFDF9] border border-[#E8DDD3] rounded-[2.5rem] shadow-[0_25px_60px_rgba(61,43,31,0.25)] max-w-lg w-full p-8 md:p-10 z-10 overflow-hidden text-[#4A3B32] animate-in zoom-in-95 duration-300"
        dir="rtl"
      >
        {/* Subtle Background Glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-rose-200/40 rounded-full mix-blend-multiply blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-amber-100/40 rounded-full mix-blend-multiply blur-3xl pointer-events-none" />

        {/* Close Button */}
        {status !== 'sending' && (
          <button
            onClick={onClose}
            className="absolute top-6 left-6 w-9 h-9 rounded-full bg-white/80 border border-[#E8DDD3] flex items-center justify-center text-[#8A7A6F] hover:text-[#3D2B1F] hover:bg-white transition-all shadow-sm z-20"
            aria-label="Close"
          >
            ✕
          </button>
        )}

        {/* ========================================================= */}
        {/* STATE: IDLE or FAILURE (FORM)                             */}
        {/* ========================================================= */}
        {(status === 'idle' || status === 'failure') && (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 bg-[#FAF5F0] border border-[#E8DDD3] px-4 py-1.5 rounded-full text-[10px] font-bold text-[#C87E6F] uppercase tracking-widest mb-3">
                <span className="w-2 h-2 rounded-full bg-[#C87E6F] animate-pulse"></span>
                مفاجأة عبر واتساب
              </span>
              <h3 className="text-2xl md:text-3xl font-bold font-serif text-[#3D2B1F]">
                أرسل باقتك كهدية مفاجئة 💐
              </h3>
              <p className="text-xs text-[#8A7A6F] mt-2 leading-relaxed">
                هنبعت رسالة خاصة ومميزة للرقم اللي تختاره فيها رابط فتح الباقة السحرية.
              </p>
            </div>

            {/* Error Banner if Failure */}
            {status === 'failure' && (
              <div className="mb-6 bg-rose-50 border border-rose-200 p-4 rounded-2xl text-rose-800 text-xs flex items-start gap-3 animate-in fade-in duration-300">
                <span className="text-base leading-none">⚠️</span>
                <div className="flex-1 text-right">
                  <p className="font-bold">تعذر إرسال المفاجأة</p>
                  <p className="mt-0.5 text-[11px] opacity-90">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Bouquet Mini Preview */}
            <div className="bg-[#FAF5F0]/80 border border-white rounded-2xl p-3.5 mb-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-[#E8DDD3]/60 shadow-sm shrink-0">
                <img src={bouquet.image} alt={bouquet.name} className="w-11 h-11 object-contain drop-shadow-sm" />
              </div>
              <div className="text-right flex-1 min-w-0">
                <p className="text-[10px] text-[#C87E6F] font-bold uppercase tracking-wider">{bouquet.name}</p>
                <p className="text-xs text-[#3D2B1F] font-serif font-bold truncate">
                  {recipientName ? `إلى: ${recipientName}` : bouquet.description}
                </p>
                <p className="text-[10px] text-[#8A7A6F] truncate mt-0.5">{bouquet.meaning}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSend} className="space-y-4">
              {/* Recipient Name */}
              <div className="text-right">
                <label className="block text-xs font-bold text-[#3D2B1F] mb-1.5 font-serif">
                  اسم المستلم <span className="text-gray-400 font-normal text-[11px]">(اختياري)</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: سارة، محمد، لأغلى الناس..."
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-white/70 border border-[#E8DDD3] focus:border-[#C87E6F] focus:bg-white rounded-xl px-4 py-3 text-sm text-[#3D2B1F] placeholder:text-[#D4B5A8] outline-none transition-all shadow-inner"
                />
              </div>

              {/* WhatsApp Phone Number */}
              <div className="text-right">
                <label className="block text-xs font-bold text-[#3D2B1F] mb-1.5 font-serif">
                  رقم الواتساب <span className="text-[#C87E6F]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="+20 10 XXX XXXX أو 010XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    dir="ltr"
                    className="w-full bg-white/70 border border-[#E8DDD3] focus:border-[#C87E6F] focus:bg-white rounded-xl px-4 py-3 text-sm text-[#3D2B1F] placeholder:text-[#D4B5A8] outline-none transition-all shadow-inner text-left font-mono"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-base pointer-events-none opacity-60">
                    📱
                  </div>
                </div>
                <p className="text-[10px] text-[#8A7A6F] mt-1 text-right">
                  مُحدد تلقائياً لمصر (<span className="font-mono font-bold text-[#3D2B1F]">🇪🇬 +20</span>) — يمكنك كتابة رقم مصري مباشرة (مثل <span className="font-mono text-[#3D2B1F]">010...</span>) أو كود أي دولة أخرى.
                </p>
              </div>

              {/* Message Note & Preview */}
              <div className="bg-[#FAF5F0]/90 border border-[#E8DDD3] rounded-2xl p-4 text-[11px] text-[#6B5548] leading-relaxed text-right space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#3D2B1F] text-xs">
                  <span>💌</span>
                  <span>معاينة نص رسالة الواتساب:</span>
                </div>
                <div className="bg-white/90 rounded-xl p-3 border border-[#E8DDD3]/60 font-serif text-[12px] text-[#4A3B32] space-y-1.5 leading-relaxed shadow-xs">
                  <p>💐 عندك مفاجأة رقيقة جداً من القلب...</p>
                  <p className="text-[11px] text-[#8A7A6F]">في حد بيفكر فيك، واختارلك باقة ورد مخصوص عشان يفرّح قلبك 🌸✨</p>
                  <p className="text-[10px] text-[#C87E6F] font-mono">💌 رابط هديتك ورسالتك السرية...</p>
                  <div className="pt-1 border-t border-dashed border-[#E8DDD3] text-[10px] text-[#8A7A6F]">
                    <span>🌹 حابب تفرّح حد غالي عليك؟ اصنع باقتك من هنا (رابط المنصة)</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isPhoneValid}
                  className="w-full bg-[#3D2B1F] hover:bg-black text-white py-4 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-[0_10px_25px_rgba(61,43,31,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>أرسل المفاجأة الآن 💌</span>
                  <span className="group-hover:-translate-x-1 transition-transform">←</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* STATE: SENDING                                            */}
        {/* ========================================================= */}
        {status === 'sending' && (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
            {/* Animated Flower & Pulse */}
            <div className="relative w-28 h-28 flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full bg-rose-200/50 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-rose-100/70 animate-pulse" />
              <img
                src={bouquet.image}
                alt={bouquet.name}
                className="w-20 h-20 object-contain relative z-10 animate-bounce drop-shadow-md"
              />
            </div>

            <h4 className="text-xl font-bold font-serif text-[#3D2B1F] mb-2">
              بنجهّز ونبعت مفاجأتك بحب... 💌✨
            </h4>
            <p className="text-xs text-[#8A7A6F] max-w-xs leading-relaxed">
              جاري توصيل الباقة عبر واتساب إلى <span className="font-mono font-bold text-[#3D2B1F]" dir="ltr">{cleanPhone}</span>
            </p>

            <div className="mt-8 flex items-center gap-2 text-[10px] text-[#C87E6F] font-bold uppercase tracking-widest bg-rose-50 px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 bg-[#C87E6F] rounded-full animate-ping"></span>
              يرجى الانتظار لحظات
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STATE: SUCCESS                                            */}
        {/* ========================================================= */}
        {status === 'success' && (
          <div className="py-4 text-center animate-in zoom-in-95 duration-500">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-gradient-to-tr from-[#E8F3E9] to-white rounded-full flex items-center justify-center text-[#849F86] text-3xl shadow-md border border-[#849F86]/30 mx-auto mb-6">
              ✓
            </div>

            <span className="inline-block bg-[#E8F3E9] text-[#849F86] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">
              تم التوصيل بنجاح 🌸
            </span>

            <h3 className="text-2xl md:text-3xl font-bold font-serif text-[#3D2B1F] mb-2">
              وصلت مفاجأتك على واتساب! 💐✨
            </h3>

            <p className="text-xs text-[#8A7A6F] leading-relaxed max-w-xs mx-auto mb-6">
              تم إرسال رابط الباقة إلى <span className="font-mono font-bold text-[#3D2B1F]" dir="ltr">{cleanPhone}</span>. تقدر برضه تنسخ الرابط وتبعتله من هنا:
            </p>

            {/* Copy Link Row */}
            <div className="flex items-center bg-[#FAF5F0] border border-[#E8DDD3] rounded-2xl overflow-hidden p-1.5 mb-6 shadow-inner">
              <button
                onClick={handleCopyLink}
                className={`px-5 py-3 text-xs font-bold tracking-wide uppercase text-white rounded-xl transition-all shadow-sm ${
                  isCopied ? 'bg-[#849F86]' : 'bg-[#C87E6F] hover:bg-[#B56E5F]'
                }`}
              >
                {isCopied ? 'تم النسخ ✓' : 'نسخ الرابط'}
              </button>
              <input
                type="text"
                readOnly
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/gift/${sentShortId}`}
                className="flex-1 p-2.5 text-xs text-[#8A7A6F] bg-transparent outline-none text-left font-mono"
                dir="ltr"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-[#3D2B1F] hover:bg-black text-white py-3.5 px-4 rounded-xl text-xs font-bold tracking-wider transition-all shadow-md"
              >
                تم، شكراً 🌸
              </button>
              <a
                href={`/gift/${sentShortId}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-white hover:bg-[#FAF5F0] text-[#3D2B1F] border border-[#E8DDD3] py-3.5 px-4 rounded-xl text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-1 shadow-sm"
              >
                معاينة الهدية ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
