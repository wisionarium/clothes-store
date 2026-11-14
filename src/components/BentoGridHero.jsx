import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, Layers, Shirt } from 'lucide-react';

export function BentoGridHero({
  config = {},
  theme = 'dark',
  onSelectCategory,
}) {
  const isDark = theme === 'dark';
  const bento = config?.bento || {};

  const card1Title = bento.card1Title || 'DROP CONCRETE N° 01';
  const card1Tag = bento.card1Tag || 'LANÇAMENTO EXCLUSIVO';
  const card1Category = bento.card1Category || 'todos';
  const card1Image = bento.card1Image || '/images/looks/model_3.jpg';

  const card2Title = bento.card2Title || 'CALÇAS & ALFAIATARIA';
  const card2Tag = bento.card2Tag || 'WIDE BARREL';
  const card2Category = bento.card2Category || 'calcas';
  const card2Image = bento.card2Image || '/images/looks/model_5.jpg';

  const card3Title = bento.card3Title || 'CAMISETAS OVERSIZED';
  const card3Tag = bento.card3Tag || 'BESTSELLERS';
  const card3Category = bento.card3Category || 'camisetas';
  const card3Image = bento.card3Image || '/images/looks/model_4.jpg';

  const handleCategoryClick = (category) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-6 select-none">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {/* CARD 1 (GRANDE / PRINCIPAL): Ocupa 7 colunas no desktop */}
        <div
          onClick={() => handleCategoryClick(card1Category)}
          className="md:col-span-7 relative min-h-[380px] sm:min-h-[460px] rounded-3xl overflow-hidden border shadow-xl flex flex-col justify-between p-6 sm:p-8 cursor-pointer group transition-all"
          style={{
            borderColor: isDark ? '#333742' : '#e4e4e7',
            backgroundColor: isDark ? '#141518' : '#f5f4ee',
            color: isDark ? '#f4f5f7' : '#18181b',
          }}
        >
          {/* Imagem de Fundo com Zoom Suave */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={card1Image}
              alt={card1Title}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradients */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: isDark
                  ? 'linear-gradient(180deg, rgba(18,19,23,0.3) 0%, rgba(18,19,23,0.7) 60%, rgba(18,19,23,0.95) 100%)'
                  : 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.96) 100%)',
              }}
            />
          </div>

          {/* Topo do Card 1 */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md bg-orange-600 text-white shadow-xs">
              <Sparkles className="w-3 h-3" />
              <span>{card1Tag}</span>
            </span>

            <div className="w-9 h-9 rounded-full bg-zinc-950/70 text-white backdrop-blur-xs flex items-center justify-center transition-transform group-hover:scale-110">
              <ArrowUpRight className="w-4 h-4 text-orange-500" />
            </div>
          </div>

          {/* Rodapé do Card 1 */}
          <div className="relative z-10 space-y-2 max-w-md">
            <span className="text-[10px] font-mono uppercase tracking-widest text-orange-500 font-bold block">
              Destaque Principal
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase font-sans tracking-tight">
              {card1Title}
            </h2>
            <p className="text-xs font-sans opacity-80 leading-relaxed">
              Silhuetas estruturadas de alta densidade têxtil. Clique para explorar as peças completas na vitrine.
            </p>
          </div>
        </div>

        {/* COLUNA LATERAL DIREITA: Ocupa 5 colunas no desktop dividida em 2 cards */}
        <div className="md:col-span-5 flex flex-col gap-4 sm:gap-6">
          {/* CARD 2: Calças & Alfaiataria */}
          <div
            onClick={() => handleCategoryClick(card2Category)}
            className="flex-1 relative min-h-[190px] sm:min-h-[215px] rounded-3xl overflow-hidden border shadow-lg flex flex-col justify-between p-5 sm:p-6 cursor-pointer group transition-all"
            style={{
              borderColor: isDark ? '#333742' : '#e4e4e7',
              backgroundColor: isDark ? '#181a1f' : '#ffffff',
              color: isDark ? '#f4f5f7' : '#18181b',
            }}
          >
            {/* Imagem de Fundo */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={card2Image}
                alt={card2Title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: isDark
                    ? 'linear-gradient(90deg, rgba(20,21,25,0.95) 0%, rgba(20,21,25,0.7) 60%, transparent 100%)'
                    : 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 60%, transparent 100%)',
                }}
              />
            </div>

            {/* Conteúdo do Card 2 */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider backdrop-blur-xs border"
                style={{
                  backgroundColor: isDark ? 'rgba(30,32,38,0.7)' : 'rgba(255,255,255,0.85)',
                  borderColor: isDark ? '#414552' : '#d4d4d8',
                }}
              >
                <Layers className="w-3 h-3 text-orange-500" />
                <span>{card2Tag}</span>
              </span>

              <ArrowUpRight className="w-4 h-4 text-orange-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            <div className="relative z-10 max-w-[240px]">
              <h3 className="text-lg sm:text-xl font-bold uppercase font-sans tracking-tight">
                {card2Title}
              </h3>
              <span className="text-[10px] font-mono text-orange-500 font-bold block mt-0.5">
                Ver Modelagens ↗
              </span>
            </div>
          </div>

          {/* CARD 3: Camisetas Oversized */}
          <div
            onClick={() => handleCategoryClick(card3Category)}
            className="flex-1 relative min-h-[190px] sm:min-h-[215px] rounded-3xl overflow-hidden border shadow-lg flex flex-col justify-between p-5 sm:p-6 cursor-pointer group transition-all"
            style={{
              borderColor: isDark ? '#333742' : '#e4e4e7',
              backgroundColor: isDark ? '#181a1f' : '#ffffff',
              color: isDark ? '#f4f5f7' : '#18181b',
            }}
          >
            {/* Imagem de Fundo */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={card3Image}
                alt={card3Title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: isDark
                    ? 'linear-gradient(90deg, rgba(20,21,25,0.95) 0%, rgba(20,21,25,0.7) 60%, transparent 100%)'
                    : 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 60%, transparent 100%)',
                }}
              />
            </div>

            {/* Conteúdo do Card 3 */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider backdrop-blur-xs border"
                style={{
                  backgroundColor: isDark ? 'rgba(30,32,38,0.7)' : 'rgba(255,255,255,0.85)',
                  borderColor: isDark ? '#414552' : '#d4d4d8',
                }}
              >
                <Shirt className="w-3 h-3 text-orange-500" />
                <span>{card3Tag}</span>
              </span>

              <ArrowUpRight className="w-4 h-4 text-orange-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            <div className="relative z-10 max-w-[240px]">
              <h3 className="text-lg sm:text-xl font-bold uppercase font-sans tracking-tight">
                {card3Title}
              </h3>
              <span className="text-[10px] font-mono text-orange-500 font-bold block mt-0.5">
                Ver Peças ↗
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

