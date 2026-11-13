import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, X, ShoppingBag, ArrowRight, Eye, Check } from 'lucide-react';

// Figura ilustrativa de modelo editorial em caso de ausência de foto externa
function DefaultModelSilhouette({ lookIndex = 0 }) {
  const styles = [
    { topColor: '#373a40', bottomColor: '#2b3342', skin: '#d4a373', hair: '#1a1a1a', height: 420 },
    { topColor: '#474e38', bottomColor: '#1e2430', skin: '#e0ac69', hair: '#2b1d0c', height: 430 },
    { topColor: '#171718', bottomColor: '#23252a', skin: '#c68642', hair: '#0f0f0f', height: 425 },
    { topColor: '#1e2b45', bottomColor: '#d6d3c9', skin: '#f1c27d', hair: '#3a2618', height: 435 },
    { topColor: '#3d4a3b', bottomColor: '#968972', skin: '#8d5524', hair: '#141414', height: 420 },
    { topColor: '#5c5f66', bottomColor: '#222326', skin: '#e0ac69', hair: '#261b11', height: 428 },
  ];
  const s = styles[lookIndex % styles.length];

  return (
    <svg viewBox="0 0 200 480" className="w-full h-full max-h-[460px] drop-shadow-xl select-none pointer-events-none" preserveAspectRatio="xMidYMid meet">
      {/* Sombra suave no chão */}
      <ellipse cx="100" cy="465" rx="65" ry="10" fill="rgba(0,0,0,0.18)" filter="blur(6px)" />
      
      {/* Cabeça e Cabelo */}
      <ellipse cx="100" cy="56" rx="17" ry="22" fill={s.skin} />
      {/* Cabelo moderno volumoso */}
      <path d="M 81 50 Q 100 24 119 50 Q 116 35 100 35 Q 84 35 81 50 Z" fill={s.hair} />
      {/* Pescoço com gola alta/ribana */}
      <rect x="92" y="74" width="16" height="15" fill={s.skin} />
      <path d="M 88 84 Q 100 90 112 84 Q 108 92 100 92 Q 92 92 88 84 Z" fill="#ffffff" opacity="0.8" />

      {/* Torso: Moletom / Casaco Boxy com Ombros Caídos */}
      <path
        d="M 60 92 Q 100 87 140 92 L 152 145 L 140 240 Q 100 244 60 240 L 48 145 Z"
        fill={s.topColor}
      />
      {/* Dobras estruturadas do casaco */}
      <path d="M 68 120 Q 95 140 102 235" stroke="rgba(0,0,0,0.25)" strokeWidth="2.5" fill="none" />
      <path d="M 132 120 Q 105 140 98 235" stroke="rgba(0,0,0,0.25)" strokeWidth="2.5" fill="none" />

      {/* Braços cruzados ou relaxados (pose editorial) */}
      <path d="M 52 100 Q 38 150 48 200 Q 75 220 100 215 Q 125 220 152 200 Q 162 150 148 100" stroke={s.topColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Barra de camiseta aparecendo sutilmente por baixo */}
      <path d="M 72 238 Q 100 243 128 238 L 129 248 Q 100 253 71 248 Z" fill="#ffffff" opacity="0.9" />

      {/* Calça Ampla (Wide-leg / Barrel Leg) */}
      <path
        d="M 68 248 L 52 425 Q 75 430 96 425 L 100 290 L 104 425 Q 125 430 148 425 L 132 248 Z"
        fill={s.bottomColor}
      />
      {/* Vinco / costura central da calça */}
      <line x1="74" y1="260" x2="74" y2="420" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
      <line x1="126" y1="260" x2="126" y2="420" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />

      {/* Tênis Chunky / Sneaker Streetwear */}
      <path d="M 50 422 Q 40 435 48 448 L 96 448 Q 98 435 92 422 Z" fill="#e5e5e5" />
      <path d="M 46 444 Q 72 452 98 444 L 98 449 Q 72 457 46 449 Z" fill="#18181b" />
      
      <path d="M 104 422 Q 102 435 104 448 L 152 448 Q 160 435 150 422 Z" fill="#e5e5e5" />
      <path d="M 102 444 Q 128 452 154 444 L 154 449 Q 128 457 102 449 Z" fill="#18181b" />
    </svg>
  );
}

export function RunwayLookbook({
  looks = [],
  allProducts = [],
  storeName = 'clothes.on',
  theme = 'dark',
  onSelectProduct,
  onAddToCart,
}) {
  const isDark = theme === 'dark';
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLookDrawerOpen, setIsLookDrawerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePin, setActivePin] = useState(null);

  const containerRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Drag / Swipe States
  const [dragOffset, setDragOffset] = useState(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);

  const totalLooks = looks.length || 1;
  const currentLook = looks[activeIndex] || looks[0] || {};

  // Produtos que compõem o look atual
  const lookProducts = (currentLook.productIds || []).map((pId) => {
    return allProducts.find((p) => p.id === pId) || null;
  }).filter(Boolean);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalLooks - 1));
  }, [totalLooks]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < totalLooks - 1 ? prev + 1 : 0));
  }, [totalLooks]);

  // Autoplay da passarela quando ativo
  useEffect(() => {
    if (isPlaying) {
      autoPlayRef.current = setInterval(() => {
        handleNext();
      }, 4500);
    } else {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPlaying, handleNext]);

  // Touch Swipe Handlers (Celular)
  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.touches[0].clientX;
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || !e.touches || e.touches.length === 0) return;
    const diff = e.touches[0].clientX - dragStartXRef.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (dragOffset > 45) {
      handlePrev();
    } else if (dragOffset < -45) {
      handleNext();
    }
    setDragOffset(0);
  };

  // Mouse Drag Handlers (Computador)
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    setDragOffset(0);

    const onMouseMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      setDragOffset(moveEvent.clientX - dragStartXRef.current);
    };

    const onMouseUp = (upEvent) => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      const finalDiff = upEvent.clientX - dragStartXRef.current;
      if (finalDiff > 60) {
        handlePrev();
      } else if (finalDiff < -60) {
        handleNext();
      }
      setDragOffset(0);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Preço total do look com desconto combo de 10%
  const subtotalLook = lookProducts.reduce((acc, p) => acc + (p.price || 0), 0);
  const bundleDiscount = subtotalLook * 0.10;
  const bundleTotal = subtotalLook - bundleDiscount;

  return (
    <section className="relative w-full max-w-full overflow-hidden flex flex-col items-center select-none pt-4 sm:pt-6 pb-6 sm:pb-10 transition-colors">
      {/* Título Superior "Try the Look." */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mb-2 sm:mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2
            className="text-2xl sm:text-4xl font-extrabold tracking-tight uppercase font-sans"
            style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
          >
            Try the Look<span className="text-orange-500">.</span>
          </h2>
          <p className="text-xs sm:text-sm font-mono opacity-70 mt-1 max-w-xl">
            {totalLooks} looks autorais da cabeça aos pés. Toque no modelo ou nos pins para ver as peças usadas.
          </p>
        </div>

        {/* Botão de Abrir Peças do Look Atual */}
        <button
          onClick={() => setIsLookDrawerOpen(true)}
          className="self-start sm:self-auto px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-transform active:scale-95 shadow-xs"
          style={{
            backgroundColor: isDark ? '#27292e' : '#f4f3ed',
            color: isDark ? '#f4f5f7' : '#18181b',
            border: isDark ? '1px solid #363942' : '1px solid #d4d4d8',
          }}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-orange-500" />
          <span>Ver Peças Usadas ({lookProducts.length}) ↗</span>
        </button>
      </div>

      {/* ÁREA DA PASSARELA 3D GIRATÓRIA (DEPTH RUNWAY CAROUSEL) */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        className="relative w-full max-w-6xl h-[380px] sm:h-[480px] md:h-[540px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible my-2"
      >
        {looks.map((look, idx) => {
          // Calcula a distância circular em relação ao ativo
          let dist = idx - activeIndex;
          if (dist > totalLooks / 2) dist -= totalLooks;
          if (dist < -totalLooks / 2) dist += totalLooks;

          const isCenter = dist === 0;
          const absDist = Math.abs(dist);

          // Efeito de Profundidade Focal (Blur progressivo + Escala)
          let scale = 1;
          let blur = 0;
          let opacity = 1;
          let zIndex = 30;
          let xOffset = 0;

          if (isCenter) {
            scale = 1;
            blur = 0;
            opacity = 1;
            zIndex = 30;
            xOffset = dragOffset; // segue o arrasto do dedo em tempo real
          } else if (absDist === 1) {
            scale = 0.86;
            blur = 2.5; // leve desfoque suave
            opacity = 0.72;
            zIndex = 20;
            xOffset = (dist > 0 ? 1 : -1) * (window.innerWidth < 640 ? 150 : 260) + dragOffset * 0.4;
          } else if (absDist === 2) {
            scale = 0.74;
            blur = 5; // desfoque cinematográfico
            opacity = 0.38;
            zIndex = 10;
            xOffset = (dist > 0 ? 1 : -1) * (window.innerWidth < 640 ? 250 : 440) + dragOffset * 0.2;
          } else {
            scale = 0.62;
            blur = 8;
            opacity = 0;
            zIndex = 0;
            xOffset = (dist > 0 ? 1 : -1) * 600;
          }

          return (
            <motion.div
              key={look.id || idx}
              onClick={() => {
                if (!isCenter) {
                  setActiveIndex(idx);
                } else {
                  setIsLookDrawerOpen(true);
                }
              }}
              animate={{
                x: xOffset,
                scale,
                filter: `blur(${blur}px)`,
                opacity,
                zIndex,
              }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 26,
                mass: 0.8,
              }}
              className="absolute top-0 bottom-0 flex flex-col items-center justify-end w-[240px] sm:w-[320px] md:w-[360px] pb-4 transition-transform group"
            >
              {/* Modelo (Foto Real ou Silhueta Vetorial) */}
              <div className="relative w-full h-[320px] sm:h-[430px] md:h-[480px] flex items-center justify-center">
                {look.modelImage && typeof look.modelImage === 'string' && look.modelImage.trim().length > 0 && !look.modelImage.startsWith('/images/looks') ? (
                  <img
                    src={look.modelImage}
                    alt={look.name}
                    className="w-full h-full object-contain drop-shadow-2xl pointer-events-none select-none"
                    draggable={false}
                  />
                ) : (
                  <DefaultModelSilhouette lookIndex={idx} />
                )}

                {/* Pins / Hotspots Interativos (Apenas no modelo central) */}
                {isCenter && (look.pins || []).map((pin) => {
                  const linkedProd = allProducts.find((p) => p.id === pin.productId);
                  const isPinActive = activePin === pin.id;

                  return (
                    <div
                      key={pin.id}
                      style={{ top: `${pin.y}%`, left: `${pin.x}%` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePin(isPinActive ? null : pin.id);
                        if (linkedProd && onSelectProduct) {
                          onSelectProduct(linkedProd);
                        }
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-40 group/pin cursor-pointer"
                    >
                      {/* Círculo pulsante */}
                      <div className="relative flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-white opacity-40" />
                        <div className="w-6 h-6 rounded-full bg-zinc-950/90 text-white border-2 border-white flex items-center justify-center shadow-lg transition-transform group-hover/pin:scale-110">
                          <span className="w-2 h-2 rounded-full bg-orange-500" />
                        </div>
                      </div>

                      {/* Tooltip ao passar mouse / tocar no pin */}
                      <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 hidden group-hover/pin:flex flex-col items-center pointer-events-none z-50">
                        <div className="bg-zinc-950 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded shadow-xl whitespace-nowrap border border-white/15">
                          {pin.label || linkedProd?.name}
                          {linkedProd?.price && ` · R$ ${linkedProd.price.toFixed(2)}`}
                        </div>
                        <div className="w-1.5 h-1.5 bg-zinc-950 rotate-45 -mt-0.5 border-r border-b border-white/15" />
                      </div>
                    </div>
                  );
                })}

                {/* Selo Central no Hover */}
                {isCenter && (
                  <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-zinc-950/85 text-white backdrop-blur-xs border border-white/20 shadow-xl">
                      Ver Look Completo ↗
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* BARRA DE TIMELINE & PAGINAÇÃO INFERIOR ESTILO EDITORIAL */}
      <div className="w-full max-w-4xl mx-auto px-4 mt-2 sm:mt-4 flex items-center justify-between gap-3 text-xs font-mono">
        {/* Seta Esquerda */}
        <button
          onClick={handlePrev}
          title="Look Anterior"
          className="p-2 rounded-full hover:bg-zinc-500/10 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Linha de Indicadores com Nome do Look Ativo */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 overflow-x-auto scrollbar-none py-1">
          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            {looks.map((l, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={l.id || i}
                  onClick={() => setActiveIndex(i)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all cursor-pointer ${
                    isActive ? 'font-bold text-orange-500' : 'opacity-40 hover:opacity-80'
                  }`}
                >
                  <span className="text-[11px] tracking-wider">{l.number || `0${i + 1}`}</span>
                  {isActive && (
                    <span className="text-[11px] uppercase hidden sm:inline tracking-tight font-sans">
                      {l.name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Nome do Look no mobile */}
          <span className="sm:hidden text-[10px] font-bold uppercase tracking-wider text-orange-500">
            {currentLook.name}
          </span>
        </div>

        {/* Play/Pause e Seta Direita */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pausar rotação" : "Girar automaticamente"}
            className="p-2 rounded-full hover:bg-zinc-500/10 transition-colors cursor-pointer opacity-70 hover:opacity-100"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-orange-500" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleNext}
            title="Próximo Look"
            className="p-2 rounded-full hover:bg-zinc-500/10 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DRAWER / MODAL LATERAL "IN THIS LOOK" (COMPRAR O LOOK) */}
      <AnimatePresence>
        {isLookDrawerOpen && (
          <>
            {/* Backdrop com Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLookDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 cursor-pointer"
            />

            {/* Painel Deslizante da Direita */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md sm:max-w-lg z-50 shadow-2xl flex flex-col border-l transition-colors"
              style={{
                backgroundColor: isDark ? '#202227' : '#ffffff',
                borderColor: isDark ? '#333742' : '#e4e4e7',
                color: isDark ? '#f4f5f7' : '#18181b',
              }}
            >
              {/* Header do Drawer */}
              <div
                className="p-5 border-b flex items-center justify-between"
                style={{ borderColor: isDark ? '#333742' : '#e4e4e7' }}
              >
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-orange-500 block">
                    In This Look · {currentLook.number}
                  </span>
                  <h3 className="text-lg font-bold uppercase font-sans tracking-tight">
                    {currentLook.name}
                  </h3>
                </div>

                <button
                  onClick={() => setIsLookDrawerOpen(false)}
                  className="p-2 rounded-full hover:opacity-75 transition-colors cursor-pointer"
                  style={{ backgroundColor: isDark ? '#2c2f36' : '#f4f4f5' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lista de Peças que Compõem o Look */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <p className="text-xs font-sans leading-relaxed opacity-75">
                  {currentLook.description}
                </p>

                <div className="space-y-3 pt-2">
                  {lookProducts.length === 0 ? (
                    <div className="p-6 text-center text-xs font-mono opacity-50">
                      Nenhuma peça vinculada a este look ainda.
                    </div>
                  ) : (
                    lookProducts.map((prod, pIdx) => (
                      <div
                        key={prod.id}
                        className="p-3.5 rounded-xl border flex items-center gap-3.5 transition-colors"
                        style={{
                          backgroundColor: isDark ? '#27292f' : '#f9f8f4',
                          borderColor: isDark ? '#363942' : '#e5e7eb',
                        }}
                      >
                        {/* Foto da Peça */}
                        <div
                          onClick={() => {
                            if (onSelectProduct) {
                              onSelectProduct(prod);
                              setIsLookDrawerOpen(false);
                            }
                          }}
                          className="w-16 h-18 rounded-lg overflow-hidden border shrink-0 bg-black/5 flex items-center justify-center cursor-pointer hover:opacity-90"
                          style={{ borderColor: isDark ? '#41454f' : '#d4d4d8' }}
                        >
                          {prod.image ? (
                            <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-mono opacity-40">Peça {pIdx + 1}</span>
                          )}
                        </div>

                        {/* Detalhes da Peça */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-orange-500 font-bold block">
                            Peça 0{pIdx + 1} · {prod.categoryLabel || prod.category}
                          </span>
                          <h4
                            onClick={() => {
                              if (onSelectProduct) {
                                onSelectProduct(prod);
                                setIsLookDrawerOpen(false);
                              }
                            }}
                            className="font-bold text-xs uppercase font-sans truncate cursor-pointer hover:text-orange-500 transition-colors"
                          >
                            {prod.name}
                          </h4>
                          <span className="text-xs font-mono font-bold mt-1 block">
                            R$ {(prod.price || 0).toFixed(2).replace('.', ',')}
                          </span>
                        </div>

                        {/* Botão Adicionar Peça */}
                        <button
                          onClick={() => {
                            if (onAddToCart) {
                              onAddToCart({
                                ...prod,
                                selectedSize: 'G',
                                selectedColor: prod.colorName || 'Padrão',
                                quantity: 1,
                              });
                            }
                          }}
                          title="Adicionar à sacola"
                          className="px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase bg-orange-600 hover:bg-orange-500 text-white cursor-pointer transition-colors shrink-0 shadow-2xs active:scale-95 flex items-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Adicionar</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Rodapé: Oferta Combo "Comprar Look Completo" */}
              {lookProducts.length > 0 && (
                <div
                  className="p-5 border-t space-y-3"
                  style={{
                    backgroundColor: isDark ? '#191b20' : '#faf9f5',
                    borderColor: isDark ? '#333742' : '#e4e4e7',
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="opacity-70 block">Combo Look Completo ({lookProducts.length} peças):</span>
                      <span className="text-emerald-500 font-bold text-[11px]">10% OFF no pacote</span>
                    </div>
                    <div className="text-right">
                      <span className="line-through opacity-50 text-[11px] block">
                        R$ {subtotalLook.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-base font-extrabold text-orange-500 font-sans">
                        R$ {bundleTotal.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onAddToCart) {
                        lookProducts.forEach((p) => {
                          onAddToCart({
                            ...p,
                            selectedSize: 'G',
                            selectedColor: p.colorName || 'Padrão',
                            quantity: 1,
                          });
                        });
                        setIsLookDrawerOpen(false);
                      }
                    }}
                    className="w-full py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-orange-600 hover:bg-orange-500 text-white cursor-pointer transition-transform active:scale-98 shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Adicionar Look Completo à Sacola</span>
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
