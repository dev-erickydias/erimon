'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Quiz from '@/components/Quiz';
import QuizStatus from '@/components/QuizStatus';
import FloatingHearts from '@/components/FloatingHearts';

const LoveQuestion = dynamic(() => import('@/components/LoveQuestion'), {
  ssr: false,
});

export default function Home() {
  const [view, setView] = useState('quiz');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const handleCorrect = () => setView('proposal');

  const handleWrong = (correctCount) => {
    setScore(correctCount);
    setAttempts((prev) => prev + 1);
    setView('status');
  };

  const handleRetry = () => setView('quiz');

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center p-6">
      <FloatingHearts count={8} />

      <div className="relative z-10 w-full flex flex-col items-center">
        {view === 'quiz' && (
          <Quiz
            onCorrect={handleCorrect}
            onWrong={handleWrong}
            attemptCount={attempts}
          />
        )}

        {view === 'status' && (
          <QuizStatus score={score} attempts={attempts} onRetry={handleRetry} />
        )}

        {view === 'proposal' && <LoveQuestion />}
      </div>
    </main>
  );
}
