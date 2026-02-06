'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, RefreshCw, Heart } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // Índices das cartas viradas no momento
  const [solved, setSolved] = useState([]); // IDs das fotos já resolvidas
  const [loading, setLoading] = useState(true);

  // 1. Busca as fotos e prepara o tabuleiro
  // 1. Busca as fotos e prepara o tabuleiro de forma aleatória
  const loadGame = async () => {
    setLoading(true);
    setSolved([]);
    setFlipped([]);

    // Buscamos um conjunto maior de fotos (ex: 10) para garantir variedade
    // O ideal seria usar uma RPC no Supabase para 'random',
    // mas buscar uma amostra e sortear aqui funciona perfeitamente para 3 fotos.
    const { data, error } = await supabase.from('fotos').select('id, url');

    if (error) {
      console.error('Erro ao carregar fotos:', error);
      setLoading(false);
      return;
    }

    if (data && data.length >= 3) {
      // Sorteia 3 fotos aleatórias do conjunto total que veio do banco
      const randomSelection = [...data]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      // Duplicamos as 3 fotos (total 6) e embaralhamos para o jogo
      const duplicated = [...randomSelection, ...randomSelection]
        .sort(() => Math.random() - 0.5)
        .map((img, index) => ({ ...img, uniqueId: index }));

      setCards(duplicated);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGame();
  }, []);

  // 2. Lógica de comparação das cartas
  useEffect(() => {
    if (flipped.length === 2) {
      const checkMatch = () => {
        const [first, second] = flipped;
        // Verificamos se os IDs das fotos são iguais
        if (cards[first]?.id === cards[second]?.id) {
          setSolved((prev) => [...prev, cards[first].id]);
          setFlipped([]);
        } else {
          setTimeout(() => setFlipped([]), 1000);
        }
      };
      checkMatch();
    }
    // Use apenas as dependências necessárias de forma estável
  }, [flipped]);

  // 3. Verifica vitória
  useEffect(() => {
    if (solved.length === 3 && cards.length > 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [solved, cards]);

  const handleClick = (index) => {
    // Só vira se: menos de 2 viradas, não for a mesma carta e não estiver resolvida
    if (
      flipped.length < 2 &&
      !flipped.includes(index) &&
      !solved.includes(cards[index].id)
    ) {
      setFlipped((prev) => [...prev, index]);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
        <div className="animate-bounce text-red-500 font-bold text-xl">
          Loading Memory... ❤️
        </div>
      </div>
    );

  return (
    <main className="min-h-screen bg-[#f3f4f6] p-6 flex flex-col items-center">
      <header className="w-full max-w-md flex justify-between items-center mb-10">
        <Link
          href="/galery"
          className="text-gray-500 flex items-center gap-1 hover:text-red-500 transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </Link>
        <h1 className="text-3xl font-romantic text-[#c51d1d]">Memory Love</h1>
        <button
          onClick={loadGame}
          className="text-gray-500 hover:rotate-180 transition-transform duration-500"
        >
          <RefreshCw size={20} />
        </button>
      </header>

      <div className="grid grid-cols-2 gap-4 max-w-xs w-full">
        {cards.map((card, index) => {
          // A carta está "virada para cima" se estiver no array de flipped ou de solved
          const isRevealed =
            flipped.includes(index) || solved.includes(card.id);

          return (
            <div
              key={card.uniqueId}
              onClick={() => handleClick(index)}
              className="aspect-square cursor-pointer group"
              style={{ perspective: '1000px' }}
            >
              <div
                className={`relative w-full h-full transition-all duration-500`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* VERSO DA CARTA (O que o Ramon vê primeiro) */}
                <div
                  className="absolute inset-0 bg-white rounded-3xl shadow-md flex items-center justify-center border-2 border-gray-100"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <Heart
                    size={40}
                    className="text-red-200 fill-current opacity-50"
                  />
                </div>

                {/* FRENTE DA CARTA (A Foto) */}
                <div
                  className="absolute inset-0 bg-white rounded-3xl shadow-md overflow-hidden border-4 border-white"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <img
                    src={card.url}
                    className="w-full h-full object-cover"
                    alt="memory"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {solved.length === 3 && (
        <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom duration-1000">
          <p className="text-red-500 font-bold text-xl mb-2 text-shadow">
            You matched all our moments! ❤️
          </p>
          <button
            onClick={loadGame}
            className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </main>
  );
}
