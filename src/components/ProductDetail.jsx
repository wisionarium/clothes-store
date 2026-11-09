import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Plus, Minus, Sparkles, Maximize2 } from 'lucide-react';
import { GarmentGraphic } from './GarmentItem';
import { ProductPlaceholder } from './ProductPlaceholder';
import { Recommendations } from './Recommendations';

export function ProductDetail({ product, onBack, onAddToEdit, onSelectProduct, theme = 'light' }) {
  const isDark = theme === 'dark';

  const isPantsOrShorts = useMemo(() => {
    return (
      product.category === 'calcas' ||
      product.category === 'bermudas' ||
      (product.categoryLabel && /calça|bermuda|jeans/i.test(product.categoryLabel))
    );
  }, [product]);

  const availableSizes = useMemo(() => {
    return isPantsOrShorts
      ? ['38', '40', '42', '44', '46']
      : ['P', 'M', 'G', 'GG', 'XG'];
  }, [isPantsOrShorts]);

  const normalizedColors = useMemo(() => {
    if (!product.colors || product.colors.length === 0) {
      return [{ name: product.colorName || 'Padrão', hex: '#18181b' }];
    }
    return product.colors.map((c, idx) => {
      if (typeof c === 'string') {
        return {
          name: idx === 0 && product.colorName ? product.colorName : `Variação ${idx + 1}`,
          hex: c,
        };
      }
      return c;
    });
  }, [product]);

  const [selectedSize, setSelectedSize] = useState(isPantsOrShorts ? '40' : 'G');
  const [selectedColor, setSelectedColor] = useState(normalizedColors[0]?.name || 'Padrão');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeView, setActiveView] = useState('front'); // 'front' | 'side'

  useEffect(() => {
    setSelectedSize(isPantsOrShorts ? '40' : 'G');
    setSelectedColor(normalizedColors[0]?.name || 'Padrão');
    setActiveView('front');
    setQuantity(1);
  }, [product, isPantsOrShorts, normalizedColors]);

  const handleAdd = () => {
    onAddToEdit({
      ...product,
      selectedSize,
      selectedColor,
      quantity,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const productNum = product.num || (product.id ? String(product.id) : '01');
  const productPrice = typeof product.price === 'number'
    ? product.price.toFixed(2).replace('.', ',')
    : product.price;

  const productDescription = product.description || product.desc || 'Peça autêntica Levant com caimento estruturado, costuras reforçadas e acabamento premium para máximo conforto e durabilidade.';
  const productMaterial = product.material || (isPantsOrShorts ? 'Denim & Sarja 100% Algodão Puro 13oz' : 'Algodão Penteado de Alta Densidade 380 GSM');
  const productFit = product.fit || 'Modelagem Ampla & Estruturada Levant';
  const productSignature = product.signature || 'Aviamentos Metálicos Foscos + Pesponto Duplo';

  const features = product.features || (isPantsOrShorts ? [
    { title: 'Costuras Reforçadas em Ponto Travete', desc: 'Travetamento duplo em pontos de maior tração, bolsos frontais e posteriores com reforço estrutural.' },
    { title: 'Denim & Sarja de Gramatura Alta', desc: 'Tecido encorpado 100% algodão que mantém a estrutura da silhueta mesmo com uso frequente.' },
    { title: 'Aviamentos Metálicos Foscos', desc: 'Botão de alta pressão e zíper YKK resistente à oxidação em acabamento fumê acetinado.' },
    { title: 'Bolsos Utilitários Profundos', desc: 'Forro reforçado que previne furos por chaveiros e celulares, com profundidade anatômica.' },
    { title: 'Caimento Amplo & Confortável', desc: 'Modelagem contemporânea pensada para liberdade de movimento com linhas arquitetônicas limpas.' },
    { title: 'Acabamento Interno em Viés', desc: 'Bainha interna limpa com costura debruada sem fiapos aparentes, garantindo durabilidade máxima.' },
  ] : [
    { title: 'Construção Estruturada Pesada', desc: 'Modelagem imponente com caimento firme que valoriza as linhas dos ombros e peitoral.' },
    { title: 'Tecido Selecionado de Alta Densidade', desc: 'Toque encorpado com retenção térmica equilibrada e toque suave na pele.' },
    { title: 'Fechamento & Aviamentos Premium', desc: 'Botões costurados com linha encerada de alta resistência mecânica.' },
    { title: 'Gola & Lapela de Formato Fixo', desc: 'Entretela especial que não quebra e mantém a apresentação impecável após uso contínuo.' },
    { title: 'Bolsos Embutidos Discretos', desc: 'Compartimentos discretos com costura reforçada e acabamento minimalista.' },
    { title: 'Durabilidade para Uso Diário', desc: 'Desenvolvido para resistir a lavagens preservando forma e cor original.' },
  ]);

  const hasShirtImages = !!product.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex flex-col items-center overflow-x-hidden"
    >
      {/* Botão de Retornar à Arara */}
      <div
        className="w-full flex items-center justify-between mb-4 pb-2 border-b transition-colors"
        style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}
      >
        <button
          onClick={onBack}
          className="group flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono uppercase tracking-widest transition-colors py-1 cursor-pointer hover:opacity-100"
          style={{ color: isDark ? '#9da3af' : '#71717a' }}
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          Voltar para a Loja / Arara
        </button>
        <span
          className="text-[10px] sm:text-xs font-mono font-semibold tracking-wider uppercase"
          style={{ color: isDark ? '#7a808c' : '#a1a1aa' }}
        >
          PEÇA N° {productNum}
        </span>
      </div>

      {/* SEÇÃO SUPERIOR: FOTO PRINCIPAL + PAINEL DE ESCOLHA */}
      <div className="w-full flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-14 items-start mb-10 sm:mb-14">
        {/* Coluna Esquerda: Imagem da Peça - Proporcional no mobile */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div
            className="relative w-full max-w-[420px] h-[340px] sm:h-[460px] md:h-[520px] rounded-xl sm:rounded-2xl flex items-center justify-center p-4 sm:p-6 border shadow-xs overflow-hidden transition-colors"
            style={{
              backgroundColor: isDark ? '#27292e' : '#f2f1ec',
              borderColor: isDark ? '#383b44' : '#e2dfd5',
            }}
          >
            <motion.div
              key={hasShirtImages ? activeView : 'placeholder-view'}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full flex items-center justify-center"
            >
              {hasShirtImages ? (
                <div className="w-full h-full max-h-[460px] flex items-center justify-center">
                  <GarmentGraphic product={product} isFront={activeView === 'front'} />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4 sm:p-6">
                  <ProductPlaceholder type={product.imageType} theme={theme} />
                </div>
              )}
            </motion.div>
          </div>

          {/* Miniaturas de Frente e Perfil Lateral (ou Vistas da Peça) */}
          <div className="flex gap-3 sm:gap-4 mt-3 sm:mt-5">
            <button
              onClick={() => setActiveView('front')}
              className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg border-2 transition-all p-1 flex flex-col items-center justify-center cursor-pointer shadow-2xs"
              style={{
                backgroundColor: isDark ? '#27292e' : '#f2f1ec',
                borderColor: activeView === 'front' ? (isDark ? '#f4f5f7' : '#18181b') : (isDark ? '#383b44' : '#e2dfd5'),
                opacity: activeView === 'front' ? 1 : 0.65,
              }}
            >
              <div className="w-full h-12 sm:h-16 pointer-events-none scale-75 origin-center flex items-center justify-center">
                {hasShirtImages ? (
                  <GarmentGraphic product={product} isFront={true} />
                ) : (
                  <ProductPlaceholder type={product.imageType} theme={theme} />
                )}
              </div>
              <span
                className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider mt-0.5 sm:mt-1 font-semibold"
                style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
              >
                Frente
              </span>
            </button>

            {hasShirtImages ? (
              <button
                onClick={() => setActiveView('side')}
                className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg border-2 transition-all p-1 flex flex-col items-center justify-center cursor-pointer shadow-2xs"
                style={{
                  backgroundColor: isDark ? '#27292e' : '#f2f1ec',
                  borderColor: activeView === 'side' ? (isDark ? '#f4f5f7' : '#18181b') : (isDark ? '#383b44' : '#e2dfd5'),
                  opacity: activeView === 'side' ? 1 : 0.65,
                }}
              >
                <div className="w-full h-12 sm:h-16 pointer-events-none scale-75 origin-center flex items-center justify-center">
                  <GarmentGraphic product={product} isFront={false} />
                </div>
                <span
                  className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider mt-0.5 sm:mt-1 font-semibold"
                  style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
                >
                  De Lado
                </span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView('detail')}
                className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg border-2 transition-all p-1 flex flex-col items-center justify-center cursor-pointer shadow-2xs"
                style={{
                  backgroundColor: isDark ? '#27292e' : '#f2f1ec',
                  borderColor: activeView === 'detail' ? (isDark ? '#f4f5f7' : '#18181b') : (isDark ? '#383b44' : '#e2dfd5'),
                  opacity: activeView === 'detail' ? 1 : 0.65,
                }}
              >
                <div className="w-full h-12 sm:h-16 pointer-events-none scale-90 origin-center flex items-center justify-center">
                  <span className="text-lg">🔍</span>
                </div>
                <span
                  className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider mt-0.5 sm:mt-1 font-semibold"
                  style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
                >
                  Detalhe
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Coluna Direita: Ficha do Produto e Ação de Compra */}
        <div className="w-full md:w-1/2 flex flex-col pt-1">
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-orange-500 uppercase mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Levant Streetwear · Peça N° {productNum}
          </span>

          <div
            className="flex items-baseline justify-between border-b pb-2 sm:pb-3 mb-2 sm:mb-3 transition-colors gap-2"
            style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}
          >
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight uppercase font-sans"
              style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
            >
              {product.name}
            </h1>
            <span
              className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight shrink-0"
              style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
            >
              R$ {productPrice}
            </span>
          </div>

          <p
            className="text-[11px] sm:text-xs font-mono tracking-wider mb-3 sm:mb-4 uppercase font-semibold"
            style={{ color: isDark ? '#9da3af' : '#71717a' }}
          >
            {product.categoryLabel || product.category}
          </p>

          <p
            className="text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6 font-normal"
            style={{ color: isDark ? '#b5bac3' : '#4b5563' }}
          >
            {productDescription}
          </p>

          {/* Seleção de Cor */}
          <div className="mb-4 sm:mb-5">
            <div
              className="flex items-center justify-between text-[11px] sm:text-xs font-mono uppercase tracking-wider mb-2"
              style={{ color: isDark ? '#9da3af' : '#71717a' }}
            >
              <span>Cor Selecionada</span>
              <span style={{ color: isDark ? '#f4f5f7' : '#18181b' }} className="font-bold">
                {selectedColor}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5">
              {normalizedColors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(c.name)}
                  title={c.name}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 transition-transform cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: c.hex,
                    borderColor: selectedColor === c.name ? (isDark ? '#f4f5f7' : '#18181b') : (isDark ? '#41454f' : '#d4d4d8'),
                    transform: selectedColor === c.name ? 'scale(1.12)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Seleção de Tamanho */}
          <div className="mb-5 sm:mb-6">
            <div
              className="flex items-center justify-between text-[11px] sm:text-xs font-mono uppercase tracking-wider mb-2"
              style={{ color: isDark ? '#9da3af' : '#71717a' }}
            >
              <span>Tamanho</span>
              <span style={{ color: isDark ? '#f4f5f7' : '#18181b' }} className="font-bold">
                Tamanho {selectedSize}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className="py-2 sm:py-2.5 text-xs font-mono uppercase tracking-widest transition-all rounded cursor-pointer border"
                  style={{
                    backgroundColor: selectedSize === size
                      ? (isDark ? '#f4f5f7' : '#18181b')
                      : (isDark ? '#27292e' : '#f4f3ed'),
                    color: selectedSize === size
                      ? (isDark ? '#18181b' : '#ffffff')
                      : (isDark ? '#9da3af' : '#52525b'),
                    borderColor: selectedSize === size
                      ? (isDark ? '#f4f5f7' : '#18181b')
                      : (isDark ? '#383b44' : '#e2dfd5'),
                    fontWeight: selectedSize === size ? 'bold' : 'normal',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantidade e Botão de Adicionar */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 mb-5 sm:mb-6">
            <div
              className="flex items-center border rounded px-2 sm:px-2.5 py-1.5 sm:py-2 transition-colors shrink-0"
              style={{
                backgroundColor: isDark ? '#27292e' : '#f8f8f6',
                borderColor: isDark ? '#383b44' : '#d4d4d8',
              }}
            >
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 cursor-pointer hover:opacity-75"
                style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span
                className="w-8 sm:w-9 text-center font-mono text-sm font-bold"
                style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1 cursor-pointer hover:opacity-75"
                style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="flex-1 py-3 px-3 sm:px-6 rounded text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-xs active:scale-[0.99] hover:opacity-90"
              style={{
                backgroundColor: isAdded
                  ? '#059669'
                  : isDark ? '#f4f5f7' : '#18181b',
                color: isAdded
                  ? '#ffffff'
                  : isDark ? '#18181b' : '#ffffff',
              }}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 shrink-0" /> Adicionado!
                </>
              ) : (
                'Adicionar à Sua Seleção'
              )}
            </button>
          </div>

          {/* Resumo Rápido de Materiais */}
          <div
            className="border-t pt-3 space-y-1.5 sm:space-y-2 text-xs font-mono transition-colors"
            style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}
          >
            <div
              className="flex justify-between py-1 border-b"
              style={{ borderColor: isDark ? '#2b2d33' : '#f4f4f5' }}
            >
              <span style={{ color: isDark ? '#808794' : '#a1a1aa' }} className="uppercase text-[11px]">Tecido</span>
              <span style={{ color: isDark ? '#f4f5f7' : '#18181b' }} className="text-right font-medium text-[11px] sm:text-xs">{productMaterial}</span>
            </div>
            <div
              className="flex justify-between py-1 border-b"
              style={{ borderColor: isDark ? '#2b2d33' : '#f4f4f5' }}
            >
              <span style={{ color: isDark ? '#808794' : '#a1a1aa' }} className="uppercase text-[11px]">Modelagem</span>
              <span style={{ color: isDark ? '#f4f5f7' : '#18181b' }} className="text-right font-medium text-[11px] sm:text-xs">{productFit}</span>
            </div>
            <div className="flex justify-between py-1">
              <span style={{ color: isDark ? '#808794' : '#a1a1aa' }} className="uppercase text-[11px]">Acabamento</span>
              <span style={{ color: isDark ? '#f4f5f7' : '#18181b' }} className="text-right font-medium text-[11px] sm:text-xs">{productSignature}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO DA IMAGEM 1: DETALHES DE CONSTRUÇÃO & QUALIDADE PREMIUM */}
      <div
        className="w-full border-t-2 pt-8 sm:pt-10 mt-2 sm:mt-4 flex flex-col items-center transition-colors"
        style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}
      >
        <div className="text-center max-w-2xl mb-6 sm:mb-8 px-2">
          <span className="text-[10px] sm:text-xs font-mono tracking-widest text-orange-500 uppercase font-bold">
            Padrão Construtivo Superior
          </span>
          <h2
            className="text-xl sm:text-3xl font-extrabold uppercase tracking-tight mt-1"
            style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
          >
            Detalhes de Construção & Tecido
          </h2>
          <p
            className="text-[10px] sm:text-xs font-mono mt-1.5 uppercase tracking-wider"
            style={{ color: isDark ? '#9da3af' : '#71717a' }}
          >
            Cada costura e acabamento projetados para resistência, durabilidade e caimento impecável
          </p>
        </div>

        {/* Layout com a Imagem Técnica Real (Imagem 1) + 6 Cards de Destaque */}
        <div
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border shadow-xs transition-colors"
          style={{
            backgroundColor: isDark ? '#26282e' : '#f7f6f2',
            borderColor: isDark ? '#363942' : '#e5e7eb',
          }}
        >
          {/* Lado Esquerdo: A Imagem Técnica Real Original Enviada */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div
              className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-sm border bg-white group"
              style={{ borderColor: isDark ? '#3b3f47' : '#d4d4d8' }}
            >
              <img
                src="/images/details/spec_details.png"
                alt="Detalhes técnicos: gola reforçada, reforço ombro a ombro, manga dupla, barra dupla, tecido suedine, caimento oversized"
                className="w-full h-auto object-contain"
              />
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-mono uppercase tracking-widest gap-1.5 pointer-events-none">
                <Maximize2 className="w-4 h-4" /> Especificações Levant
              </div>
            </div>
            <span
              className="text-[10px] sm:text-[11px] font-mono mt-2 uppercase tracking-wider text-center"
              style={{ color: isDark ? '#9da3af' : '#71717a' }}
            >
              Fotos macro dos acabamentos e costuras
            </span>
          </div>

          {/* Lado Direito: Grade dos 6 Pontos Técnicos com Tipografia Editorial */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            {features.map((feat, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 rounded-lg sm:rounded-xl border shadow-2xs transition-colors"
                style={{
                  backgroundColor: isDark ? '#2d3037' : '#ffffff',
                  borderColor: isDark ? '#3d414a' : '#e5e7eb',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-orange-500/15 text-orange-500 text-[10px] sm:text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                    0{index + 1}
                  </span>
                  <h3
                    className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider"
                    style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
                  >
                    {feat.title}
                  </h3>
                </div>
                <p
                  className="text-[11px] sm:text-xs leading-relaxed font-sans"
                  style={{ color: isDark ? '#b5bac3' : '#4b5563' }}
                >
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEÇÃO DE RECOMENDAÇÕES (IMAGEM 2) */}
      <Recommendations
        onAddToEdit={onAddToEdit}
        onSelectProduct={onSelectProduct}
        theme={theme}
      />
    </motion.div>
  );
}
