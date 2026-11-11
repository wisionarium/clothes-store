import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { CATALOG_PRODUCTS } from '../data/catalog';
import { ProductPlaceholder } from './ProductPlaceholder';

export function ProductCatalog({ products = CATALOG_PRODUCTS, onSelectProduct, selectedCategory = 'todos', onCategoryChange, theme = 'light' }) {
  const isDark = theme === 'dark';
  const [favorites, setFavorites] = useState({});

  const filterTabs = [
    { id: 'todos', label: 'Todos os Itens' },
    { id: 'calcas', label: 'Calças & Jeans' },
    { id: 'bermudas', label: 'Bermudas' },
    { id: 'casacos', label: 'Casacos & Blazers' },
  ];

  const filteredProducts = selectedCategory === 'todos'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="catalog-section" className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-8 sm:py-12 overflow-x-hidden">
      {/* Cabeçalho do Catálogo com Filtros */}
      <div
        className="flex flex-col md:flex-row md:items-end justify-between border-b pb-4 sm:pb-6 mb-6 sm:mb-8 gap-3 sm:gap-4 transition-colors"
        style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}
      >
        <div>
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-orange-500 uppercase block mb-1">
            Linha de Vestuário Completa
          </span>
          <h2
            className="text-xl sm:text-3xl font-extrabold uppercase tracking-tight"
            style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
          >
            Calças, Bermudas & Casacos
          </h2>
        </div>

        {/* Pílulas de Filtro de Categoria - Scroll suave no mobile dentro da linha */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none w-full md:w-auto -mx-1 px-1">
          {filterTabs.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onCategoryChange(tab.id)}
                className="px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border shrink-0"
                style={{
                  backgroundColor: isActive
                    ? (isDark ? '#f4f5f7' : '#18181b')
                    : (isDark ? '#27292e' : '#f2f1ec'),
                  color: isActive
                    ? (isDark ? '#18181b' : '#ffffff')
                    : (isDark ? '#9da3af' : '#71717a'),
                  borderColor: isActive
                    ? (isDark ? '#f4f5f7' : '#18181b')
                    : (isDark ? '#383b44' : '#e2dfd5'),
                  fontWeight: isActive ? 'bold' : 'normal',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grade de Produtos Estilo Imagem 3 - De 2 em 2 no Mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
        {filteredProducts.map((product) => {
          const isFav = !!favorites[product.id];

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct && onSelectProduct(product)}
              className="flex flex-col group transition-transform duration-200 cursor-pointer"
            >
              {/* Foto / Placeholder da Peça (Clique abre os detalhes) */}
              <div
                className="relative aspect-3/4 rounded-xl overflow-hidden border shadow-2xs transition-colors flex items-center justify-center p-2"
                style={{
                  backgroundColor: isDark ? '#26282e' : '#f4f3ed',
                  borderColor: isDark ? '#363942' : '#e5e3da',
                }}
              >
                {/* Tag / Badge de Destaque */}
                {product.tag && (
                  <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded shadow-2xs z-10 bg-orange-600 text-white">
                    {product.tag}
                  </span>
                )}

                {/* Botão de Favoritar (Coração) */}
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

                {/* Ilustração / Visual da Peça */}
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

              {/* Informações da Peça abaixo da Foto */}
              <div className="mt-2 sm:mt-2.5 flex flex-col">
                <span
                  className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider font-semibold line-clamp-1"
                  style={{ color: isDark ? '#808794' : '#a1a1aa' }}
                >
                  {product.categoryLabel}
                </span>

                <h3
                  className="text-xs sm:text-sm font-sans font-bold tracking-tight uppercase line-clamp-1 group-hover:text-orange-500 transition-colors mt-0.5"
                  style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
                >
                  {product.name}
                </h3>

                <span
                  className="text-xs sm:text-sm font-mono font-bold tracking-tight mt-0.5 sm:mt-1"
                  style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
                >
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>

                {/* Bolinhas de Cores Disponíveis */}
                <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
                  {product.colors.map((c, i) => (
                    <span
                      key={i}
                      className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border shadow-2xs"
                      style={{
                        backgroundColor: c,
                        borderColor: isDark ? '#474c57' : '#d4d4d8',
                      }}
                    />
                  ))}
                  <span
                    className="text-[9px] sm:text-[10px] font-mono ml-0.5 sm:ml-1 line-clamp-1"
                    style={{ color: isDark ? '#808794' : '#a1a1aa' }}
                  >
                    +{product.colors.length} cores
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
