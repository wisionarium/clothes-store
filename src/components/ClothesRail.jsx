import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GarmentItem } from './GarmentItem';

export function ClothesRail({ products, currentIndex, onSelectIndex, onUnfold, theme = 'light' }) {
  const isDark = theme === 'dark';
  const containerRef = useRef(null);
  const railItemsRef = useRef(null);
  const [velocity, setVelocity] = useState(0);
  const velocityTimeoutRef = useRef(null);
  const [isScrubbing, setIsScrubbing] = useState(false);

  // Mantém uma ref com o currentIndex atualizado para os listeners de eventos de alta performance
  const currentIndexRef = useRef(currentIndex);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Detecção responsiva de viewport para Mobile (< 640px)
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 640 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Gatilho de impulso de velocidade para gerar o balanço pendular (efeito de onda)
  const triggerWave = useCallback((direction = 1) => {
    setVelocity(direction * 22);
    if (velocityTimeoutRef.current) clearTimeout(velocityTimeoutRef.current);
    velocityTimeoutRef.current = setTimeout(() => {
      setVelocity(0);
    }, 450);
  }, []);

  const handlePrev = useCallback(() => {
    if (currentIndexRef.current > 0) {
      triggerWave(-1);
      onSelectIndex(currentIndexRef.current - 1);
    }
  }, [onSelectIndex, triggerWave]);

  const handleNext = useCallback(() => {
    if (currentIndexRef.current < products.length - 1) {
      triggerWave(1);
      onSelectIndex(currentIndexRef.current + 1);
    }
  }, [products.length, onSelectIndex, triggerWave]);

  // Navegação por teclado (Setas esquerda e direita)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Navegação por Scroll / Roda do Mouse
  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) > 15 || Math.abs(e.deltaY) > 25) {
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      if (delta > 30) {
        handleNext();
      } else if (delta < -30) {
        handlePrev();
      }
    }
  };

  // Função para identificar dinamicamente qual camisa está exatamente na posição horizontal X do cursor/dedo
  const getIndexFromClientX = useCallback((clientX) => {
    if (!railItemsRef.current) return -1;
    const children = Array.from(railItemsRef.current.children);
    if (!children.length) return -1;

    const firstRect = children[0].getBoundingClientRect();
    const lastRect = children[children.length - 1].getBoundingClientRect();

    if (clientX <= firstRect.left) return 0;
    if (clientX >= lastRect.right) return children.length - 1;

    // 1. Testa se o ponto está diretamente contido dentro da largura de alguma peça
    for (let idx = 0; idx < children.length; idx++) {
      const rect = children[idx].getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right) {
        return idx;
      }
    }

    // 2. Se cair entre gaps, pega o mais próximo pelo centro geométrico
    let closestIdx = -1;
    let minDistance = Infinity;
    children.forEach((child, idx) => {
      const rect = child.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(clientX - center);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    return closestIdx;
  }, []);

  // --- ARRASTE CONTÍNUO COM MOUSE NO DESKTOP (SCRUBBING FLUIDO) ---
  const isMouseDownRef = useRef(false);
  const mouseStartXRef = useRef(0);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // apenas botão esquerdo
    e.preventDefault(); // Impede ghost drag nativo do navegador!
    isMouseDownRef.current = true;
    mouseStartXRef.current = e.clientX;

    const onWindowMouseMove = (moveEvent) => {
      if (!isMouseDownRef.current) return;
      const diffX = Math.abs(moveEvent.clientX - mouseStartXRef.current);
      if (diffX > 4) {
        setIsScrubbing(true);
        const targetIdx = getIndexFromClientX(moveEvent.clientX);
        if (targetIdx !== -1 && targetIdx !== currentIndexRef.current) {
          triggerWave(targetIdx > currentIndexRef.current ? 1 : -1);
          onSelectIndex(targetIdx);
        }
      }
    };

    const onWindowMouseUp = () => {
      isMouseDownRef.current = false;
      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('mouseup', onWindowMouseUp);
      setTimeout(() => {
        setIsScrubbing(false);
      }, 80);
    };

    window.addEventListener('mousemove', onWindowMouseMove);
    window.addEventListener('mouseup', onWindowMouseUp);
  };

  // --- ARRASTE CONTÍNUO COM O DEDO NO TOUCH/CELULAR (SCRUBBING TOUCH) ---
  const isTouchScrubbingRef = useRef(false);
  const touchStartPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchStart = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
      isTouchScrubbingRef.current = false;
    };

    const onTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const diffX = touch.clientX - touchStartPosRef.current.x;
      const diffY = touch.clientY - touchStartPosRef.current.y;

      // Inicia o scrubbing contínuo assim que detecta o deslizar horizontal
      if (!isTouchScrubbingRef.current) {
        if (Math.abs(diffX) > 6 && Math.abs(diffX) > Math.abs(diffY)) {
          isTouchScrubbingRef.current = true;
          setIsScrubbing(true);
        }
      }

      if (isTouchScrubbingRef.current) {
        if (e.cancelable) {
          e.preventDefault();
        }

        const targetIdx = getIndexFromClientX(touch.clientX);
        if (targetIdx !== -1 && targetIdx !== currentIndexRef.current) {
          triggerWave(targetIdx > currentIndexRef.current ? 1 : -1);
          onSelectIndex(targetIdx);
        }
      }
    };

    const onTouchEnd = () => {
      isTouchScrubbingRef.current = false;
      setTimeout(() => {
        setIsScrubbing(false);
      }, 80);
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    container.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [getIndexFromClientX, onSelectIndex, triggerWave]);

  const currentProduct = products[currentIndex] || products[0];

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      className="relative w-full max-w-full flex flex-col items-center select-none overflow-x-hidden pb-2 sm:pb-4 touch-pan-y cursor-grab active:cursor-grabbing"
    >
      {/* Subtítulo superior */}
      <div className="text-center mb-3 sm:mb-6 px-3">
        <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] sm:tracking-[0.25em] text-zinc-400 uppercase font-medium">
          ON THE RAIL &nbsp;|&nbsp; LEVANT / CONCRETE SEASON
        </span>
      </div>

      {/* ÁREA DA ARARA METÁLICA (THE RAIL) */}
      <div className="relative w-full max-w-5xl h-[320px] sm:h-[430px] flex flex-col items-center justify-start px-2 sm:px-4 overflow-hidden select-none">
        {/* Trilho Metálico Cromado Superior */}
        <div className="relative w-full flex items-center z-30">
          {/* Suporte de fixação esquerdo */}
          <div className="w-3.5 sm:w-5 h-5 sm:h-7 bg-gradient-to-r from-zinc-700 via-zinc-400 to-zinc-600 rounded-xs shadow-md flex items-center justify-center">
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-zinc-800 border border-zinc-400/50" />
          </div>

          {/* O cano cromado de metal */}
          <div className="flex-1 h-2.5 sm:h-3.5 bg-gradient-to-b from-zinc-200 via-zinc-400 to-zinc-700 rounded-xs shadow-md relative overflow-hidden">
            {/* Brilho linear do cano */}
            <div className="absolute inset-x-0 top-[1.5px] h-[1px] sm:h-[1.5px] bg-white/70" />
            <div className="absolute inset-x-0 bottom-[1px] h-[1px] sm:h-[1.5px] bg-black/40" />
          </div>

          {/* Suporte de fixação direito */}
          <div className="w-3.5 sm:w-5 h-5 sm:h-7 bg-gradient-to-r from-zinc-600 via-zinc-400 to-zinc-700 rounded-xs shadow-md flex items-center justify-center">
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-zinc-800 border border-zinc-400/50" />
          </div>
        </div>

        {/* Conjunto de Roupas Penduradas */}
        <div
          ref={railItemsRef}
          className="w-full flex items-start justify-center gap-0.5 sm:gap-2.5 overflow-visible z-20"
          style={{ marginTop: isMobile ? '-5px' : '-7px' }}
        >
          {products.map((product, idx) => (
            <GarmentItem
              key={product.id}
              product={product}
              index={idx}
              currentIndex={currentIndex}
              onSelect={(index) => {
                if (index !== currentIndexRef.current) {
                  triggerWave(index > currentIndexRef.current ? 1 : -1);
                  onSelectIndex(index);
                }
              }}
              onOpenDetails={(index) => {
                onSelectIndex(index);
                onUnfold();
              }}
              velocity={velocity}
              isMobile={isMobile}
              isScrubbing={isScrubbing}
            />
          ))}
        </div>
      </div>

      {/* PAINEL CENTRAL DE INFORMAÇÕES DA PEÇA ATIVA */}
      <div className="w-full max-w-md flex flex-col items-center mt-2 sm:mt-3 text-center px-4 z-20">
        <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-semibold mb-0.5 sm:mb-1">
          PIECE {currentProduct.num} / 0{products.length}
        </span>

        {/* Nome do Produto com Setas de Navegação */}
        <div className="flex items-center justify-between sm:justify-center gap-2 sm:gap-4 w-full my-1">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Peça anterior"
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
              currentIndex === 0
                ? 'opacity-25 cursor-not-allowed'
                : 'hover:scale-105 active:scale-95'
            }`}
            style={{
              backgroundColor: isDark ? '#27292e' : '#ffffff',
              borderColor: isDark ? '#3d4049' : '#e4e4e7',
              color: isDark ? '#f4f5f7' : '#27272a',
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            onClick={onUnfold}
            className="flex-1 min-w-0 cursor-pointer group px-1"
            title="Clique para ver os detalhes completos"
          >
            <h2
              className="text-lg sm:text-2xl font-bold tracking-tight font-sans uppercase group-hover:text-orange-500 transition-colors line-clamp-1"
              style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
            >
              {currentProduct.name}
            </h2>
            <p
              className="text-[11px] sm:text-xs font-mono uppercase tracking-wider mt-0.5 line-clamp-1"
              style={{ color: isDark ? '#9da3af' : '#71717a' }}
            >
              {currentProduct.category} · R$ {currentProduct.price}
            </p>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === products.length - 1}
            aria-label="Próxima peça"
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
              currentIndex === products.length - 1
                ? 'opacity-25 cursor-not-allowed'
                : 'hover:scale-105 active:scale-95'
            }`}
            style={{
              backgroundColor: isDark ? '#27292e' : '#ffffff',
              borderColor: isDark ? '#3d4049' : '#e4e4e7',
              color: isDark ? '#f4f5f7' : '#27272a',
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Botão de ação rápida no celular para abrir detalhes */}
        <button
          onClick={onUnfold}
          className="mt-2 sm:hidden px-4 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase transition-all cursor-pointer shadow-xs active:scale-95"
          style={{
            backgroundColor: isDark ? '#f4f5f7' : '#18181b',
            color: isDark ? '#18181b' : '#ffffff',
          }}
        >
          Ver Detalhes da Peça ↗
        </button>
      </div>

      {/* FAIXA LARANJA INDUSTRIAL (TICKER MARQUEE) */}
      <div className="w-full max-w-full mt-5 sm:mt-6 overflow-hidden bg-[#ff4d00] py-2 sm:py-2.5 shadow-xs border-y border-[#e04400]">
        <div className="whitespace-nowrap flex animate-[marquee_24s_linear_infinite]">
          {[1, 2, 3].map((key) => (
            <span
              key={key}
              className="text-[10px] sm:text-xs font-black tracking-widest text-zinc-950 uppercase font-mono px-4 select-none"
            >
              LEVANT · CONCRETE SEASON N° 01 &nbsp;+&nbsp; ON LOOKS, BE HYPER &nbsp;+&nbsp; TAKE IT TO 100% WASH SAND &nbsp;+&nbsp; FAULT HEAVY &nbsp;+&nbsp; ROBUST FIT &nbsp;+&nbsp; NO LOGOS, NO NOISE &nbsp;+&nbsp; MADE TO BE WORN HARD &nbsp;+&nbsp; BUILT HEAVY &nbsp;+&nbsp;
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
