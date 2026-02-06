'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Quiz from '@/components/Quiz';
import QuizStatus from '@/components/QuizStatus';

const LoveQuestion = dynamic(() => import('@/components/LoveQuestion'), {
  ssr: false,
});

export default function Home() {
  const [view, setView] = useState('quiz'); // 'quiz', 'status', 'proposal'
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
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-[#f3f4f6]">
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
    </main>
  );
}
