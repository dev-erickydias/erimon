'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Heart, X } from 'lucide-react';

export default function LoveQuestion() {
  const router = useRouter();

  // States for the "No" button's escape logic and popup
  const [fugas, setFugas] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [position, setPosition] = useState({ top: '0', left: '0' });
  const [showPopup, setShowPopup] = useState(false);

  // Logic for the "No" button: escape 3 times, then show popup
  const handleNoInteraction = () => {
    if (fugas < 3) {
      setHasMoved(true);
      const pad = 100; // Padding to keep button from going off-screen
      const x = Math.random() * (window.innerWidth - pad * 2) + pad;
      const y = Math.random() * (window.innerHeight - pad * 2) + pad;
      setPosition({ top: `${y}px`, left: `${x}px` });
      setFugas(fugas + 1);
    } else {
      setShowPopup(true); // After 3 escapes, show the loving popup
    }
  };

  // Logic for the "YES!" button: confetti and navigate to gallery
  const handleYes = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff3333', '#ffffff', '#ffb3b3'], // Red, white, light pink confetti
    });

    // Small delay to let him see the confetti
    setTimeout(() => {
      router.push('/galery'); // Redirects to the '/galery' route
    }, 1500);
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-[#f3f4f6] relative font-sans">
      {/* Main Card */}
      <div
        className={`bg-white p-10 md:p-16 rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] max-w-sm w-full text-center flex flex-col items-center transition-all duration-500 ${showPopup ? 'blur-md scale-95 opacity-50' : 'opacity-100'}`}
      >
        <h1 className="text-[32px] md:text-[42px] font-medium text-[#c51d1d] mb-4 tracking-tight">
          Ramon, my love...
        </h1>

        {/* Your Story - Translated to English */}
        <div className="space-y-4 mb-8 text-gray-600 leading-relaxed text-sm md:text-base text-left max-h-[280px] overflow-y-auto px-2 scrollbar-hide">
          <p>
            It all started after Pride in Amsterdam, wandering through the
            streets, ending with a drink on Reguliersdwarsstraat. You thought I
            hadn't liked you on that first date, but little did you know, right
            there, I already felt you would change my world.
          </p>
          <p>
            With you, I learned I can truly be myself, unfiltered and without
            needing to change anything to please you. We tried to fight against
            it, said we wouldn't fall in love... but love was stronger and
            happened in the most natural way possible.
          </p>
          <p>
            I know you're leaving in a few weeks, and although time seems to
            have flown by, what I feel is eternal. I want you to find your
            reason for living on this new journey and know that, if our paths
            ever cross again with the same vibe, I'll be here. I wish for your
            happiness above all.
          </p>
          <p className="font-bold text-center text-red-500 text-lg mt-4">
            But before you go, I need to ask you...
          </p>
        </div>

        {/* The Final Question */}
        <p className="text-[#374151] text-lg md:text-xl font-medium mb-12">
          Will you be my boyfriend forever?
        </p>

        {/* Buttons Container */}
        <div className="flex flex-col items-center w-full gap-5">
          {/* YES! Button */}
          <button
            onClick={handleYes}
            className="w-full max-w-[220px] bg-[#ff3333] hover:bg-[#e62e2e] text-white font-bold text-xl py-4 rounded-full shadow-lg shadow-red-100 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer z-30"
          >
            YES! <Heart size={20} fill="currentColor" />
          </button>

          {/* NO Button - Escaping until 3 attempts */}
          <button
            onMouseEnter={handleNoInteraction}
            onClick={handleNoInteraction}
            style={
              hasMoved
                ? {
                    position: 'fixed',
                    top: position.top,
                    left: position.left,
                    transform: 'translate(-50%, -50%)',
                    transition: 'all 0.2s ease-out',
                    zIndex: 50,
                  }
                : {
                    position: 'relative',
                  }
            }
            className={`px-10 py-2.5 rounded-full font-bold transition-all text-sm cursor-pointer ${
              hasMoved
                ? 'bg-white text-[#ff3333] border-2 border-[#ff3333] shadow-xl'
                : 'bg-[#e5e7eb] text-[#6b7280] hover:bg-[#d1d5db]'
            }`}
          >
            No
          </button>
        </div>
      </div>

      {/* Loving Popup (appears after 3 "No" button escapes) */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay background */}
          <div
            className="absolute inset-0 bg-black/10 backdrop-blur-[1px] animate-in fade-in duration-300"
            onClick={() => setShowPopup(false)}
          ></div>

          {/* Popup Card */}
          <div className="relative bg-white p-8 rounded-[35px] shadow-[0_20px_60px_rgba(0,0,0,0.1)] max-w-[340px] w-full text-center animate-in zoom-in duration-300 border border-gray-50">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-6 flex justify-center text-red-500">
              <div className="bg-red-50 p-4 rounded-full animate-pulse">
                <Heart size={40} fill="currentColor" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Wait, Ramon! 🥺
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              You tried to run away 3 times! My heart can't take it...
              <br />
              <br />
              You don't really mean that, do you? Say YES and stay with me!
            </p>

            <button
              onClick={() => {
                setShowPopup(false);
                handleYes();
              }}
              className="w-full bg-red-500 text-white font-bold py-4 rounded-2xl hover:bg-red-600 transition-all shadow-md active:scale-95"
            >
              Okay, YES! ❤️
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="fixed bottom-6 text-[#9ca3af] text-xs font-medium uppercase tracking-[0.2em]">
        Ericky + Ramon
      </p>
    </main>
  );
}
