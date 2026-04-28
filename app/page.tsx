'use client';

import { useState, useEffect } from 'react';
import { supabase } from "@/app/lib/supabase";
import { Bouquet, BOUQUETS } from "@/app/lib/bouquets";

interface SentGift {
  id: string;
  recipient: string;
  flowerName: string;
  date: string;
}

export default function Home() {
  const [selectedBouquet, setSelectedBouquet] = useState<Bouquet | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const [sentGifts, setSentGifts] = useState<SentGift[]>([]);

  useEffect(() => {
    const history = localStorage.getItem('pixel_bouquet_history');
    if (history) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSentGifts(JSON.parse(history));
      } catch (e) {
        console.error('Error parsing history', e);
      }
    }
  }, []);

  const isFormValid =
    recipient.trim().length > 0 &&
    message.trim().length > 0 &&
    sender.trim().length > 0;
  const isGenerateDisabled = !selectedBouquet || !isFormValid || isSaving;

  const handleGenerateLink = async () => {
    if (isGenerateDisabled || !selectedBouquet) return;

    setIsSaving(true);
    const shortId = Math.random().toString(36).substring(2, 9);

    const trimmedRecipient = recipient.trim();
    const trimmedMessage = message.trim();
    const trimmedSender = sender.trim();

    const { error } = await supabase
      .from('bouquets')
      .insert([
        {
          short_id: shortId,
          bouquet_id: selectedBouquet.id,
          recipient: trimmedRecipient,
          message: trimmedMessage,
          sender: trimmedSender,
        }
      ]);

    setIsSaving(false);

    if (error) {
      console.error("Error saving to database:", error);
      alert("Something went wrong saving your bouquet! Check the console.");
      return;
    }

    const newGift: SentGift = {
      id: shortId,
      recipient: trimmedRecipient,
      flowerName: selectedBouquet.name,
      date: new Date().toISOString(),
    };

    const updatedHistory = [newGift, ...sentGifts];
    setSentGifts(updatedHistory);
    localStorage.setItem('pixel_bouquet_history', JSON.stringify(updatedHistory));

    setGeneratedLink(`${window.location.origin}/gift/${shortId}`);
    setRecipient('');
    setMessage('');
    setSender('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2800);
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#4A3B32] p-6 md:p-12 font-sans relative overflow-hidden selection:bg-[#E1A9A0] selection:text-white">

      {/* Premium Ambient Backgrounds */}
      <div className="absolute -top-20 -left-20 w-[40vw] h-[40vw] bg-rose-200/20 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-[30vw] h-[30vw] bg-amber-100/30 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 w-[50vw] h-[50vw] bg-[#E8DDD3]/30 rounded-full mix-blend-multiply filter blur-[150px] pointer-events-none"></div>

      {/* Custom Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
          @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-12px); }
              100% { transform: translateY(0px); }
          }
          .animate-float {
              animation: float 5s ease-in-out infinite;
          }
          .animate-float-delayed {
              animation: float 6s ease-in-out 1.5s infinite;
          }
          .bg-noise {
              background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          }
          @keyframes shimmer {
              100% { transform: translateX(100%); }
          }
      `}} />

      {/* Toast Notification */}
      {isCopied && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-10 duration-500 ease-out">
          <div className="bg-white/80 backdrop-blur-xl border border-white text-[#4A3B32] px-8 py-4 rounded-full shadow-[0_10px_40px_rgba(160,100,80,0.15)] flex items-center gap-4">
            <div className="w-9 h-9 bg-gradient-to-tr from-[#E8F3E9] to-white rounded-full flex items-center justify-center text-[#849F86] shadow-sm border border-[#849F86]/20">
              <span className="text-xl">✓</span>
            </div>
            <div className="flex flex-col items-start" dir="rtl">
              <span className="font-bold text-sm tracking-tight text-[#4A3B32]">تم نسخ الرابط!</span>
              <span className="text-xs text-gray-500 font-medium">جاهز دلوقتي تبعت هديتك السحرية</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-16 text-center relative z-10 flex flex-col items-center">
        <span className="text-[#C87E6F] text-[10px] font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-4">
          <span className="w-8 h-px bg-[#C87E6F]/50"></span>
          Pixel Bouquet
          <span className="w-8 h-px bg-[#C87E6F]/50"></span>
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-[#3D2B1F] font-serif mb-4" dir="rtl">اعمل ذكرى متتنسيش</h1>
        <p className="text-[#8A7A6F] text-sm md:text-base font-medium tracking-wide" dir="rtl">اختار باقة تعبر بيها عن اللي في قلبك بجد</p>
      </header>

      {/* VIEW 1: THE PREMIUM GALLERY */}
      {!isDrafting && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto relative z-10">
          {BOUQUETS.map((bouquet) => (
            <div 
              key={bouquet.id} 
              className="bg-white/40 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex flex-col items-center text-center transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(160,100,80,0.1)] hover:bg-white/60 cursor-pointer group overflow-hidden"
              onClick={() => {
                setSelectedBouquet(bouquet);
                setIsDrafting(true);
              }}
            >
              {/* Image Container */}
              <div className="relative w-full h-56 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-radial from-rose-100/40 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img
                  src={bouquet.image}
                  alt={bouquet.name}
                  className="w-48 h-48 object-contain relative z-10 drop-shadow-[0_10px_15px_rgba(160,100,80,0.2)] group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-700"
                />
              </div>
              
              <div className="flex flex-col items-center w-full z-10">
                <span className="text-[10px] text-[#C87E6F] font-bold uppercase tracking-widest mb-2">{bouquet.name}</span>
                <h3 className="font-bold text-lg text-[#3D2B1F] font-serif mb-3" dir="rtl">{bouquet.description.split(' ')[0]} {bouquet.description.split(' ')[1]}...</h3>
                <p className="text-xs text-[#8A7A6F] line-clamp-2 px-2 leading-relaxed mb-6 transition-all duration-500 group-hover:opacity-0" dir="rtl">{bouquet.meaning}</p>
                
                {/* Action Button that slides up on hover */}
                <div className="absolute bottom-8 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <span className="bg-[#3D2B1F] text-white px-8 py-3 rounded-full text-xs font-bold tracking-wider hover:bg-black transition-colors shadow-lg">
                    اكتب رسالتك
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: THE LUXURY CUSTOMIZATION FORM */}
      {isDrafting && selectedBouquet && (
        <div className="max-w-6xl mx-auto relative z-10">
          <button
            onClick={() => {
              setIsDrafting(false);
              setGeneratedLink('');
              setIsCopied(false);
            }}
            className="text-xs text-[#8A7A6F] hover:text-[#3D2B1F] mb-10 flex items-center gap-2 transition-colors relative font-medium uppercase tracking-widest"
          >
            <span className="text-lg">←</span> ارجع للورد
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">

            {/* Left Column: Bouquet Showcase (Premium Glass Card) */}
            <div className="animate-float flex justify-center sticky top-10">
              <div className="bg-white/40 backdrop-blur-2xl p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(160,100,80,0.1)] border border-white/60 w-full max-w-sm flex flex-col items-center relative overflow-hidden">
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/30 rounded-full mix-blend-multiply blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-100/30 rounded-full mix-blend-multiply blur-2xl"></div>

                <div className="w-full h-64 bg-gradient-to-br from-white/60 to-white/10 rounded-t-[2rem] rounded-b-xl mb-6 flex items-center justify-center relative overflow-hidden shadow-[inset_0_2px_10px_rgba(255,255,255,0.8)] border border-white/50">
                  <div className="absolute inset-0 bg-gradient-radial from-rose-50/50 to-transparent"></div>
                  <img
                    src={selectedBouquet.image}
                    alt={selectedBouquet.name}
                    className="w-48 h-48 object-contain drop-shadow-[0_15px_15px_rgba(160,100,80,0.3)] z-10 hover:scale-105 transition-transform duration-700"
                  />
                </div>
                
                <h3 className="text-[11px] text-[#C87E6F] font-bold uppercase tracking-[0.2em] mb-1">{selectedBouquet.name}</h3>
                
                <div className="w-full space-y-4 mt-4 relative z-10">
                  <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white shadow-sm">
                    <p className="text-[10px] text-[#C87E6F] font-bold mb-2 uppercase tracking-widest text-center">✨ الحكاية ✨</p>
                    <p className="text-[12px] text-[#6B5548] text-center italic leading-relaxed font-serif" dir="rtl">{selectedBouquet.story}</p>
                  </div>

                  <div className="bg-[#FAF5F0]/80 backdrop-blur-md p-5 rounded-2xl border border-white shadow-sm">
                    <p className="text-[10px] text-[#849F86] font-bold mb-2 uppercase tracking-widest text-center">✿ معنى الوردة ✿</p>
                    <p className="text-[12px] text-[#6B5548] text-center leading-relaxed" dir="rtl">{selectedBouquet.meaning}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: The Letter Editor */}
            <div className="flex flex-col animate-in fade-in slide-in-from-right-8 duration-1000">
              
              <div className="text-right mb-10" dir="rtl">
                <span className="text-[10px] text-[#8A7A6F] uppercase tracking-[0.2em] font-bold">رسالتك من القلب</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 text-[#3D2B1F] font-serif">
                  أرسل <span className="text-[#C87E6F] italic">{selectedBouquet.name}</span>
                </h2>
              </div>

              <div className="bg-[#FFFDF9] p-10 md:p-14 rounded-[3rem] shadow-[0_10px_40px_rgba(160,100,80,0.08)] border border-[#E8DDD3] relative mb-10 overflow-hidden">
                
                {/* Paper texture */}
                <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>

                <div className="flex flex-col space-y-10 z-10 relative px-2" dir="rtl">
                  
                  <div className="flex items-end gap-4">
                    <label className="text-xl font-serif text-[#3D2B1F]">إلى</label>
                    <input
                      type="text"
                      placeholder="لأغلى حد،"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="flex-1 bg-transparent text-2xl font-serif text-[#6B5548] focus:text-[#3D2B1F] focus:outline-none border-b-2 border-dashed border-[#E8DDD3] focus:border-[#C87E6F] pb-2 transition-colors placeholder:text-[#D4B5A8]"
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder="اكتب اللي في قلبك هنا... سيب كلامك ينوّر زي الورد ده..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="w-full bg-transparent text-lg md:text-xl font-serif leading-[2.2] text-[#6B5548] resize-none focus:outline-none border-b-2 border-dashed border-[#E8DDD3] focus:border-[#C87E6F] pb-2 transition-colors placeholder:text-[#D4B5A8]"
                    />
                  </div>

                  <div className="flex flex-col items-start pt-4">
                    <label className="text-lg font-serif text-[#3D2B1F] mb-2">بكل حُب،</label>
                    <input
                      type="text"
                      placeholder="المرسل"
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      className="w-64 bg-transparent text-xl font-serif text-[#6B5548] focus:text-[#3D2B1F] focus:outline-none border-b-2 border-dashed border-[#E8DDD3] focus:border-[#C87E6F] pb-2 transition-colors placeholder:text-[#D4B5A8]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgba(160,100,80,0.06)] border border-white/60">
                {!generatedLink ? (
                  <button
                    onClick={handleGenerateLink}
                    disabled={isGenerateDisabled}
                    className="w-full relative overflow-hidden group bg-[#3D2B1F] text-white px-8 py-5 rounded-full font-bold tracking-widest uppercase text-sm transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(61,43,31,0.3)] hover:shadow-[0_15px_30px_rgba(61,43,31,0.4)]"
                  >
                    <span className="relative z-10">{isSaving ? 'بنجهّز هديتك...' : 'إنشاء رابط الهدية'}</span>
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
                  </button>
                ) : (
                  <div className="text-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">
                    <p className="text-sm text-[#3D2B1F] font-bold mb-4 uppercase tracking-widest">رابط هديتك جاهز!</p>
                    <div className="flex items-center bg-[#FFFDF9] border border-[#E8DDD3] rounded-2xl overflow-hidden shadow-inner p-1.5">
                      <button
                        onClick={handleCopyLink}
                        className={`px-8 py-4 text-xs font-bold tracking-widest uppercase text-white rounded-xl transition-all duration-300 min-w-[140px] shadow-sm ${
                          isCopied ? 'bg-[#849F86] hover:bg-[#728A74]' : 'bg-[#C87E6F] hover:bg-[#B56E5F]'
                        }`}
                      >
                        {isCopied ? 'تم النسخ' : 'نسخ الرابط'}
                      </button>
                      <input
                        type="text"
                        readOnly
                        value={generatedLink}
                        className="flex-1 p-4 text-sm text-[#8A7A6F] bg-transparent outline-none text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW 3: SENT GIFTS HISTORY */}
      {!isDrafting && sentGifts.length > 0 && (
        <div className="max-w-6xl mx-auto mt-32 relative z-10 animate-in fade-in duration-1000 mb-20">
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className="w-12 h-px bg-[#D4B5A8]"></span>
            <h2 className="text-2xl font-serif text-[#3D2B1F] tracking-wide" dir="rtl">سجل هداياك</h2>
            <span className="w-12 h-px bg-[#D4B5A8]"></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sentGifts.map((gift) => (
              <div key={gift.id} className="bg-white/40 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-white/60 flex flex-col transition-all hover:bg-white/60 hover:-translate-y-1 hover:shadow-md" dir="rtl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] text-[#C87E6F] font-bold uppercase tracking-widest mb-1">{gift.flowerName}</p>
                    <p className="font-serif text-lg text-[#3D2B1F]">إلى: {gift.recipient}</p>
                  </div>
                  <span className="text-xs text-[#8A7A6F] font-light">
                    {new Date(gift.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                
                <div className="flex gap-2 mt-auto pt-4 border-t border-[#E8DDD3]/50">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/gift/${gift.id}`);
                      alert('تم نسخ الرابط بنجاح!');
                    }}
                    className="flex-1 bg-transparent hover:bg-[#FDFBF7] text-[#849F86] border border-[#849F86]/30 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
                  >
                    نسخ الرابط
                  </button>
                  <a
                    href={`/gift/${gift.id}`}
                    target="_blank"
                    className="flex-1 flex justify-center items-center bg-[#C87E6F] hover:bg-[#B56E5F] text-white px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
                  >
                    عرض الهدية
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </main>
  );
}