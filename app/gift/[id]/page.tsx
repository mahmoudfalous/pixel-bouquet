import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { supabase } from "@/app/lib/supabase";
import Petals from './Petals';

import { cache } from 'react';

import { BOUQUETS } from '@/app/lib/bouquets';
import GiftPresentation from './GiftPresentation';

const getGiftByShortId = cache(async (id: string) => {
  const { data, error } = await supabase
    .from('bouquets')
    .select('*')
    .eq('short_id', id)
    .single();

  if (error || !data) return null;

  return data;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const letter = await getGiftByShortId(id);

  if (!letter) {
    return {
      title: 'Gift Not Found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const flower = BOUQUETS.find((b) => b.id === letter.bouquet_id);
  const pageTitle = flower ? `${flower.name} Bouquet Gift` : 'Bouquet Gift';

  return {
    title: pageTitle,
    description: 'A private bouquet message waiting to be opened.',
    alternates: {
      canonical: `/gift/${id}`,
    },
    openGraph: {
      title: pageTitle,
      description: 'A private bouquet message waiting to be opened.',
      images: flower
        ? [
            {
              url: flower.image,
              alt: flower.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: 'A private bouquet message waiting to be opened.',
      images: flower ? [flower.image] : undefined,
    },
    // Gift pages include personal notes; avoid search indexing.
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nocache: true,
    },
  };
}

export default async function GiftPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const letter = await getGiftByShortId(id);

  if (!letter) notFound();

  const flower = BOUQUETS.find(b => b.id === letter.bouquet_id);
  if (!flower) notFound();

  return (
    <main className="min-h-screen bg-[#FDF8F2] flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden relative">

      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-rose-100/40 rounded-full mix-blend-multiply filter blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-100/30 rounded-full mix-blend-multiply filter blur-[80px] pointer-events-none" />

      {/* Falling petals — client component to avoid hydration mismatch */}
      <Petals />

      <GiftPresentation letter={letter} flower={flower} />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%   { transform: translate(-50%, 0px) rotate(-2deg); }
          50%  { transform: translate(-50%, -16px) rotate(2deg); }
          100% { transform: translate(-50%, 0px) rotate(-2deg); }
        }
      ` }} />

    </main>
  );
}