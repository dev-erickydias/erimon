'use client';
import { useState } from 'react';
import LoveQuestion from '@/components/LoveQuestion';
import { useRouter } from 'next/navigation';
import { Heart, Lock } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(false);

  const correctDate = '14/08/2025';

  const options = [
    '12/08/2025',
    '14/08/2025', // Correta
    '15/08/2025',
    '10/08/2025',
    '14/09/2025',
    '20/08/2025',
  ];

  const handleChoice = (choice) => {
    if (choice === correctDate) {
      setAuthorized(true);
    } else {
      // Se errar, vai direto para a galeria sem ver o pedido
      router.push('/galery');
    }
  };

  // Se ele acertou, mostra o componente do pedido
  if (authorized) {
    return <LoveQuestion />;
  }

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-[#f3f4f6]">
      <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm max-w-sm w-full text-center animate-in fade-in zoom-in duration-700">
        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="text-red-500" size={28} />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Identidade Secreta!
        </h1>
        <p className="text-gray-500 mb-8 text-sm">
          Se você for o Ramon, responda corretamente: <br />
          <span className="font-semibold text-gray-700 italic">
            Qual foi o dia do nosso primeiro date?
          </span>
        </p>

        <div className="grid grid-cols-2 gap-3">
          {options.map((date) => (
            <button
              key={date}
              onClick={() => handleChoice(date)}
              className="py-3 px-2 bg-gray-50 hover:bg-red-50 hover:text-red-600 border border-gray-100 rounded-2xl text-sm font-medium transition-all active:scale-95"
            >
              {date}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-1">
          <Heart size={14} className="text-red-200 fill-current" />
          <Heart size={14} className="text-red-300 fill-current" />
          <Heart size={14} className="text-red-400 fill-current" />
        </div>
      </div>
    </main>
  );
}
