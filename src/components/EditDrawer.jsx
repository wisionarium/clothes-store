import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Plus, Minus, Truck, ArrowRight, Check } from 'lucide-react';
import { ProductPlaceholder } from './ProductPlaceholder';

export function EditDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClear,
  onOpenCheckout,
  storeConfig,
  theme = 'dark',
}) {
  const isDark = theme === 'dark';

  // Simulador de Frete
  const [cep, setCep] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState('pac'); // 'pac' | 'sedex' | 'free'

  const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
  const freeShippingThreshold = storeConfig?.freeShippingThreshold || 299;
  const isFreeShipping = subtotal >= freeShippingThreshold;

  // Cálculo de valor do frete
  const pacPrice = isFreeShipping ? 0 : (storeConfig?.defaultPacPrice || 19.90);
  const sedexPrice = isFreeShipping ? 0 : (storeConfig?.defaultSedexPrice || 32.90);
  const currentShippingPrice = shippingInfo ? (selectedShipping === 'sedex' ? sedexPrice : pacPrice) : 0;
  const totalPrice = subtotal + currentShippingPrice;

  const handleCalculateCep = async (e) => {
    e.preventDefault();
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      alert('Por favor, digite um CEP válido com 8 dígitos.');
      return;
    }

    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      if (data.erro) {
        alert('CEP não encontrado. Verifique e tente novamente.');
      } else {
        setShippingInfo(data);
      }
    } catch {
      alert('Não foi possível consultar o CEP no momento.');
    } finally {
      setLoadingCep(false);
    }
  };

  // Processo de Checkout (Nuvemshop ou Nativo)
  const handleProceedCheckout = () => {
    const isNuvemRedirect =
      storeConfig?.nuvemshop?.enabled &&
      storeConfig?.nuvemshop?.checkoutMode === 'redirect_cart' &&
      storeConfig?.nuvemshop?.storeUrl;

    if (isNuvemRedirect) {
      const cleanStoreUrl = storeConfig.nuvemshop.storeUrl.startsWith('http')
        ? storeConfig.nuvemshop.storeUrl.replace(/\/$/, '')
        : `https://${storeConfig.nuvemshop.storeUrl.replace(/\/$/, '')}`;

      const cartItemsParam = items
        .map((i) => {
          const variantId = i.variants?.[0]?.id || i.nuvemshopId || i.id;
          return `${variantId}:${i.quantity || 1}`;
        })
        .join(',');

      const directCartUrl = cartItemsParam ? `${cleanStoreUrl}/cart/add/${cartItemsParam}` : cleanStoreUrl;
      window.open(directCartUrl, '_blank');
      return;
    }

    onClose();
    onOpenCheckout({
      subtotal,
      shippingValue: currentShippingPrice,
      shippingMethod: selectedShipping,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop com blur suave */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 cursor-pointer"
          />

          {/* Drawer Lateral */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md z-50 shadow-2xl flex flex-col transition-colors border-l"
            style={{
              backgroundColor: isDark ? '#23252a' : '#ffffff',
              borderColor: isDark ? '#363942' : '#e4e4e7',
              color: isDark ? '#f4f5f7' : '#18181b',
            }}
          >
            {/* Header da Gaveta */}
            <div
              className="p-5 sm:p-6 border-b flex items-center justify-between transition-colors shrink-0"
              style={{ borderColor: isDark ? '#363942' : '#e4e4e7' }}
            >
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-orange-500 block">
                  Sacola de Compras
                </span>
                <h3
                  className="text-lg font-bold uppercase tracking-wider font-sans"
                  style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
                >
                  Sua Seleção ({items.reduce((acc, i) => acc + (i.quantity || 1), 0)})
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-colors cursor-pointer hover:opacity-75"
                style={{
                  backgroundColor: isDark ? '#33363e' : '#f4f4f5',
                  color: isDark ? '#f4f5f7' : '#18181b',
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Barra de Progresso do Frete Grátis */}
            {items.length > 0 && (
              <div
                className="px-5 py-2.5 border-b text-[11px] font-mono flex items-center justify-between"
                style={{
                  backgroundColor: isDark ? '#1d1f24' : '#faf9f5',
                  borderColor: isDark ? '#33363e' : '#e4e4e7',
                }}
              >
                {isFreeShipping ? (
                  <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Parabéns! Você ganhou Frete Grátis!
                  </span>
                ) : (
                  <span>
                    Faltam <strong className="text-orange-500">R$ {(freeShippingThreshold - subtotal).toFixed(2).replace('.', ',')}</strong> para <strong>Frete Grátis</strong>
                  </span>
                )}
              </div>
            )}

            {/* Conteúdo dos Itens */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {items.length === 0 ? (
                <div
                  className="h-full flex flex-col items-center justify-center text-center py-12"
                  style={{ color: isDark ? '#808794' : '#a1a1aa' }}
                >
                  <ShoppingBag className="w-12 h-12 mb-3 stroke-1 opacity-50 text-orange-500" />
                  <p
                    className="font-mono text-sm uppercase tracking-wider font-semibold"
                    style={{ color: isDark ? '#b5bac3' : '#52525b' }}
                  >
                    Sua sacola está vazia
                  </p>
                  <p className="text-xs font-mono mt-1 max-w-[220px] opacity-75">
                    Navegue pela arara ou pelo catálogo abaixo para adicionar peças.
                  </p>
                </div>
              ) : (
                items.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex gap-3 p-3 border rounded-xl items-center justify-between transition-colors shadow-2xs"
                    style={{
                      backgroundColor: isDark ? '#2a2d33' : '#faf9f5',
                      borderColor: isDark ? '#3b3f47' : '#e4e4e7',
                    }}
                  >
                    {/* Miniatura do Produto */}
                    <div
                      className="w-14 h-16 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border p-1"
                      style={{
                        backgroundColor: isDark ? '#1e2025' : '#f2f1ec',
                        borderColor: isDark ? '#363942' : '#e2dfd5',
                      }}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ProductPlaceholder type={item.imageType} theme={theme} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className="text-xs font-bold uppercase font-sans line-clamp-1"
                        style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
                      >
                        {item.name}
                      </h4>
                      <p
                        className="text-[10px] font-mono mt-0.5 line-clamp-1"
                        style={{ color: isDark ? '#9da3af' : '#71717a' }}
                      >
                        Tam {item.selectedSize} · {item.selectedColor}
                      </p>
                      <p
                        className="text-xs font-mono font-bold mt-1 text-orange-500"
                      >
                        R$ {(item.price * (item.quantity || 1)).toFixed(2).replace('.', ',')}
                      </p>
                    </div>

                    {/* Controle de Quantidade */}
                    <div className="flex items-center gap-1">
                      <div
                        className="flex items-center border rounded-lg px-1.5 py-0.5"
                        style={{
                          backgroundColor: isDark ? '#1f2126' : '#ffffff',
                          borderColor: isDark ? '#3d4049' : '#d4d4d8',
                        }}
                      >
                        <button
                          onClick={() => onUpdateQuantity(index, Math.max(1, (item.quantity || 1) - 1))}
                          className="p-1 hover:opacity-75 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-mono text-xs font-bold">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(index, (item.quantity || 1) + 1)}
                          className="p-1 hover:opacity-75 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(index)}
                        title="Remover peça"
                        className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* SIMULADOR DE CEP / FRETE */}
              {items.length > 0 && (
                <div
                  className="p-3.5 rounded-xl border space-y-2.5 mt-4"
                  style={{
                    backgroundColor: isDark ? '#1e2025' : '#f8f8f6',
                    borderColor: isDark ? '#363942' : '#e4e4e7',
                  }}
                >
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase">
                    <Truck className="w-4 h-4 text-orange-500" />
                    <span>Calcular Frete & Prazo</span>
                  </div>

                  <form onSubmit={handleCalculateCep} className="flex gap-2">
                    <input
                      type="text"
                      maxLength={9}
                      placeholder="00000-000"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg text-xs font-mono border outline-none"
                      style={{
                        backgroundColor: isDark ? '#151619' : '#ffffff',
                        borderColor: isDark ? '#363942' : '#d4d4d8',
                        color: isDark ? '#ffffff' : '#000000',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={loadingCep}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase bg-orange-600 hover:bg-orange-500 text-white transition-colors cursor-pointer"
                    >
                      {loadingCep ? '...' : 'Calcular'}
                    </button>
                  </form>

                  {shippingInfo && (
                    <div className="space-y-1.5 pt-1 text-xs font-mono">
                      <span className="text-[10px] text-zinc-400 block">
                        Destino: {shippingInfo.localidade} - {shippingInfo.uf} ({shippingInfo.bairro})
                      </span>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedShipping('pac')}
                          className="p-2 rounded-lg border text-left cursor-pointer transition-all"
                          style={{
                            backgroundColor: selectedShipping === 'pac' ? (isDark ? '#2e3137' : '#ffffff') : 'transparent',
                            borderColor: selectedShipping === 'pac' ? '#f97316' : (isDark ? '#363942' : '#d4d4d8'),
                          }}
                        >
                          <span className="font-bold block text-[11px]">PAC</span>
                          <span className="text-[10px] opacity-70 block">5 a 8 dias úteis</span>
                          <span className="text-xs font-bold text-orange-500 mt-0.5 block">
                            {isFreeShipping ? 'GRÁTIS' : `R$ ${pacPrice.toFixed(2).replace('.', ',')}`}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedShipping('sedex')}
                          className="p-2 rounded-lg border text-left cursor-pointer transition-all"
                          style={{
                            backgroundColor: selectedShipping === 'sedex' ? (isDark ? '#2e3137' : '#ffffff') : 'transparent',
                            borderColor: selectedShipping === 'sedex' ? '#f97316' : (isDark ? '#363942' : '#d4d4d8'),
                          }}
                        >
                          <span className="font-bold block text-[11px]">SEDEX</span>
                          <span className="text-[10px] opacity-70 block">1 a 3 dias úteis</span>
                          <span className="text-xs font-bold text-orange-500 mt-0.5 block">
                            {isFreeShipping ? 'GRÁTIS' : `R$ ${sedexPrice.toFixed(2).replace('.', ',')}`}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer com Resumo & Finalizar Compra */}
            {items.length > 0 && (
              <div
                className="p-4 sm:p-6 border-t space-y-3 transition-colors shrink-0"
                style={{
                  backgroundColor: isDark ? '#1e2025' : '#faf9f5',
                  borderColor: isDark ? '#363942' : '#e4e4e7',
                }}
              >
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between opacity-70">
                    <span>Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>

                  <div className="flex justify-between opacity-70">
                    <span>Frete:</span>
                    <span className={currentShippingPrice === 0 ? 'text-emerald-500 font-bold' : ''}>
                      {currentShippingPrice === 0 ? 'Grátis' : `R$ ${currentShippingPrice.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>

                  <div
                    className="flex justify-between text-base font-mono font-bold pt-1.5 border-t"
                    style={{
                      borderColor: isDark ? '#2f3239' : '#e4e4e7',
                      color: isDark ? '#f4f5f7' : '#18181b',
                    }}
                  >
                    <span className="uppercase">Total Final</span>
                    <span className="text-orange-500">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedCheckout}
                  className="w-full py-3.5 text-xs font-mono font-bold tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md bg-orange-600 hover:bg-orange-500 text-white active:scale-95"
                >
                  <span>
                    {storeConfig?.nuvemshop?.enabled && storeConfig?.nuvemshop?.checkoutMode === 'redirect_cart'
                      ? 'Finalizar Compra na Nuvemshop'
                      : 'Finalizar Compra'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onClear}
                  className="w-full text-center text-xs font-mono uppercase py-0.5 cursor-pointer hover:underline opacity-50 hover:opacity-100"
                  style={{ color: isDark ? '#9da3af' : '#71717a' }}
                >
                  Limpar Sacola
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
