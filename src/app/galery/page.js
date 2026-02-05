'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Heart, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ErimonGalery() {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [likedPhotos, setLikedPhotos] = useState([]);

  // 1. Carregar likes salvos no navegador do Ramon
  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('erimon_likes') || '[]');
    setLikedPhotos(savedLikes);
  }, []);

  // 2. Função de busca com tratamento de erro robusto
  const fetchFotos = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase
        .from('fotos')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      setFotos(data || []);
    } catch (err) {
      console.error('Erro na busca das fotos:', err);
      setErrorMsg(err.message || 'Could not connect to database');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFotos();
  }, [fetchFotos]);

  // 3. Lógica de Like (Trava de 1 por pessoa)
  const handleLike = async (id, currentLikes) => {
    if (likedPhotos.includes(id)) return; // Já deu like, não faz nada

    // Update Visual Instantâneo
    setFotos((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, curtidas: (f.curtidas || 0) + 1 } : f,
      ),
    );

    // Salva no Navegador
    const newLikes = [...likedPhotos, id];
    setLikedPhotos(newLikes);
    localStorage.setItem('erimon_likes', JSON.stringify(newLikes));

    // Salva no Banco de Dados
    const { error } = await supabase
      .from('fotos')
      .update({ curtidas: (currentLikes || 0) + 1 })
      .eq('id', id);

    if (error) console.error('Erro ao salvar like:', error);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-20 pt-10 px-4 font-sans">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex flex-col items-center mb-12">
        <Link
          href="/"
          className="self-start mb-6 flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} /> Back
        </Link>

        <h1 className="text-5xl md:text-7xl font-romantic text-[#c51d1d] mb-4 text-center">
          EriMon World
        </h1>
        <p className="text-[#6b7280] text-center max-w-md italic">
          "Every picture tells a story of the love we share."
        </p>
      </header>

      {/* Estado de Carregamento */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-red-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-medium animate-pulse">Loading our memories...</p>
        </div>
      ) : errorMsg ? (
        /* Estado de Erro */
        <div className="max-w-md mx-auto bg-white p-6 rounded-3xl shadow-sm border border-red-100 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={40} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Connection Issue
          </h2>
          <p className="text-gray-500 text-sm mb-6">{errorMsg}</p>
          <button
            onClick={fetchFotos}
            className="bg-red-500 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        /* Grid de Fotos */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {fotos.map((foto) => {
            const isLiked = likedPhotos.includes(foto.id);

            return (
              <div
                key={foto.id}
                className="bg-white p-3 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 group"
              >
                <div className="aspect-square overflow-hidden rounded-[24px] bg-gray-100">
                  <img
                    src={foto.url}
                    alt={foto.titulo}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>

                <div className="p-4 flex justify-between items-center">
                  <h3 className="font-bold text-gray-700 text-lg truncate pr-2">
                    {foto.titulo}
                  </h3>

                  <button
                    onClick={() => handleLike(foto.id, foto.curtidas)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-90 ${
                      isLiked
                        ? 'bg-red-500 text-white shadow-md shadow-red-200'
                        : 'bg-red-50 text-red-500 hover:bg-red-100'
                    }`}
                  >
                    <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                    <span className="font-bold">{foto.curtidas || 0}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 text-center">
        <div className="h-[1px] w-20 bg-gray-300 mx-auto mb-6"></div>
        <p className="text-[#9ca3af] text-xs font-medium uppercase tracking-[0.3em]">
          Forever Together
        </p>
      </footer>
    </div>
  );
}
