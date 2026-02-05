'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Heart, X } from 'lucide-react';

export default function LoveQuestion() {
  const router = useRouter();
  const [fugas, setFugas] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [position, setPosition] = useState({ top: '0', left: '0' });
  const [showPopup, setShowPopup] = useState(false);

  const handleNoInteraction = () => {
    if (fugas < 3) {
      setHasMoved(true);
      const pad = 100;
      const x = Math.random() * (window.innerWidth - pad * 2) + pad;
      const y = Math.random() * (window.innerHeight - pad * 2) + pad;
      setPosition({ top: `${y}px`, left: `${x}px` });
      setFugas(fugas + 1);
    } else {
      setShowPopup(true);
    }
  };

  const handleYes = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff3333', '#ffffff', '#ffb3b3'],
    });
    setTimeout(() => router.push('/galery'), 1500);
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-[#f3f4f6] relative font-sans">
      <div
        className={`bg-white p-10 md:p-14 rounded-[40px] shadow-2xl max-w-sm w-full text-center flex flex-col items-center transition-all duration-500 ${showPopup ? 'blur-md scale-95 opacity-50' : 'opacity-100'}`}
      >
        <h1 className="text-[32px] md:text-[40px] font-medium text-[#c51d1d] mb-4 tracking-tight">
          Ramon, my love...
        </h1>

        <div className="space-y-4 mb-8 text-gray-600 leading-relaxed text-sm text-left max-h-[250px] overflow-y-auto px-2 custom-scrollbar">
          <p>
            It all started after Pride in Amsterdam. We walked through the
            streets and had a drink on the gay street. You thought I hadn't
            liked you on that first date, but little did you know, I already
            felt you would change my world for the better.
          </p>
          <p>
            With you, I can be myself without changing a thing. We said we
            wouldn't fall in love, but it happened so naturally. I know you're
            leaving in a few weeks, but I will still love you.
          </p>
          <p>
            When you find your reason for living and if you still want me in
            your life, I'll be here. I wish you the very best on your journey.
          </p>
          <p className="font-bold text-center text-red-500 text-lg">
            But before you go...
          </p>
        </div>

        <p className="text-[#374151] text-lg font-medium mb-10 italic">
          Will you be my boyfriend forever?
        </p>

        <div className="flex flex-col items-center w-full gap-4">
          <button
            onClick={handleYes}
            className="w-full bg-[#ff3333] text-white font-bold text-xl py-4 rounded-full shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            YES! ❤️
          </button>

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
                    zIndex: 50,
                  }
                : { position: 'relative' }
            }
            className={`px-10 py-2.5 rounded-full font-bold transition-all text-sm ${hasMoved ? 'bg-white text-[#ff3333] border-2 border-[#ff3333] shadow-xl' : 'bg-[#e5e7eb] text-[#6b7280]'}`}
          >
            No
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"
            onClick={() => setShowPopup(false)}
          ></div>
          <div className="relative bg-white p-8 rounded-[35px] shadow-2xl max-w-[340px] w-full text-center animate-in zoom-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Wait, Ramon! 🥺
            </h2>
            <p className="text-gray-500 mb-8">
              You tried to run away 3 times! My heart can't take it... Say YES
              and stay with me!
            </p>
            <button
              onClick={() => {
                setShowPopup(false);
                handleYes();
              }}
              className="w-full bg-red-500 text-white font-bold py-4 rounded-2xl shadow-md"
            >
              Okay, YES! ❤️
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
