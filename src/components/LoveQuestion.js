'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Heart, ChevronRight, ArrowLeft } from 'lucide-react';

export default function LoveQuestion() {
  const router = useRouter();
  const [showProposal, setShowProposal] = useState(false);
  const [fugas, setFugas] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [position, setPosition] = useState({ top: '0', left: '0' });

  const handleNext = () => setShowProposal(true);

  const handleNo = () => {
    if (fugas < 3) {
      setHasMoved(true);
      const pad = 100;
      const x = Math.random() * (window.innerWidth - pad * 2) + pad;
      const y = Math.random() * (window.innerHeight - pad * 2) + pad;
      setPosition({ top: `${y}px`, left: `${x}px` });
      setFugas(fugas + 1);
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
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-[#f3f4f6]">
      <div className="bg-white p-8 md:p-14 rounded-[40px] shadow-2xl max-w-md w-full text-center animate-in zoom-in duration-500">
        {!showProposal ? (
          /* PAGE 1: THE FULL STORY */
          <div className="animate-in fade-in duration-700">
            <h1 className="text-3xl font-romantic text-[#c51d1d] mb-6">
              Dear Ramon...
            </h1>

            <div className="text-gray-600 text-[15px] text-left space-y-4 mb-8 leading-relaxed max-h-[380px] overflow-y-auto pr-3 custom-scrollbar">
              <p>
                Everything started after Pride Amsterdam. We walked through the
                streets of AMS and had a drink on the gay street. After that, we
                started seeing each other 2 or 3 times, even though you thought
                I hadn't liked you on our first date hihihi...
              </p>
              <p>
                The truth is, since that first date, I could already feel that
                you would change my world for the better and that you would be
                the person I could truly be myself with, without having to
                change anything to please you.
              </p>
              <p>
                Even though we talked later and "knew" we couldn't date or even
                fall in love... we ended up falling in love and loving each
                other, even while fighting for it not to happen. I know for many
                this was very fast; for me, it was something so natural.
              </p>
              <p>
                Despite everything, and knowing that you are leaving in a few
                weeks, I will still love you. When you find your reason for
                living and still want me to be part of your new life, I will be
                here.
              </p>
              <p>
                And if we are in the same vibe, we can try again. I want the
                best for you on your journey, and I will be very happy knowing
                that you are happy in your new path.
              </p>
              <div className="pt-4 border-t border-red-50 text-center italic font-medium text-red-500">
                But before you go, I have one last thing to ask...
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
            >
              Click to continue <ChevronRight size={18} />
            </button>
          </div>
        ) : (
          /* PAGE 2: THE PROPOSAL */
          <div className="animate-in slide-in-from-right duration-500 flex flex-col items-center">
            <button
              onClick={() => setShowProposal(false)}
              className="self-start mb-6 text-gray-400 hover:text-gray-600 flex items-center gap-1 text-xs uppercase font-bold tracking-widest"
            >
              <ArrowLeft size={14} /> Back to story
            </button>

            <div className="bg-red-50 p-4 rounded-full mb-6">
              <Heart
                size={40}
                className="text-red-500 fill-current animate-pulse"
              />
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-8 leading-tight">
              Ramon, will you be my boyfriend <br />
              <span className="text-red-500">forever?</span>
            </h1>

            <div className="flex flex-col gap-4 w-full">
              <button
                onClick={handleYes}
                className="w-full bg-[#ff3333] text-white font-bold py-5 rounded-full shadow-lg shadow-red-100 text-xl active:scale-95 transition-transform"
              >
                YES! ❤️
              </button>

              <button
                onMouseEnter={handleNo}
                onClick={handleNo}
                style={
                  hasMoved
                    ? {
                        position: 'fixed',
                        top: position.top,
                        left: position.left,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 100,
                      }
                    : {}
                }
                className={`py-3 px-8 rounded-full font-bold transition-all ${
                  hasMoved
                    ? 'bg-white text-red-500 border-2 border-red-500 shadow-2xl scale-110'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {fugas >= 3 ? 'Wait... please?' : 'No'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ffcccc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ff9999;
        }
      `}</style>
    </main>
  );
}
