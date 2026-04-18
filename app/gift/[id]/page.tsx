import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { supabase } from "@/app/lib/supabase";
import Petals from './Petals';
import Link from 'next/link';
import { cache } from 'react';

const BOUQUETS = [
  { id: '1', name: 'Quiet Love', image: '/Quiet Love Bouquet.png' },
  { id: '2', name: 'Pink Elegance', image: '/Pink Roses & Lilies Flowers.png' },
  { id: '3', name: 'Crimson Fantasy', image: '/100 Red Roses.png' },
  { id: '4', name: 'Sunlit Chrysanthemum', image: '/Sunlit Chrysanthemum.png' },
  { id: '5', name: 'Ombre Mixed Roses', image: '/Ombre Mixed Roses.png' },
  { id: '6', name: 'Carnation Harmony', image: '/Carnation Rose Harmony.png' },
  { id: '7', name: 'Classic Carnations', image: '/Carnation Roses Bouquet.png' },
];

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

  return (
    <main className="min-h-screen bg-[#FDF8F2] flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden relative">

      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-rose-100/40 rounded-full mix-blend-multiply filter blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-100/30 rounded-full mix-blend-multiply filter blur-[80px] pointer-events-none" />

      {/* Falling petals — client component to avoid hydration mismatch */}
      <Petals />

      <div className="max-w-md w-full flex flex-col items-center relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out mt-20">

        {/* Arrival tag */}
        <p className="text-[#B08A7A] text-[10px] font-light uppercase tracking-[0.25em] mb-14 flex items-center gap-3">
          <span className="block w-9 h-px bg-[#D4B5A8]" />
          A gift has arrived for you
          <span className="block w-9 h-px bg-[#D4B5A8]" />
        </p>

        {/* Card */}
        <div className="relative w-full">

          {/* Floating flower */}
          <div className="absolute -top-24 left-1/2 w-48 h-48 flex items-center justify-center animate-[float_6s_ease-in-out_infinite] z-10">
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-rose-200/50 to-transparent blur-xl" />
            <img
              src={flower?.image}
              alt={flower?.name}
              className="w-44 h-44 object-contain relative z-10 drop-shadow-2xl"
            />
          </div>

          {/* Paper card */}
          <div
            className="bg-[#FFFDF9] rounded-[2rem] border border-[#EDE4D9] relative pt-28 pb-10 px-10"
            style={{
              boxShadow: '0 2px 8px rgba(160,100,80,0.05), 0 24px 64px rgba(160,100,80,0.09)',
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(210,190,170,0.13) 27px, rgba(210,190,170,0.13) 28px)',
            }}
          >
            {/* Corner botanicals */}
            <span className="absolute top-5 left-5 text-[#E1A9A0]/30 text-xl select-none -rotate-[18deg]">✿</span>
            <span className="absolute top-5 right-5 text-[#849F86]/30 text-xl select-none rotate-[12deg]">🌿</span>
            <span className="absolute bottom-6 left-5 text-[#E1A9A0]/25 text-xl select-none rotate-[8deg]">✾</span>
            <span className="absolute bottom-6 right-5 text-[#849F86]/25 text-xl select-none -rotate-[10deg]">🌿</span>

            {/* Letter body */}
            <div className="relative z-10">
              <h1 className="font-serif text-[#3D2B1F] mb-8">
                <span className="block text-[10px] font-sans font-light tracking-[0.18em] uppercase text-[#C4A898] mb-1">Dear</span>
                <span className="text-3xl">{letter.recipient},</span>
              </h1>

              <div className="border-l-2 border-[#E8DDD3] pl-5 mb-8">
                <p className="font-serif text-[15px] leading-[1.95] text-[#6B5548] italic whitespace-pre-wrap">
                  {letter.message}
                </p>
              </div>

              <div className="flex flex-col items-end border-t border-[#EDE4D9] pt-5">
                <span className="text-[10px] font-sans font-light tracking-[0.2em] uppercase text-[#C4A898] mb-1">Sincerely,</span>
                <span className="font-serif text-2xl text-[#3D2B1F]">{letter.sender}</span>
              </div>
            </div>

            {/* Wax seal */}
            <div
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white text-lg border-2 border-[#FDF8F2] z-20"
              style={{ background: 'radial-gradient(circle at 40% 35%, #D4766A, #A8443A)', boxShadow: '0 2px 10px rgba(168,68,58,0.35)' }}
            >
              ✦
            </div>
          </div>

          {/* Bouquet name pill */}
          <div className="flex items-center justify-center gap-2 mt-7">
            <span className="w-1 h-1 rounded-full bg-[#D9C4B8]" />
            <span className="bg-[#FAF5F0] border border-[#E8DDD3] rounded-full px-5 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#B08A7A]">
              {flower?.name}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#D9C4B8]" />
          </div>
        </div>

        <Link href="/" className="mt-14 text-xs font-light text-[#C4A898] hover:text-[#7A4F3D] transition-colors tracking-wide border-b border-[#D9C4B8] pb-0.5">
          Craft your own bouquet →
        </Link>

      </div>

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