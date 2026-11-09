import React from 'react';
import { motion } from 'framer-motion';

// Componente para desenhar o cabide de madeira realista e o gancho metálico
export function Hanger({ woodColor = '#c59b68', isFront = true }) {
  return (
    <svg
      viewBox="0 0 240 90"
      className="w-full overflow-visible drop-shadow-sm select-none pointer-events-none"
    >
      <defs>
        {/* Gradiente cromado para o gancho metálico */}
        <linearGradient id="chromeHook" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#71717a" />
          <stop offset="30%" stopColor="#d4d4d8" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#a1a1aa" />
          <stop offset="100%" stopColor="#52525b" />
        </linearGradient>

        {/* Gradiente madeira para o corpo do cabide */}
        <linearGradient id={`woodGrad-${woodColor.replace('#','')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={woodColor} stopOpacity="1" />
          <stop offset="70%" stopColor={woodColor} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3d2614" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Gancho Metálico que engata na barra */}
      {isFront ? (
        <path
          d="M 120 42 C 120 30 115 15 124 7 C 132 0 142 8 138 20 C 136 26 130 28 126 33"
          fill="none"
          stroke="url(#chromeHook)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M 120 42 C 120 30 118 16 123 8 C 127 2 133 7 131 18 C 130 24 126 27 124 33"
          fill="none"
          stroke="url(#chromeHook)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      )}

      {/* Base / corpo do Cabide de Madeira */}
      {isFront ? (
        <path
          d="M 120 42 
             C 145 46 195 56 226 70 
             C 230 72 230 76 226 78 
             C 200 70 145 60 120 58 
             C 95 60 40 70 14 78 
             C 10 76 10 72 14 70 
             C 45 56 95 46 120 42 Z"
          fill={`url(#woodGrad-${woodColor.replace('#','')})`}
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
        />
      ) : (
        /* Cabide visto de lado/perfil */
        <path
          d="M 116 42 
             C 120 44 124 44 128 42
             L 129 70 
             C 127 73 121 73 117 70 Z"
          fill={`url(#woodGrad-${woodColor.replace('#','')})`}
        />
      )}
    </svg>
  );
}

// Representação fotográfica real da camisa no cabide
export function GarmentGraphic({ product, isFront = true }) {
  const hasBuiltInHanger = Boolean(product?.hasBuiltInHanger);

  if (isFront) {
    return (
      <div className="relative w-full h-full flex flex-col items-center select-none justify-start pointer-events-none">
        {/* Cabide SVG sobreposto apenas se a imagem NÃO tiver cabide próprio */}
        {!hasBuiltInHanger && (
          <div className="w-[62%] relative z-20 -mb-[26px] drop-shadow-md">
            <Hanger woodColor={product.hangerWood || '#c59b68'} isFront={true} />
          </div>
        )}

        {/* Imagem Frontal Real da Camiseta */}
        <div className={`relative w-full h-full flex items-start justify-center overflow-visible ${hasBuiltInHanger ? 'pt-0' : ''}`}>
          <img
            src={product.image}
            alt={product.name}
            draggable="false"
            onDragStart={(e) => e.preventDefault()}
            className="w-full h-full object-contain object-top pointer-events-none drop-shadow-xl select-none"
            style={{
              filter: 'contrast(1.02) brightness(1.0)',
            }}
            loading="eager"
          />
        </div>
      </div>
    );
  }

  // Visão de Perfil Real da Camiseta pendurada de lado
  return (
    <div className="relative w-full h-full flex flex-col items-center select-none justify-start pointer-events-none">
      {/* Cabide lateral SVG apenas se a imagem NÃO tiver cabide próprio */}
      {!hasBuiltInHanger && (
        <div className="w-[28px] sm:w-[38px] relative z-20 -mb-[12px] sm:-mb-[16px] drop-shadow-sm">
          <Hanger woodColor={product.hangerWood || '#c59b68'} isFront={false} />
        </div>
      )}

      {/* Imagem Lateral Real da Camiseta - auto contida no container sem estourar a largura no mobile */}
      <div className={`relative w-full h-full max-w-[68px] flex items-start justify-center overflow-visible ${hasBuiltInHanger ? 'pt-0' : ''}`}>
        <img
          src={product.imageSide || product.image}
          alt={`${product.name} perfil`}
          draggable="false"
          onDragStart={(e) => e.preventDefault()}
          className="w-full h-full object-contain object-top pointer-events-none drop-shadow-md select-none"
          style={{
            filter: 'contrast(1.02) brightness(1.0)',
          }}
          loading="eager"
        />
      </div>
    </div>
  );
}

// O item completo que se posiciona no trilho
export function GarmentItem({
  product,
  index,
  currentIndex,
  onSelect,
  onOpenDetails,
  velocity = 0,
  isMobile = false,
  isScrubbing = false,
}) {
  const isSelected = index === currentIndex;
  const distance = index - currentIndex;

  // Cálculo da física de balanço/onda (swing) baseado no arraste/movimento
  const waveSwing = -velocity * 0.42 * Math.cos(distance * 0.5);

  const handleClick = (e) => {
    e.stopPropagation();
    // Se estava arrastando o mouse ou dedo (scrubbing), não abre os detalhes por acidente
    if (isScrubbing) return;

    if (!isSelected) {
      // Ao dar um toque simples na peça de lado, vira ela para a frente!
      onSelect(index);
    } else {
      // Se já está de frente (selecionada), o clique/toque abre a página de detalhes da peça
      if (onOpenDetails) {
        onOpenDetails(index);
      }
    }
  };

  const targetWidth = isSelected ? (isMobile ? 190 : 290) : (isMobile ? 22 : 70);
  const targetHeight = isSelected ? (isMobile ? 280 : 400) : (isMobile ? 250 : 360);
  const targetRotateY = isSelected ? 0 : distance > 0 ? (isMobile ? 20 : 32) : (isMobile ? -20 : -32);

  return (
    <motion.div
      onClick={handleClick}
      onMouseEnter={() => {
        // No desktop, o hover também seleciona suavemente quando não estiver arrastando
        if (!isMobile && !isScrubbing) onSelect(index);
      }}
      title={isSelected ? "Clique para explorar os detalhes ↗" : "Toque ou clique para ver de frente"}
      className="cursor-pointer flex flex-col items-center select-none px-0 group relative shrink-0"
      style={{
        transformOrigin: 'top center', // O pêndulo oscila exatamente a partir do gancho no trilho!
      }}
      animate={{
        // Balanço pendular (efeito de onda)
        rotateZ: waveSwing,
        // Efeito de profundidade e elevação sutil no foco
        scale: isSelected ? 1.04 : 0.94,
        y: isSelected ? 0 : 4,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 220,
        damping: 20,
        mass: 0.7,
      }}
    >
      {/* Container com perspectiva 3D para virar de frente suavemente */}
      <motion.div
        className="relative flex flex-col items-center justify-start pointer-events-none select-none"
        animate={{
          width: targetWidth,
          height: targetHeight,
          rotateY: targetRotateY,
        }}
        transition={{
          type: 'spring',
          stiffness: 240,
          damping: 24,
        }}
        style={{
          perspective: 1000,
          transformStyle: 'preserve-3d',
        }}
      >
        {isSelected ? (
          <motion.div
            key="front"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full relative flex flex-col items-center justify-start"
          >
            <GarmentGraphic product={product} isFront={true} />

            {/* Tag flutuante discreta ao passar o mouse na peça ativa */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <span className="bg-zinc-950/85 backdrop-blur-xs text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-full shadow-lg border border-white/20 translate-y-6 group-hover:translate-y-0 transition-transform">
                Ver Detalhes ↗
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="side"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex flex-col items-center justify-start hover:opacity-90"
          >
            <GarmentGraphic product={product} isFront={false} />
          </motion.div>
        )}
      </motion.div>

      {/* Indicador de seleção */}
      <div className={`mt-1.5 h-1 rounded-full transition-all duration-300 ${isSelected ? 'w-6 sm:w-8 bg-zinc-800 dark:bg-zinc-300' : 'w-1.5 sm:w-2 bg-transparent'}`} />
    </motion.div>
  );
}
