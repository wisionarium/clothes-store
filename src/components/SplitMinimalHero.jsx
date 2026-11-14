import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export function SplitMinimalHero({
  config = {},
  theme = 'dark',
  allProducts = [],
  onSelectProduct,
  onAddToCart,
}) {
  const isDark = theme === 'dark';
  const split = config?.split || {};

  const tag = split.tag || 'DROP EXCLUSIVO · EDIÇÃO LIMITADA';
  const title = split.title || 'HEAVYWEIGHT OVERSIZED TEE';
  const subtitle =
    split.subtitle ||
    'Desenvolvida com malha suedine 100% algodão penteado 260g/m². Gola canelada de 3cm que não laceia e silhueta relaxada que sustenta estrutura o dia inteiro.';
  const price = split.price || 149.90;
  const badge = split.badge || '100% ALGODÃO 260G';
  const buttonText = split.buttonText || 'Garantir Peça';
  const imageUrl = split.imageUrl || '/images/looks/model_2.jpg';

  // Encontra produto relacionado se existir
  const featuredProduct = allProducts[0] || null;

  const handleBuy = () => {
    if (featuredProduct && onAddToCart) {
      onAddToCart(featuredProduct);
    } else {
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewDetail = () => {
    if (featuredProduct && onSelectProduct) {
      onSelectProduct(featuredProduct);
    } else {
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-6 select-none">
      <div
        className="rounded-3xl border shadow-xl p-6 sm:p-10 md:p-12 transition-colors flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
        style={{
          borderColor: isDark ? '#333742' : '#e4e4e7',
          backgroundColor: isDark ? '#191b20' : '#ffffff',
          color: isDark ? '#f4f5f7' : '#18181b',
        }}
      >
        {/* LADO ESQUERDO (50%): Textos, Especificações & CTAs */}
        <div className="flex-1 w-full space-y-5">
          {/* Micro Tag de Lançamento */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/25">
            <Sparkles className="w-3 h-3" />
            <span>{tag}</span>
          </div>

          {/* Headline Principal */}
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase font-sans tracking-tight leading-[1.1]">
            {title}
          </h1>

          {/* Descrição Editorial */}
          <p className="text-xs sm:text-sm font-sans leading-relaxed opacity-80 max-w-lg">
            {subtitle}
          </p>

          {/* Bullets de Engenharia Têxtil */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs font-mono">
            <div className="flex items-center gap-2 opacity-85">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Malha Encorpada 260g/m²</span>
            </div>
            <div className="flex items-center gap-2 opacity-85">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Gola Canelada 3cm Firme</span>
            </div>
            <div className="flex items-center gap-2 opacity-85">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Corte Boxy Streetwear</span>
            </div>
            <div className="flex items-center gap-2 opacity-85">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Toque Aveludado & Pré-encolhido</span>
            </div>
          </div>

          {/* Preço & Botão de Compra Direta */}
          <div className="pt-4 border-t flex flex-wrap items-center gap-4" style={{ borderColor: isDark ? '#333742' : '#e4e4e7' }}>
            <div>
              <span className="text-[10px] font-mono uppercase opacity-60 block">Valor Especial do Drop</span>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-orange-500">
                R$ {typeof price === 'number' ? price.toFixed(2) : price}
              </span>
            </div>

            <div className="flex items-center gap-2.5 ml-auto">
              <button
                onClick={handleBuy}
                className="px-6 py-3.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-orange-600 hover:bg-orange-500 text-white flex items-center gap-2 cursor-pointer transition-transform active:scale-95 shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{buttonText}</span>
              </button>

              <button
                onClick={handleViewDetail}
                title="Ver Detalhes da Peça"
                className="p-3.5 rounded-full border hover:bg-zinc-500/10 transition-colors cursor-pointer"
                style={{ borderColor: isDark ? '#414552' : '#d4d4d8' }}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* LADO DIREITO (50%): Vitrine Visual com Foto e Badges */}
        <div className="flex-1 w-full flex items-center justify-center relative">
          <div
            className="relative w-full max-w-md h-[400px] sm:h-[480px] rounded-2xl overflow-hidden border shadow-2xl flex items-center justify-center group"
            style={{
              borderColor: isDark ? '#333742' : '#e4e4e7',
              backgroundColor: isDark ? '#141518' : '#f5f4ef',
            }}
          >
            {/* Foto do Modelo / Peça */}
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-104"
            />

            {/* Badge Flutuante Superior */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-950/80 text-white backdrop-blur-xs border border-white/20 shadow-md">
              {badge}
            </div>

            {/* Overlay Inferior com Indicador */}
            <div
              className="absolute bottom-0 inset-x-0 p-4 flex items-center justify-between text-[11px] font-mono backdrop-blur-xs z-10"
              style={{
                background: isDark
                  ? 'linear-gradient(180deg, transparent 0%, rgba(18,19,23,0.9) 100%)'
                  : 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.9) 100%)',
              }}
            >
              <span className="font-bold uppercase tracking-wider">Silhueta Autoral</span>
              <span className="text-orange-500 font-bold">Ver Peça ↗</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

