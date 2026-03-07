'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, RefreshCw, Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import FloatingHearts from '@/components/FloatingHearts';

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moves, setMoves] = useState(0);

  const loadGame = async () => {
    setLoading(true);
    setSolved([]);
    setFlipped([]);
    setMoves(0);

    const { data, error } = await supabase.from('fotos').select('id, url');

    if (error) {
      console.error('Error loading photos:', error);
      setLoading(false);
      return;
    }

    if (data && data.length >= 3) {
      const randomSelection = [...data]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

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

  // Match check
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first]?.id === cards[second]?.id) {
        setSolved((prev) => [...prev, cards[first].id]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  }, [flipped]);

  // Win check
  useEffect(() => {
    if (solved.length === 3 && cards.length > 0) {
      const colors = ['#b76e79', '#d4a0a8', '#f5e6e0', '#e04d6d', '#c9a96e'];
      const fire = (opts) => confetti({ ...opts, colors, disableForReducedMotion: true });
      fire({ particleCount: 80, spread: 60, origin: { y: 0.6, x: 0.3 } });
      setTimeout(() => fire({ particleCount: 100, spread: 80, origin: { y: 0.5 } }), 300);
    }
  }, [solved, cards]);

  const handleClick = (index) => {
    if (
      flipped.length < 2 &&
      !flipped.includes(index) &&
      !solved.includes(cards[index].id)
    ) {
      setFlipped((prev) => [...prev, index]);
      setMoves((m) => m + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin mb-3 text-[var(--rose-gold)]" size={28} strokeWidth={1.5} />
        <p className="font-body text-sm text-[var(--warm-gray-400)]">
          Preparing our memory game...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6 flex flex-col items-center relative">
      <FloatingHearts count={4} />

      {/* Header */}
      <header className="w-full max-w-md flex justify-between items-center mb-12 relative z-10 animate-fade-in">
        <Link
          href="/galery"
          className="text-[var(--warm-gray-400)] flex items-center gap-1.5 hover:text-[var(--rose-gold)] transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} strokeWidth={1.5} /> Gallery
        </Link>

        <h1 className="font-romantic text-2xl text-gradient-rose">Memory Love</h1>

        <button
          onClick={loadGame}
          className="text-[var(--warm-gray-400)] hover:text-[var(--rose-gold)] hover:rotate-180 transition-all duration-500 p-2"
        >
          <RefreshCw size={18} strokeWidth={1.5} />
        </button>
      </header>

      {/* Move counter */}
      <div className="mb-8 relative z-10 animate-fade-in delay-100">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--warm-gray-400)] font-body font-semibold text-center">
          Moves: {moves}
        </p>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-2 gap-4 max-w-xs w-full relative z-10">
        {cards.map((card, index) => {
          const isRevealed = flipped.includes(index) || solved.includes(card.id);
          const isSolved = solved.includes(card.id);

          return (
            <div
              key={card.uniqueId}
              onClick={() => handleClick(index)}
              className={`aspect-square cursor-pointer animate-fade-in-up ${
                isSolved ? 'ring-2 ring-[var(--rose-gold-light)] ring-offset-2 rounded-[24px]' : ''
              }`}
              style={{
                perspective: '1000px',
                animationDelay: `${index * 80}ms`,
              }}
            >
              <div
                className="relative w-full h-full transition-all duration-600"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transitionDuration: '0.6s',
                }}
              >
                {/* Card Back */}
                <div
                  className="absolute inset-0 glass-card-strong rounded-[24px] flex items-center justify-center"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Heart
                      size={28}
                      className="text-[var(--rose-gold-light)] fill-current animate-pulse-soft"
                      strokeWidth={1.5}
                    />
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--warm-gray-300)] font-body font-semibold">
                      EriMon
                    </span>
                  </div>
                </div>

                {/* Card Front (Photo) */}
                <div
                  className="absolute inset-0 rounded-[24px] overflow-hidden shadow-lg border-2 border-white"
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

      {/* Win Message */}
      {solved.length === 3 && (
        <div className="mt-14 text-center animate-fade-in-up relative z-10">
          <div className="glass-card-strong p-8 rounded-[28px] max-w-xs">
            <p className="font-romantic text-xl text-gradient-rose mb-2">
              You matched all our moments!
            </p>
            <p className="text-[var(--warm-gray-400)] text-xs font-body mb-5">
              Completed in {moves} moves
            </p>
            <button
              onClick={loadGame}
              className="btn-outline-rose px-6 py-2.5 text-xs uppercase tracking-[0.15em] font-body font-semibold"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
