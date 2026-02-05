'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Heart, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Gallery() {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPhotos, setLikedPhotos] = useState([]);

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

  const handleLike = async (id, currentLikes) => {
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
    <div className="min-h-screen bg-[#f3f4f6] pb-20 pt-10 px-4">
      <header className="max-w-6xl mx-auto flex flex-col items-center mb-12">
        <Link
          href="/"
          className="self-start mb-6 flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="text-5xl md:text-7xl font-romantic text-[#c51d1d] mb-4">
          Our Memories
        </h1>
      </header>

      {loading ? (
        <div className="flex flex-col items-center h-64 text-red-400 justify-center">
          <Loader2 className="animate-spin mb-2" size={32} />
          <p>Loading love...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {fotos.map((foto) => (
            <div
              key={foto.id}
              className="bg-white p-3 rounded-[32px] shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="aspect-square overflow-hidden rounded-[24px]">
                <img
                  src={foto.url}
                  alt={foto.titulo}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 flex justify-between items-center">
                <h3 className="font-bold text-gray-700">{foto.titulo}</h3>
                <button
                  onClick={() => handleLike(foto.id, foto.curtidas)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${likedPhotos.includes(foto.id) ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500'}`}
                >
                  <Heart
                    size={18}
                    fill={
                      likedPhotos.includes(foto.id) ? 'currentColor' : 'none'
                    }
                  />
                  <span className="font-bold">{foto.curtidas || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
