import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { RECOMMENDATIONS } from '../data/catalog';
import { ProductPlaceholder } from './ProductPlaceholder';

export function Recommendations({ onSelectProduct, theme = 'light' }) {
  const isDark = theme === 'dark';
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="w-full max-w-full border-t pt-8 sm:pt-12 mt-8 sm:mt-12 transition-colors px-1"
      style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}
    >
      <div className="text-center mb-6 sm:mb-8 px-2">
        <h3
          className="text-base sm:text-xl font-extrabold uppercase tracking-wider font-sans"
          style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
        >
          Pessoas que compraram este item também levaram
        </h3>
        <p
          className="text-[10px] sm:text-xs font-mono uppercase tracking-wider mt-1 opacity-70"
          style={{ color: isDark ? '#9da3af' : '#71717a' }}
        >
          Sugestões de combinação para compor o look completo
        </p>
      </div>

      {/* Grade 2 em 2 no Mobile */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-6">
        {RECOMMENDATIONS.map((product) => {
          const isFav = !!favorites[product.id];

          return (
            <div
              key={product.id}
              onClick={() => {
                if (onSelectProduct) {
                  onSelectProduct(product);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex flex-col group cursor-pointer"
            >
              <div
                className="relative aspect-3/4 rounded-xl overflow-hidden border shadow-2xs transition-colors flex items-center justify-center p-2"
                style={{
                  backgroundColor: isDark ? '#26282e' : '#f4f3ed',
                  borderColor: isDark ? '#363942' : '#e5e3da',
                }}
              >
                {product.tag && (
                  <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded shadow-2xs z-10 bg-orange-600 text-white">
                    {product.tag}
                  </span>
                )}

                <button
                  onClick={(e) => toggleFavorite(product.id, e)}
                  title={isFav ? "Remover dos favoritos" : "Salvar nos favoritos"}
                  className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 p-1 sm:p-1.5 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xs transition-transform hover:scale-110 active:scale-90 z-10 shadow-2xs cursor-pointer"
                >
                  <Heart
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-zinc-600 dark:text-zinc-300'
                      }`}
                  />
                </button>

                <div className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <ProductPlaceholder type={product.imageType} theme={theme} />
                </div>

                {/* Tag sutil de 'Ver Detalhes' no Hover */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="bg-zinc-950/85 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-mono tracking-widest uppercase px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md border border-white/20">
                    Ver Detalhes ↗
                  </span>
                </div>
              </div>

              <div className="mt-2 sm:mt-2.5 flex flex-col">
                <span
                  className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider font-semibold line-clamp-1"
                  style={{ color: isDark ? '#808794' : '#a1a1aa' }}
                >
                  {product.categoryLabel}
                </span>

                <h4
                  className="text-xs sm:text-sm font-sans font-bold tracking-tight uppercase line-clamp-1 group-hover:text-orange-500 transition-colors mt-0.5"
                  style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
                >
                  {product.name}
                </h4>

                <span
                  className="text-xs sm:text-sm font-mono font-bold tracking-tight mt-0.5 sm:mt-1"
                  style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
                >
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
