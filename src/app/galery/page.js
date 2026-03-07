'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Heart, Loader2, ArrowLeft, X, Maximize2, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import FloatingHearts from '@/components/FloatingHearts';

export default function Gallery() {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPhotos, setLikedPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('erimon_likes') || '[]');
    setLikedPhotos(savedLikes);
  }, []);

  const fetchFotos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('fotos')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      setFotos(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFotos();
  }, [fetchFotos]);

  const handleLike = async (e, id, currentLikes) => {
    e.stopPropagation();
    if (likedPhotos.includes(id)) return;

    const newLikes = [...likedPhotos, id];
    setLikedPhotos(newLikes);
    localStorage.setItem('erimon_likes', JSON.stringify(newLikes));

    setFotos((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, curtidas: (f.curtidas || 0) + 1 } : f,
      ),
    );
    await supabase
      .from('fotos')
      .update({ curtidas: (currentLikes || 0) + 1 })
      .eq('id', id);
  };

  return (
    <div className="min-h-screen pb-20 pt-10 px-4 font-body relative">
      <FloatingHearts count={5} />

      <header className="max-w-5xl mx-auto flex flex-col items-center mb-14 relative z-10">
        {/* Back link */}
        <Link
          href="/"
          className="self-start mb-8 flex items-center gap-2 text-[var(--warm-gray-400)] hover:text-[var(--rose-gold)] transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} strokeWidth={1.5} /> Back
        </Link>

        {/* Title */}
        <h1 className="font-romantic text-4xl md:text-6xl text-gradient-rose mb-4 text-center animate-fade-in-up">
          Our Memories
        </h1>

        {/* Subtitle */}
        <div className="elegant-divider max-w-[80px] mx-auto mb-4">
          <span className="text-[10px] text-[var(--rose-gold-light)]">♥</span>
        </div>

        <p className="text-[var(--warm-gray-400)] text-center max-w-md italic text-sm px-4 font-romantic leading-relaxed mb-8 animate-fade-in delay-200">
          Every frame here holds a piece of my heart and a moment of us
          that I'll cherish forever.
        </p>

        {/* Game link */}
        <Link
          href="/game"
          className="btn-outline-rose px-6 py-3 flex items-center gap-2 text-sm animate-fade-in delay-300"
        >
          <Gamepad2 size={16} strokeWidth={1.5} /> Memory Game
        </Link>
      </header>

      {loading ? (
        <div className="flex flex-col items-center h-64 text-[var(--rose-gold)] justify-center relative z-10">
          <Loader2 className="animate-spin mb-3" size={28} strokeWidth={1.5} />
          <p className="font-body font-medium text-sm text-[var(--warm-gray-400)]">
            Loading our love story...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto relative z-10">
          {fotos.map((foto, i) => (
            <div
              key={foto.id}
              onClick={() => setSelectedPhoto(foto)}
              className="glass-card p-3 rounded-[28px] hover:shadow-xl transition-all duration-500 group cursor-pointer relative animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Expand indicator */}
              <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-[var(--warm-gray-500)]">
                  <Maximize2 size={16} strokeWidth={1.5} />
                </div>
              </div>

              {/* Image */}
              <div className="aspect-square overflow-hidden rounded-[20px]">
                <img
                  src={foto.url}
                  alt={foto.titulo}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Info bar */}
              <div className="p-4 flex justify-between items-center">
                <h3 className="font-body font-semibold text-[var(--warm-gray-600)] text-sm truncate pr-3">
                  {foto.titulo}
                </h3>
                <button
                  onClick={(e) => handleLike(e, foto.id, foto.curtidas)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 active:scale-90 text-sm
                    ${
                      likedPhotos.includes(foto.id)
                        ? 'bg-[var(--rose-gold)] text-white shadow-md shadow-[var(--rose-gold-light)]'
                        : 'bg-[var(--rose-50)] text-[var(--rose-gold)] hover:bg-[var(--blush)]'
                    }`}
                >
                  <Heart
                    size={14}
                    fill={likedPhotos.includes(foto.id) ? 'currentColor' : 'none'}
                    strokeWidth={1.5}
                  />
                  <span className="font-semibold text-xs">{foto.curtidas || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ LIGHTBOX ═══ */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-fade-in">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-[var(--warm-gray-800)]/90 backdrop-blur-lg"
            onClick={() => setSelectedPhoto(null)}
          />

          {/* Content */}
          <div className="relative max-w-3xl w-full max-h-[90dvh] flex flex-col items-center animate-zoom-in">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors p-2"
            >
              <X size={28} strokeWidth={1.5} />
            </button>

            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.titulo}
              className="rounded-2xl object-contain max-h-[70dvh] shadow-2xl border border-white/5"
            />

            <div className="mt-6 text-center text-white">
              <h2 className="text-xl md:text-2xl font-romantic mb-3">
                {selectedPhoto.titulo}
              </h2>
              <div className="flex items-center justify-center gap-2 text-[var(--rose-gold-light)] bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
                <Heart size={16} fill="currentColor" strokeWidth={1.5} />
                <span className="font-body font-semibold text-sm">
                  {selectedPhoto.curtidas || 0} Likes
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
