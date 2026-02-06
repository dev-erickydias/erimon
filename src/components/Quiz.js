'use client';
import { useState, useEffect } from 'react';
import { ChevronRight, Lock, AlertCircle } from 'lucide-react';

export default function Quiz({ onCorrect, onWrong, attemptCount }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [shuffledQuiz, setShuffledQuiz] = useState([]);

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

  useEffect(() => {
    // Embaralha as perguntas E as opções dentro delas
    const shuffled = [...quizData]
      .sort(() => Math.random() - 0.5)
      .map((item) => ({
        ...item,
        options: [...item.options].sort(() => Math.random() - 0.5),
      }));
    setShuffledQuiz(shuffled);
  }, [attemptCount]); // Re-embaralha se o contador de tentativas mudar

  if (shuffledQuiz.length === 0) return null;

  const activeQuestion = shuffledQuiz[currentStep];

  const handleAnswer = (choice) => {
    if (choice === activeQuestion.a) {
      if (currentStep + 1 < shuffledQuiz.length) {
        setCurrentStep(currentStep + 1);
      } else {
        onCorrect(); // Completou tudo!
      }
    } else {
      onWrong(currentStep); // Errou (passa quantas acertou)
    }
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-xl max-w-sm w-full text-center animate-in fade-in zoom-in duration-500">
      <div className="w-full bg-gray-100 h-1.5 rounded-full mb-8 overflow-hidden">
        <div
          className="bg-red-500 h-full transition-all duration-500"
          style={{
            width: `${((currentStep + 1) / shuffledQuiz.length) * 100}%`,
          }}
        ></div>
      </div>

      <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
        <Lock className="text-red-500" size={20} />
      </div>

      <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">
        Question {currentStep + 1} of {shuffledQuiz.length}
      </h2>
      <h1 className="text-xl font-bold text-gray-800 mb-8 leading-tight">
        {activeQuestion.q}
      </h1>

      <div className="flex flex-col gap-3">
        {activeQuestion.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            className="py-4 px-4 bg-gray-50 hover:bg-red-50 hover:text-red-600 border border-gray-100 rounded-2xl text-sm font-medium transition-all active:scale-95 text-left flex justify-between items-center group"
          >
            {opt}
            <ChevronRight
              size={16}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
