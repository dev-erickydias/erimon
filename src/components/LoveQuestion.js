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
  const [accepted, setAccepted] = useState(false);

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
    setAccepted(true);

    // Multi-burst confetti
    const colors = ['#b76e79', '#d4a0a8', '#f5e6e0', '#e04d6d', '#c9a96e'];
    const fire = (opts) => confetti({ ...opts, colors, disableForReducedMotion: true });

    fire({ particleCount: 80, spread: 60, origin: { y: 0.7, x: 0.3 } });
    setTimeout(() => fire({ particleCount: 80, spread: 60, origin: { y: 0.7, x: 0.7 } }), 200);
    setTimeout(() => fire({ particleCount: 120, spread: 100, origin: { y: 0.5 } }), 500);

    setTimeout(() => router.push('/galery'), 2500);
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-6">
      <div className="glass-card-strong p-8 md:p-14 rounded-[36px] max-w-md w-full text-center animate-zoom-in relative overflow-hidden">

        {/* Subtle shimmer overlay */}
        <div className="absolute inset-0 animate-shimmer rounded-[36px] pointer-events-none" />

        {!showProposal ? (
          /* ═══ PAGE 1: THE LOVE LETTER ═══ */
          <div className="animate-fade-in relative z-10">
            {/* Decorative top */}
            <div className="elegant-divider max-w-[80px] mx-auto mb-6">
              <span className="text-[10px] text-[var(--rose-gold-light)]">♥</span>
            </div>

            <h1 className="font-romantic text-3xl md:text-4xl text-gradient-rose mb-6">
              Dear Ramon...
            </h1>

            <div className="text-[var(--warm-gray-500)] text-[14px] text-left space-y-4 mb-8 leading-[1.75] max-h-[380px] overflow-y-auto pr-3 custom-scrollbar font-body">
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

              <div className="pt-5 mt-2 border-t border-[var(--blush)]">
                <p className="text-center font-romantic italic text-[var(--rose-gold)] text-base">
                  But before you go, I have one last thing to ask...
                </p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="btn-rose w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-sm"
            >
              Continue <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          /* ═══ PAGE 2: THE PROPOSAL ═══ */
          <div className="animate-slide-in-right relative z-10 flex flex-col items-center">
            <button
              onClick={() => setShowProposal(false)}
              className="self-start mb-8 text-[var(--warm-gray-400)] hover:text-[var(--rose-gold)] flex items-center gap-1 text-[10px] uppercase font-body font-semibold tracking-[0.2em] transition-colors"
            >
              <ArrowLeft size={12} strokeWidth={1.5} /> Back to letter
            </button>

            {/* Heart icon */}
            <div className="w-20 h-20 rounded-full bg-[var(--rose-50)] flex items-center justify-center mb-8">
              <Heart
                size={32}
                className="text-[var(--rose-gold)] fill-current animate-pulse-soft"
                strokeWidth={1.5}
              />
            </div>

            <h1 className="font-romantic text-2xl md:text-3xl text-[var(--warm-gray-800)] mb-2 leading-tight">
              Ramon, will you be my boyfriend
            </h1>
            <p className="font-romantic text-2xl md:text-3xl text-gradient-rose mb-10 italic">
              forever?
            </p>

            {accepted ? (
              <div className="animate-fade-in-up text-center">
                <p className="font-romantic text-2xl text-[var(--rose-gold)] mb-2">
                  I love you
                </p>
                <p className="text-[var(--warm-gray-400)] text-sm font-body">
                  Redirecting to our memories...
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                <button
                  onClick={handleYes}
                  className="btn-rose w-full py-5 rounded-2xl text-lg font-romantic tracking-wide"
                >
                  Yes, forever
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
                  className={`py-3 px-8 rounded-full font-body font-medium transition-all duration-300 ${
                    hasMoved
                      ? 'glass-card-strong text-[var(--rose-gold)] text-sm shadow-2xl'
                      : 'bg-[var(--warm-gray-50)] text-[var(--warm-gray-400)] hover:bg-[var(--blush)] text-sm'
                  }`}
                >
                  {fugas >= 3 ? 'Wait... please?' : 'No'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
