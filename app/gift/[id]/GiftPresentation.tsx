"use client";

import { useState, useRef, useEffect } from 'react';
import anime from 'animejs';
import Link from 'next/link';

import { Bouquet } from '@/app/lib/bouquets';

type Letter = {
  recipient: string;
  message: string;
  sender: string;
};

export default function GiftPresentation({ letter, flower }: { letter: Letter; flower: Bouquet }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const flowerRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    if (isOpen) {
      const tl = anime.timeline({
        easing: 'easeOutExpo',
      });

      // Animate the flower
      tl.add({
        targets: flowerRef.current,
        scale: flower.animation.entrance.scale,
        opacity: [0, 1],
        translateY: flower.animation.entrance.translateY,
        rotate: flower.animation.entrance.rotate,
        duration: flower.animation.entrance.duration,
        easing: flower.animation.entrance.easing,
      })
      // Animate the card
      .add({
        targets: cardRef.current,
        translateY: [100, 0],
        opacity: [0, 1],
        duration: 1500,
      }, '-=1500')
      // Animate the text inside the card
      .add({
        targets: cardRef.current?.querySelectorAll('.animate-text'),
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: anime.stagger(200),
      }, '-=1000')
      // Animate the flower details/meaning
      .add({
        targets: detailsRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 1200,
      }, '-=800');

      // Add continuous float to flower after entrance
      setTimeout(() => {
        if (flowerRef.current) {
          anime({
            targets: flowerRef.current,
            translateY: flower.animation.idle.translateY,
            rotate: flower.animation.idle.rotate,
            scale: flower.animation.idle.scale || 1,
            direction: 'alternate',
            loop: true,
            easing: flower.animation.idle.easing,
            duration: flower.animation.idle.duration,
          });
        }
      }, flower.animation.entrance.duration);
    }
  }, [isOpen, flower]);

  return (
    <div className="max-w-md w-full flex flex-col items-center relative z-10 mt-20" ref={containerRef}>
      
      {!isOpen ? (
        <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-1000 h-[60vh]">
          <div 
            onClick={handleOpen}
            className="cursor-pointer group relative w-56 h-56 flex items-center justify-center rounded-full transition-all duration-700 hover:scale-[1.03]"
          >
            {/* Ambient rotating aura behind the orb */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#E1A9A0]/30 to-[#D4B5A8]/10 blur-xl group-hover:blur-2xl transition-all duration-700 animate-[spin_10s_linear_infinite]"></div>

            {/* The Crystal Orb Base */}
            <div className="absolute inset-2 rounded-full bg-white/10 backdrop-blur-[12px] border border-white/60 shadow-[inset_0_-20px_40px_rgba(255,255,255,0.4),_inset_0_20px_40px_rgba(255,255,255,0.8),_0_15px_35px_rgba(160,100,80,0.2)] overflow-hidden transition-all duration-700 group-hover:bg-white/20">
              
              {/* Inner magic glow */}
              <div className="absolute inset-0 bg-gradient-radial from-rose-50/40 via-transparent to-transparent opacity-80"></div>

              {/* The Flower Inside */}
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:-translate-y-2">
                <img 
                  src={flower.image} 
                  alt="Gift preview" 
                  className="w-36 h-36 object-contain opacity-90 transition-all duration-700 drop-shadow-[0_15px_15px_rgba(160,100,80,0.4)] saturate-[1.1] contrast-[1.05]" 
                />
              </div>

              {/* Glass Specular Highlight (The curved reflection on top) */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4/5 h-2/5 bg-gradient-to-b from-white/90 to-transparent rounded-[100%] opacity-70 pointer-events-none"></div>
              
              {/* Glass Specular Highlight (Bottom reflection) */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2/3 h-1/4 bg-gradient-to-t from-white/60 to-transparent rounded-[100%] opacity-50 pointer-events-none"></div>
            </div>
            
            {/* Premium Gold-accented 'Tap to Reveal' Pill */}
            <div className="absolute -bottom-1 z-20 bg-[#FFFDF9] px-7 py-2.5 rounded-full shadow-[0_8px_25px_rgba(160,100,80,0.25)] border border-[#E8DDD3] transition-transform duration-500 group-hover:-translate-y-2 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4B5A8] animate-pulse"></span>
              <span className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-[#8A6A5A]">افتح الهدية</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4B5A8] animate-pulse"></span>
            </div>
            
            {/* Subtle expanding ring effect */}
            <span className="absolute inset-2 rounded-full border border-white opacity-0 group-hover:animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] pointer-events-none"></span>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center mt-10">
          {/* Arrival tag */}
          <p className="text-[#B08A7A] text-[10px] font-light uppercase tracking-[0.25em] mb-14 flex items-center gap-3 opacity-0 animate-[fadeIn_1s_forwards]" dir="rtl">
            <span className="block w-9 h-px bg-[#D4B5A8]" />
            في هدية وصلتلك
            <span className="block w-9 h-px bg-[#D4B5A8]" />
          </p>

          <div className="relative w-full">
            {/* Floating flower */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 flex items-center justify-center z-10 pointer-events-none">
              <div className="absolute inset-0 rounded-full bg-gradient-radial from-rose-200/50 to-transparent blur-xl" />
              <img
                ref={flowerRef}
                src={flower.image}
                alt={flower.name}
                className="w-44 h-44 object-contain relative z-10 drop-shadow-2xl opacity-0"
              />
            </div>

            {/* Paper card */}
            <div
              ref={cardRef}
              className="bg-[#FFFDF9] rounded-[2rem] border border-[#EDE4D9] relative pt-28 pb-10 px-10 opacity-0"
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
                <h1 className="font-serif text-[#3D2B1F] mb-8 animate-text opacity-0" dir="rtl">
                  <span className="block text-[10px] font-sans font-light tracking-[0.18em] uppercase text-[#C4A898] mb-1">لـ</span>
                  <span className="text-3xl">{letter.recipient}،</span>
                </h1>

                <div className="border-l-2 border-[#E8DDD3] pl-5 mb-8 animate-text opacity-0">
                  <p className="font-serif text-[15px] leading-[1.95] text-[#6B5548] italic whitespace-pre-wrap">
                    {letter.message}
                  </p>
                </div>

                <div className="flex flex-col items-end border-t border-[#EDE4D9] pt-5 animate-text opacity-0" dir="rtl">
                  <span className="text-[10px] font-sans font-light tracking-[0.2em] uppercase text-[#C4A898] mb-1">من</span>
                  <span className="font-serif text-2xl text-[#3D2B1F]">{letter.sender}</span>
                </div>
              </div>

              {/* Wax seal */}
              <div
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white text-lg border-2 border-[#FDF8F2] z-20 animate-text opacity-0"
                style={{ background: 'radial-gradient(circle at 40% 35%, #D4766A, #A8443A)', boxShadow: '0 2px 10px rgba(168,68,58,0.35)' }}
              >
                ✦
              </div>
            </div>

            {/* Bouquet Details */}
            <div ref={detailsRef} className="opacity-0 mt-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-1 h-1 rounded-full bg-[#D9C4B8]" />
                <span className="bg-[#FAF5F0] border border-[#E8DDD3] rounded-full px-5 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#B08A7A]">
                  {flower.name}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#D9C4B8]" />
              </div>
              
              <div className="bg-white/70 backdrop-blur-md border border-[#E8DDD3]/60 p-6 rounded-2xl shadow-lg text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent"></div>
                <div className="relative z-10">
                  <p className="text-[#C87E6F] text-[10px] font-bold mb-3 uppercase tracking-widest">✨ حكاية الوردة دي ✨</p>
                  <p className="text-sm font-serif text-[#5a483d] leading-relaxed mb-5 px-2" dir="rtl">
                    {flower.story}
                  </p>
                  
                  <div className="w-12 h-px bg-[#E8DDD3] mx-auto mb-5"></div>
                  
                  <p className="text-[#849F86] text-[10px] font-bold mb-2 uppercase tracking-widest">✿ معنى الوردة ✿</p>
                  <p className="text-[13px] font-serif text-[#8A7A6F] italic leading-relaxed" dir="rtl">
                    &quot;{flower.meaning}&quot;
                  </p>
                </div>
              </div>
            </div>

          </div>

          <Link href="/" className="mt-14 mb-10 text-xs font-light text-[#C4A898] hover:text-[#7A4F3D] transition-colors tracking-wide border-b border-[#D9C4B8] pb-0.5 opacity-0 animate-[fadeIn_1s_forwards] delay-1000" dir="rtl">
            اعمل باقة بنفسك ←
          </Link>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
    </div>
  );
}
