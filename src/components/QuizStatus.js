'use client';
import { RotateCcw, XCircle, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function QuizStatus({ score, attempts, onRetry }) {
  const router = useRouter();
  const isBlocked = attempts >= 3;

  return (
    <div className="bg-white p-10 rounded-[40px] shadow-xl max-w-sm w-full text-center animate-in zoom-in duration-300">
      {isBlocked ? (
        <>
          <XCircle size={60} className="text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-500 mb-8">
            You missed more than 3 times. My heart is locked for now! 🔒
          </p>
        </>
      ) : (
        <>
          <div className="text-6xl mb-6">🤨</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Wrong Answer!
          </h1>
          <p className="text-gray-500 mb-8">
            Ramon, are you sure? You've got {3 - attempts} attempts left.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onRetry}
              className="w-full bg-gray-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} /> Try again
            </button>

            {score >= 3 && (
              <button
                onClick={() => router.push('/galery')}
                className="w-full border-2 border-gray-200 text-gray-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
              >
                <ImageIcon size={18} /> Go to Gallery ({score} correct)
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
