import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, ChevronRight } from 'lucide-react';

export function EditorialBannerHero({
  config = {},
  theme = 'dark',
  storeName = 'clothes.on',
  onExplore,
}) {
  const isDark = theme === 'dark';
  const banner = config?.banner || {};

  const tag = banner.tag || 'NEW COLLECTION · CONCRETE SEASON';
  const title = banner.title || 'SILHUETAS ESTRUTURADAS';
  const subtitle =
    banner.subtitle ||
    'Tecidos densos de 260g/m², corte boxy contemporâneo e caimento impecável sem ruídos visuais.';
  const buttonText = banner.buttonText || 'Explorar Coleção';
  const imageUrl = banner.imageUrl || '/images/looks/model_1.jpg';

  const handleScrollToCatalog = () => {
    if (onExplore) {
      onExplore();
    } else {
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-6 select-none">
      {/* Banner Container com Aspect Ratio Editorial */}
      <div
        className="relative w-full min-h-[440px] sm:min-h-[520px] md:min-h-[580px] rounded-3xl overflow-hidden border shadow-2xl flex flex-col justify-end p-6 sm:p-10 md:p-14 transition-colors"
        style={{
          borderColor: isDark ? '#333742' : '#e4e4e7',
          backgroundColor: isDark ? '#141518' : '#f0efe9',
        }}
      >
        {/* Imagem de Fundo Fotográfica de Alta Resolução */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover object-top sm:object-center transform scale-102 transition-transform duration-700 hover:scale-105"
          />

          {/* Gradients Editoriais para Legibilidade Perfeita */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isDark
                ? 'linear-gradient(180deg, rgba(18,19,23,0.3) 0%, rgba(18,19,23,0.7) 60%, rgba(18,19,23,0.95) 100%)'
                : 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.75) 60%, rgba(255,255,255,0.96) 100%)',
            }}
          />

          {/* Vinheta lateral no desktop */}
          <div
            className="hidden sm:block absolute inset-0 pointer-events-none"
            style={{
              background: isDark
                ? 'linear-gradient(90deg, rgba(18,19,23,0.9) 0%, rgba(18,19,23,0.4) 50%, transparent 100%)'
                : 'linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
            }}
          />
        </div>

        {/* Conteúdo Editorial em Camadas */}
        <div className="relative z-10 max-w-2xl space-y-4">
          {/* Tag de Coleção */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest backdrop-blur-md shadow-sm border"
            style={{
              backgroundColor: isDark ? 'rgba(30, 32, 38, 0.75)' : 'rgba(255, 255, 255, 0.85)',
              borderColor: isDark ? '#414552' : '#d4d4d8',
              color: isDark ? '#f4f5f7' : '#18181b',
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>{tag}</span>
          </motion.div>

          {/* Título Principal */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight uppercase font-sans leading-[1.05]"
            style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
          >
            {title}
            <span className="text-orange-500">.</span>
          </motion.h1>

          {/* Subtítulo Descritivo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs sm:text-base font-sans leading-relaxed opacity-85 max-w-xl"
            style={{ color: isDark ? '#d4d4d8' : '#27272a' }}
          >
            {subtitle}
          </motion.p>

          {/* Botões de Ação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <button
              onClick={handleScrollToCatalog}
              className="px-6 py-3.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-orange-600 hover:bg-orange-500 text-white flex items-center gap-2 cursor-pointer transition-transform active:scale-95 shadow-lg"
            >
              <span>{buttonText}</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              onClick={handleScrollToCatalog}
              className="px-5 py-3.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md border flex items-center gap-2 cursor-pointer transition-colors hover:opacity-80"
              style={{
                backgroundColor: isDark ? 'rgba(30, 32, 38, 0.6)' : 'rgba(255, 255, 255, 0.7)',
                borderColor: isDark ? '#414552' : '#d4d4d8',
                color: isDark ? '#f4f5f7' : '#18181b',
              }}
            >
              <span>Ver Catálogo</span>
              <ChevronRight className="w-4 h-4 text-orange-500" />
            </button>
          </motion.div>
        </div>

        {/* Rodapé Interno com Atributos Streetwear */}
        <div
          className="relative z-10 pt-6 mt-6 border-t flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono opacity-65"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
        >
          <span>AUTORAL · {storeName.toUpperCase()}</span>
          <span>100% ALGODÃO SÉRIE LIMITADA</span>
          <span className="hidden sm:inline">ENVIO PARA TODO O BRASIL</span>
        </div>
      </div>
    </section>
  );
}

