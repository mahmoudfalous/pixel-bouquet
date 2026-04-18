'use client';

import { useState } from 'react';
import { supabase } from "@/app/lib/supabase";

type Bouquet = {
  id: string;
  name: string;
  description: string;
  image: string;
};

const BOUQUETS: Bouquet[] = [
  {
    id: '1',
    name: 'Quiet Love',
    description: 'Soft pink roses cradled in clouds of baby\'s breath.',
    image: '/Quiet Love Bouquet.png'
  },
  {
    id: '2',
    name: 'Pink Elegance',
    description: 'A delicate arrangement of pink roses and lilies for a subtle romantic gesture.',
    image: '/Pink Roses & Lilies Flowers.png'
  },
  {
    id: '3',
    name: 'Crimson Fantasy',
    description: 'Deep red roses embodying classic romance and bold affection.',
    image: '/100 Red Roses.png'
  },
  {
    id: '4',
    name: 'Sunlit Chrysanthemum',
    description: 'Bright and warm blooms to bring joy and light to any room.',
    image: '/Sunlit Chrysanthemum.png'
  },
  {
    id: '5',
    name: 'Ombre Mixed Roses',
    description: 'A stunning gradient of mixed roses for a truly unique aesthetic.',
    image: '/Ombre Mixed Roses.png'
  },
  {
    id: '6',
    name: 'Carnation Harmony',
    description: 'Beautifully arranged carnations and roses symbolizing deep appreciation.',
    image: '/Carnation Rose Harmony.png'
  },
  {
    id: '7',
    name: 'Classic Carnations',
    description: 'A timeless bouquet of vibrant carnations to express pure admiration.',
    image: '/Carnation Roses Bouquet.png'
  },
];

export default function Home() {
  const [selectedBouquet, setSelectedBouquet] = useState<Bouquet | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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
    }, 2800); // Slightly longer duration for a softer feel
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#4A3B32] p-8 font-sans relative overflow-hidden">

      {/* Custom CSS for animations */}
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
              animation: float 5s ease-in-out 2.5s infinite;
          }
      `}} />

      {/* LOVELY TOP POPUP (Toast) */}
      {isCopied && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-10 duration-500 ease-out">
          {/* Main Popup Body */}
          <div className="bg-[#FAF9F7] border border-[#EBE6E0] text-[#4A3B32] px-8 py-4 rounded-full shadow-2xl flex items-center gap-4">

            {/* The Icon Wrapper (Soft Pastel Green circle) */}
            <div className="w-9 h-9 bg-[#E8F3E9] rounded-full flex items-center justify-center text-[#849F86] shadow-inner">
              <span className="text-xl">✓</span>
            </div>

            {/* The Text */}
            <div className="flex flex-col items-start">
              <span className="font-bold text-sm tracking-tight text-[#4A3B32]">Link copied!</span>
              <span className="text-xs text-gray-500 font-medium">Ready to share your memory</span>
            </div>
          </div>

          {/* Subtle connecting tail (Pure CSS aesthetic touch) */}
          <div className="w-4 h-4 bg-white border border-[#EBE6E0] border-t-0 border-r-0 rotate-45 absolute -bottom-2 left-1/2 -translate-x-1/2 -z-10 shadow-lg"></div>
        </div>
      )}

      <header className="mb-12 text-center relative z-10">
        <h1 className="text-4xl font-bold text-[#4A3B32]">Make something unforgettable</h1>
      </header>

      {/* VIEW 1: THE GALLERY */}
      {!isDrafting && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10">
          {BOUQUETS.map((bouquet) => (
            <div key={bouquet.id} className="bg-white p-6 rounded-3xl shadow-sm border border-[#EBE6E0] flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-md cursor-pointer duration-300">
              <img
                src={bouquet.image}
                alt={bouquet.name}
                className="w-48 h-48 object-contain mb-4 drop-shadow-md"
              />
              <h3 className="font-bold text-lg text-[#4A3B32]">{bouquet.name}</h3>
              <p className="text-xs text-gray-500 mt-2 mb-6 line-clamp-2 px-2">{bouquet.description}</p>
              <button
                onClick={() => {
                  setSelectedBouquet(bouquet);
                  setIsDrafting(true);
                }}
                className="bg-[#3D2C23] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-black transition mt-auto"
              >
                Craft Bouquet
              </button>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: THE CUSTOMIZATION FORM */}
      {isDrafting && selectedBouquet && (
        <div className="max-w-6xl mx-auto relative z-10">
          <button
            onClick={() => {
              setIsDrafting(false);
              setGeneratedLink('');
              setIsCopied(false);
            }}
            className="text-sm text-gray-400 hover:text-[#4A3B32] mb-8 flex items-center gap-2 transition-colors relative"
          >
            <span>←</span> Back to Gallery
          </button>

          <div className="text-center mb-12">
            <span className="text-sm text-gray-400 uppercase tracking-widest">A small ceremony</span>
            <h2 className="text-4xl font-bold mt-2 text-[#4A3B32]">
              Send your <span className="italic font-serif text-[#C87E6F]">{selectedBouquet.name}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 items-center">

            {/* Left Column: Bouquet Summary (Floating) */}
            <div className="animate-float flex justify-center">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#EBE6E0] max-w-sm w-full flex flex-col items-start">
                <div className="w-full h-72 bg-[#F8F9F5] rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#FDFBF7] to-transparent opacity-50"></div>
                  <img
                    src={selectedBouquet.image}
                    alt={selectedBouquet.name}
                    className="w-56 h-56 object-contain drop-shadow-xl z-10"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#4A3B32]">{selectedBouquet.name}</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{selectedBouquet.description}</p>
              </div>
            </div>

            {/* Right Column: The Letter Card (Floating Delayed) */}
            <div className="flex flex-col">
              <div className="animate-float-delayed bg-[#FAF9F7] p-10 rounded-3xl shadow-md border border-[#EBE6E0] relative mb-8">

                <div className="absolute top-4 left-4 text-[#C87E6F] opacity-50 text-2xl">✿</div>
                <div className="absolute bottom-4 right-4 text-[#849F86] opacity-50 text-2xl">🌿</div>

                <div className="flex flex-col space-y-8 z-10 relative px-4">

                  <div className="flex items-end gap-3">
                    <label className="text-lg font-serif text-[#4A3B32]">Dear</label>
                    <input
                      type="text"
                      placeholder="Beloved,"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="flex-1 bg-transparent text-xl font-serif text-[#8A9A9D] focus:text-[#4A3B32] focus:outline-none border-b border-dashed border-gray-300 focus:border-[#C87E6F] pb-1 transition-colors placeholder:text-gray-300"
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder="I have so much to tell you, but only this much space on this card! Still, you must know..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="w-full bg-transparent text-lg font-serif leading-relaxed text-gray-600 resize-none focus:outline-none border-b border-dashed border-gray-300 focus:border-[#C87E6F] pb-1 transition-colors placeholder:text-gray-300"
                    />
                  </div>

                  <div className="flex flex-col items-end pt-4">
                    <label className="text-lg font-serif text-[#4A3B32] mb-1">Sincerely,</label>
                    <input
                      type="text"
                      placeholder="Secret Admirer"
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      className="w-64 bg-transparent text-xl text-right font-serif text-[#8A9A9D] focus:text-[#4A3B32] focus:outline-none border-b border-dashed border-gray-300 focus:border-[#C87E6F] pb-1 transition-colors placeholder:text-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EBE6E0]">
                {!generatedLink ? (
                  <button
                    onClick={handleGenerateLink}
                    disabled={isGenerateDisabled}
                    className="w-full bg-[#3D2C23] text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {isSaving ? 'Crafting...' : 'Create shareable link'}
                  </button>
                ) : (
                  <div className="text-center w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <p className="text-sm text-[#4A3B32] font-semibold mb-3">Your link is ready!</p>
                    <div className="flex items-center bg-[#FAF9F7] border border-[#EBE6E0] rounded-xl overflow-hidden shadow-inner">
                      <input
                        type="text"
                        readOnly
                        value={generatedLink}
                        className="flex-1 p-4 text-sm text-gray-600 bg-transparent outline-none"
                      />
                      <button
                        onClick={handleCopyLink}
                        className={`px-6 py-4 text-sm font-bold text-white transition-colors min-w-[120px] ${
                          isCopied ? 'bg-green-600 hover:bg-green-700' : 'bg-[#C87E6F] hover:bg-[#b06a5d]'
                        }`}
                      >
                        {isCopied ? 'Copied!' : 'Copy Link'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}