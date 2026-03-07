'use client';
import { useState, useEffect } from 'react';
import { ChevronRight, Lock } from 'lucide-react';

const quizData = [
  {
    q: 'When was the date of our first date?',
    a: '13/08/2025',
    options: ['12/08/2025', '13/08/2025', '14/08/2025', '10/08/2025'],
  },
  {
    q: 'What is my favorite fruit?',
    a: 'Passion Fruit',
    options: ['Mango', 'Strawberry', 'Passion Fruit', 'Watermelon'],
  },
  {
    q: 'What is my favorite pet?',
    a: 'Cat',
    options: ['Dog', 'Cat', 'Rabbit', 'Hamster'],
  },
  {
    q: 'When is my birthday?',
    a: '09/02/1999',
    options: ['09/02/1999', '10/02/1999', '09/03/1999', '08/02/1999'],
  },
  {
    q: 'What happened minutes after we left the gay sauna for the first time?',
    a: 'We had a fight',
    options: [
      'We kissed',
      'We had a fight',
      'We got lost',
      'We went for pizza',
    ],
  },
  {
    q: 'What did I tell you the first time I gave you advice?',
    a: 'Do what is best for you without thinking about anyone else',
    options: [
      'Follow your heart',
      'Do what is best for you without thinking about anyone else',
      'Think twice',
      'Always prioritize love',
    ],
  },
];

export default function Quiz({ onCorrect, onWrong, attemptCount }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [shuffledQuiz, setShuffledQuiz] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    const shuffled = [...quizData]
      .sort(() => Math.random() - 0.5)
      .map((item) => ({
        ...item,
        options: [...item.options].sort(() => Math.random() - 0.5),
      }));
    setShuffledQuiz(shuffled);
    setCurrentStep(0);
    setSelectedAnswer(null);
  }, [attemptCount]);

  if (shuffledQuiz.length === 0) return null;

  const activeQuestion = shuffledQuiz[currentStep];
  const progress = ((currentStep + 1) / shuffledQuiz.length) * 100;

  const handleAnswer = (choice) => {
    setSelectedAnswer(choice);
    const isCorrect = choice === activeQuestion.a;

    setTimeout(() => {
      if (isCorrect) {
        if (currentStep + 1 < shuffledQuiz.length) {
          setCurrentStep(currentStep + 1);
          setSelectedAnswer(null);
        } else {
          onCorrect();
        }
      } else {
        onWrong(currentStep);
        setSelectedAnswer(null);
      }
    }, 600);
  };

  return (
    <div className="glass-card-strong p-8 md:p-12 rounded-[36px] max-w-sm w-full text-center animate-zoom-in">
      {/* Progress */}
      <div className="progress-rose h-1 mb-8">
        <div className="bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Lock icon */}
      <div className="w-14 h-14 rounded-full bg-[var(--blush)] flex items-center justify-center mx-auto mb-5 animate-float">
        <Lock className="text-[var(--rose-gold)]" size={20} strokeWidth={1.5} />
      </div>

      {/* Question counter */}
      <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--warm-gray-400)] font-body font-semibold mb-2">
        Question {currentStep + 1} of {shuffledQuiz.length}
      </p>

      {/* Question */}
      <h1 className="font-romantic text-xl md:text-2xl text-[var(--warm-gray-800)] mb-8 leading-snug">
        {activeQuestion.q}
      </h1>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {activeQuestion.options.map((opt) => {
          const isSelected = selectedAnswer === opt;
          const isCorrect = opt === activeQuestion.a;
          let optionStyle = '';

          if (selectedAnswer) {
            if (isSelected && isCorrect) {
              optionStyle = 'bg-[var(--rose-50)] border-[var(--rose-gold)] text-[var(--rose-gold-dark)]';
            } else if (isSelected && !isCorrect) {
              optionStyle = 'bg-red-50 border-red-200 text-red-400';
            } else {
              optionStyle = 'opacity-50';
            }
          }

          return (
            <button
              key={opt}
              onClick={() => !selectedAnswer && handleAnswer(opt)}
              disabled={!!selectedAnswer}
              className={`py-4 px-5 rounded-2xl text-sm font-body font-medium transition-all duration-300
                text-left flex justify-between items-center group
                ${optionStyle || 'bg-[var(--warm-gray-50)] hover:bg-[var(--blush)] hover:text-[var(--rose-gold-dark)] border border-[var(--warm-gray-100)] hover:border-[var(--rose-gold-light)]'}
                ${!selectedAnswer ? 'active:scale-[0.97] cursor-pointer' : 'cursor-default'}
              `}
            >
              <span>{opt}</span>
              <ChevronRight
                size={14}
                className={`transition-all duration-300 ${
                  selectedAnswer ? 'opacity-0' : 'opacity-0 group-hover:opacity-60'
                }`}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
