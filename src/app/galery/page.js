'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Heart, Loader2, ArrowLeft, X, Maximize2 } from 'lucide-react';
import Link from 'next/link';

export default function Gallery() {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPhotos, setLikedPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // Para o Popup da imagem

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
    e.stopPropagation(); // Impede que o popup abra ao clicar no botão de like
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
    <div className="min-h-screen bg-[#f3f4f6] pb-20 pt-10 px-4 font-sans">
      <header className="max-w-6xl mx-auto flex flex-col items-center mb-12">
        <Link
          href="/"
          className="self-start mb-6 flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-medium"
        >
          <ArrowLeft size={18} /> Back
        </Link>
        <h1 className="text-5xl md:text-7xl font-romantic text-[#c51d1d] mb-4 text-center">
          Our Memories
        </h1>
        {/* Subtítulo Carinhoso Adicionado */}
        <p className="text-[#6b7280] text-center max-w-md italic text-lg px-4">
          "Every frame here holds a piece of my heart and a moment of us that
          I'll cherish forever, no matter where life takes us."
        </p>
        {/* Adicione isso dentro do <header> da galeria */}
        <div className="mt-8">
          <Link
            href="/game"
            className="bg-white text-red-500 border-2 border-red-500 px-6 py-3 rounded-full font-bold hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 shadow-lg shadow-red-100 active:scale-95"
          >
            <Heart size={18} /> Want to play a memory game?
          </Link>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center h-64 text-red-400 justify-center">
          <Loader2 className="animate-spin mb-2" size={32} />
          <p className="font-medium">Loading our love story...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {fotos.map((foto) => (
            <div
              key={foto.id}
              onClick={() => setSelectedPhoto(foto)} // Abre o Popup
              className="bg-white p-3 rounded-[32px] shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer relative"
            >
              <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-600">
                  <Maximize2 size={20} />
                </div>
              </div>

              <div className="aspect-square overflow-hidden rounded-[24px]">
                <img
                  src={foto.url}
                  alt={foto.titulo}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="p-4 flex justify-between items-center">
                <h3 className="font-bold text-gray-700 truncate pr-2">
                  {foto.titulo}
                </h3>
                <button
                  onClick={(e) => handleLike(e, foto.id, foto.curtidas)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-90 ${likedPhotos.includes(foto.id) ? 'bg-red-500 text-white shadow-md shadow-red-200' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
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

      {/* --- POPUP / LIGHTBOX --- */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedPhoto(null)}
          ></div>

          <div className="relative max-w-4xl w-full max-h-[90dvh] flex flex-col items-center animate-in zoom-in duration-300">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors p-2"
            >
              <X size={32} />
            </button>

            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.titulo}
              className="rounded-3xl object-contain max-h-[70dvh] shadow-2xl border border-white/10"
            />

            <div className="mt-6 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {selectedPhoto.titulo}
              </h2>
              <div className="flex items-center justify-center gap-2 text-red-400 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm inline-flex">
                <Heart size={20} fill="currentColor" />
                <span className="font-bold text-lg">
                  {selectedPhoto.curtidas || 0} Likes
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-20 text-center opacity-30">
        <p className="text-[#9ca3af] text-xs font-medium uppercase tracking-[0.3em]">
          EriMon • Forever
        </p>
      </footer>
    </div>
  );
}
