'use client';
import { RotateCcw, XCircle, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function QuizStatus({ score, attempts, onRetry }) {
  const router = useRouter();
  const isBlocked = attempts >= 3;

  return (
    <div className="glass-card-strong p-10 md:p-12 rounded-[36px] max-w-sm w-full text-center animate-zoom-in">
      {isBlocked ? (
        <>
          {/* Blocked state */}
          <div className="w-16 h-16 rounded-full bg-[var(--rose-50)] flex items-center justify-center mx-auto mb-6">
            <XCircle size={28} className="text-[var(--rose-500)]" strokeWidth={1.5} />
          </div>

          <h1 className="font-romantic text-2xl text-[var(--warm-gray-800)] mb-3">
            Access Denied
          </h1>

          <div className="elegant-divider max-w-[60px] mx-auto mb-4">
            <span className="text-[10px] text-[var(--rose-gold-light)]">♥</span>
          </div>

          <p className="text-[var(--warm-gray-400)] font-body text-sm leading-relaxed">
            You missed more than 3 times.
            <br />
            <span className="text-[var(--rose-gold)] italic font-romantic">
              My heart is locked for now...
            </span>
          </p>
        </>
      ) : (
        <>
          {/* Wrong answer state */}
          <div className="w-16 h-16 rounded-full bg-[var(--blush)] flex items-center justify-center mx-auto mb-6 animate-pulse-soft">
            <span className="text-3xl">💭</span>
          </div>

          <h1 className="font-romantic text-2xl text-[var(--warm-gray-800)] mb-2">
            Not quite right...
          </h1>

          <p className="text-[var(--warm-gray-400)] font-body text-sm mb-8 leading-relaxed">
            Ramon, are you sure?
            <br />
            <span className="text-[var(--rose-gold)] font-medium">
              {3 - attempts} {3 - attempts === 1 ? 'attempt' : 'attempts'} remaining
            </span>
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onRetry}
              className="btn-rose w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-sm"
            >
              <RotateCcw size={16} strokeWidth={1.5} />
              Try again
            </button>

            {score >= 3 && (
              <button
                onClick={() => router.push('/galery')}
                className="btn-outline-rose w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-sm"
              >
                <ImageIcon size={16} strokeWidth={1.5} />
                Go to Gallery ({score} correct)
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
