import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, X, ShoppingBag, Eye, Check } from 'lucide-react';

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

  // Responsividade
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 640 : false;
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Drag / Swipe States para a rotação contínua da roda
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const dragTimeStartRef = useRef(0);

  const totalLooks = looks.length || 6;
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

  // Autoplay da roda quando ativo
  useEffect(() => {
    if (isPlaying) {
      autoPlayRef.current = setInterval(() => {
        handleNext();
      }, 4200);
    } else {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPlaying, handleNext]);

  // --- TOUCH SWIPE HANDLERS (CELULAR) ---
  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    setIsDragging(true);
    dragStartXRef.current = e.touches[0].clientX;
    dragTimeStartRef.current = Date.now();
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !e.touches || e.touches.length === 0) return;
    const diff = e.touches[0].clientX - dragStartXRef.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const duration = Date.now() - dragTimeStartRef.current;
    const velocity = Math.abs(dragOffset) / Math.max(duration, 1);

    // Movimentação bem curtinha para girar com facilidade e pouco esforço
    if (dragOffset > 15 || (dragOffset > 6 && velocity > 0.15)) {
      handlePrev();
    } else if (dragOffset < -15 || (dragOffset < -6 && velocity > 0.15)) {
      handleNext();
    }
    setDragOffset(0);
  };

  // --- MOUSE DRAG HANDLERS (COMPUTADOR) ---
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragTimeStartRef.current = Date.now();
    setDragOffset(0);

    const onMouseMove = (moveEvent) => {
      setDragOffset(moveEvent.clientX - dragStartXRef.current);
    };

    const onMouseUp = (upEvent) => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      const finalDiff = upEvent.clientX - dragStartXRef.current;
      const duration = Date.now() - dragTimeStartRef.current;
      const velocity = Math.abs(finalDiff) / Math.max(duration, 1);

      // Movimento suave e curto no mouse para troca rápida
      if (finalDiff > 18 || (finalDiff > 8 && velocity > 0.15)) {
        handlePrev();
      } else if (finalDiff < -18 || (finalDiff < -8 && velocity > 0.15)) {
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

  // Parâmetros da roda circular 3D
  const angleStep = 360 / totalLooks; // 60° para 6 looks
  // Resposta rápida do ângulo de arrasto: rotação com deslocamento curto
  const dragAngleOffset = (dragOffset / (isMobile ? 55 : 75)) * angleStep;
  const currentWheelAngle = -activeIndex * angleStep + dragAngleOffset;

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
            {totalLooks} looks autorais da cabeça aos pés. Arraste para girar a roda e toque para ver as peças usadas.
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

      {/* ÁREA DA RODA GIRATÓRIA 3D (CIRCULAR CAROUSEL WHEEL) */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{ perspective: 1200 }}
        className="relative w-full max-w-6xl h-[400px] sm:h-[490px] md:h-[550px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible my-1 select-none"
      >
        {/* Iluminação do Palco Circular no Chão */}
        <div
          className="absolute bottom-4 sm:bottom-6 w-[320px] sm:w-[600px] h-20 sm:h-28 rounded-[100%] pointer-events-none transition-opacity"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, transparent 80%)'
              : 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.02) 50%, transparent 80%)',
          }}
        />

        {/* Fila Circular de Modelos */}
        {looks.map((look, idx) => {
          // Ângulo base deste modelo no anel da roda
          const baseAngle = idx * angleStep;
          // Ângulo relativo em relação à câmera
          let rawDiff = (baseAngle + currentWheelAngle) % 360;
          let relAngle = ((rawDiff + 540) % 360) - 180; // normalizado entre -180° e +180°

          const rad = (relAngle * Math.PI) / 180;
          const absAngle = Math.abs(relAngle);
          const isCenter = absAngle < 24;

          // RAIO & DISTRIBUIÇÃO CIRCULAR PANORÂMICA:
          // Utiliza projeção angular que abre a visão nos vizinhos mantendo sobreposição elegante de ombros
          const maxRadiusX = isMobile ? 250 : 390;
          const radiusZ = isMobile ? 75 : 110;

          // Mapeia suavemente o arco frontal (-135° a +135°) para distribuição horizontal
          const arcAngleRad = (relAngle * 0.65 * Math.PI) / 180;
          const x = Math.sin(arcAngleRad) * maxRadiusX;
          const z = (Math.cos(rad) - 1) * radiusZ;
          const y = (1 - Math.cos(rad)) * -14; // ligeira elevação circular de palco

          // Profundidade normalizada (1.0 na frente, 0.0 atrás)
          const depthNorm = Math.max(0, (Math.cos(rad) + 1) / 2);

          // Escala: 1.0 na frente, 0.88 no primeiro vizinho, 0.78 no segundo
          const scale = 0.76 + depthNorm * 0.24;

          // Desfoque focal tipo câmera aberta (bokeh f/1.8):
          // 0px no centro, ~1.2px no vizinho imediato, ~3.6px no mais distante
          const blur = Math.max(0, (1 - Math.cos(rad)) * 2.4);

          // Fade out suave para modelos que passam para o fundo do carrossel
          const opacity = absAngle > 145 ? 0 : Math.max(0, Math.min(1, (145 - absAngle) / 25));

          // Z-index para sobreposição correta
          const zIndex = Math.round(depthNorm * 40);

          // Rotação Y para acompanhar a curvatura circular da passarela
          const rotateY = -relAngle * 0.22;

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
              style={{
                position: 'absolute',
                transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                filter: `blur(${blur}px)`,
                opacity,
                zIndex,
                transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), filter 0.4s ease, opacity 0.4s ease',
              }}
              className="flex flex-col items-center justify-end w-[220px] sm:w-[280px] md:w-[320px] pb-4 group"
            >
              {/* Sombra de Contato Suave no Chão */}
              <div
                className="w-28 sm:w-36 h-3 rounded-[100%] bg-black/35 blur-xs -mb-1 shrink-0 transition-opacity"
                style={{ opacity: 0.25 + depthNorm * 0.35 }}
              />

              {/* Foto do Manequim Streetwear (PNG sem fundo ou padrão) */}
              <div className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] flex items-center justify-center">
                <img
                  src={look.modelImage && look.modelImage.trim().length > 15 ? look.modelImage : `/images/looks/model_${(idx % 6) + 1}.jpg`}
                  alt={look.name}
                  onError={(e) => {
                    // Fallback imediato se o link externo ou base64 estiver corrompido
                    e.target.onerror = null;
                    e.target.src = `/images/looks/model_${(idx % 6) + 1}.jpg`;
                  }}
                  className="w-full h-full object-contain drop-shadow-2xl pointer-events-none select-none"
                  draggable={false}
                />

                {/* Pins / Hotspots Interativos (Apenas no modelo central ativo) */}
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
                      {/* Ponto Pulsante */}
                      <div className="relative flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-white opacity-40" />
                        <div className="w-5 h-5 rounded-full bg-zinc-950 text-white border-2 border-white flex items-center justify-center shadow-lg transition-transform group-hover/pin:scale-115">
                          <span className="w-2 h-2 rounded-full bg-orange-500" />
                        </div>
                      </div>

                      {/* Tooltip ao passar o mouse */}
                      <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 hidden group-hover/pin:flex flex-col items-center pointer-events-none z-50">
                        <div className="bg-zinc-950/95 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap border border-white/20">
                          {pin.label || linkedProd?.name}
                          {linkedProd?.price && ` · R$ ${linkedProd.price.toFixed(2)}`}
                        </div>
                        <div className="w-1.5 h-1.5 bg-zinc-950 rotate-45 -mt-0.5 border-r border-b border-white/20" />
                      </div>
                    </div>
                  );
                })}

                {/* Botão Flutuante 'Ver Look Completo' no Modelo Central */}
                {isCenter && (
                  <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-zinc-950/90 text-white backdrop-blur-xs border border-white/25 shadow-xl flex items-center gap-1">
                      Ver Look Completo ↗
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* BARRA DE TIMELINE & PAGINAÇÃO INFERIOR */}
      <div className="w-full max-w-4xl mx-auto px-4 mt-2 sm:mt-4 flex items-center justify-between gap-3 text-xs font-mono">
        {/* Seta Esquerda */}
        <button
          onClick={handlePrev}
          title="Girar para o Look Anterior"
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
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    isActive ? 'font-bold text-orange-500 bg-orange-500/10' : 'opacity-40 hover:opacity-80'
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
            title={isPlaying ? "Pausar rotação contínua" : "Girar automaticamente"}
            className="p-2 rounded-full hover:bg-zinc-500/10 transition-colors cursor-pointer opacity-70 hover:opacity-100"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-orange-500" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleNext}
            title="Girar para o Próximo Look"
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
