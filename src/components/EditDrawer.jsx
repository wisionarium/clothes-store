import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag } from 'lucide-react';

export function EditDrawer({ isOpen, onClose, items, onRemoveItem, onClear, theme = 'light' }) {
  const isDark = theme === 'dark';
  const totalPrice = items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

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
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50"
          />

          {/* Drawer Lateral */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md z-50 shadow-2xl flex flex-col transition-colors border-l"
            style={{
              backgroundColor: isDark ? '#27292e' : '#ffffff',
              borderColor: isDark ? '#363942' : '#e4e4e7',
              color: isDark ? '#f4f5f7' : '#18181b',
            }}
          >
            {/* Header da Gaveta */}
            <div
              className="p-6 border-b flex items-center justify-between transition-colors"
              style={{ borderColor: isDark ? '#363942' : '#e4e4e7' }}
            >
              <div>
                <h3
                  className="text-lg font-bold uppercase tracking-wider font-sans"
                  style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
                >
                  Sua Curadoria
                </h3>
                <p
                  className="text-xs font-mono uppercase"
                  style={{ color: isDark ? '#9da3af' : '#71717a' }}
                >
                  Peças Selecionadas ({items.length})
                </p>
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

            {/* Conteúdo dos Itens */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div
                  className="h-full flex flex-col items-center justify-center text-center py-12"
                  style={{ color: isDark ? '#808794' : '#a1a1aa' }}
                >
                  <ShoppingBag className="w-12 h-12 mb-3 stroke-1 opacity-50" />
                  <p
                    className="font-mono text-sm uppercase tracking-wider font-semibold"
                    style={{ color: isDark ? '#b5bac3' : '#52525b' }}
                  >
                    Sua curadoria está vazia
                  </p>
                  <p className="text-xs font-mono mt-1 max-w-[220px] opacity-75">
                    Navegue pela arara e desdobre as peças para adicionar à sua seleção.
                  </p>
                </div>
              ) : (
                items.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex gap-4 p-3.5 border rounded-lg items-center justify-between transition-colors"
                    style={{
                      backgroundColor: isDark ? '#2e3137' : '#faf9f5',
                      borderColor: isDark ? '#3b3f47' : '#e4e4e7',
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-orange-500 font-bold">
                          N° {item.num}
                        </span>
                        <h4
                          className="text-sm font-bold uppercase font-sans"
                          style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
                        >
                          {item.name}
                        </h4>
                      </div>
                      <p
                        className="text-xs font-mono mt-0.5"
                        style={{ color: isDark ? '#9da3af' : '#71717a' }}
                      >
                        Tam {item.selectedSize} · {item.selectedColor} · Qtd {item.quantity}
                      </p>
                      <p
                        className="text-xs font-mono font-bold mt-1"
                        style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
                      >
                        R$ {item.price * (item.quantity || 1)}
                      </p>
                    </div>

                    <button
                      onClick={() => onRemoveItem(index)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer com Resumo */}
            {items.length > 0 && (
              <div
                className="p-6 border-t space-y-3 transition-colors"
                style={{
                  backgroundColor: isDark ? '#23252a' : '#faf9f5',
                  borderColor: isDark ? '#363942' : '#e4e4e7',
                }}
              >
                <div
                  className="flex justify-between text-sm font-mono font-bold"
                  style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
                >
                  <span className="uppercase">Total Estimado</span>
                  <span>R$ {totalPrice}</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      items
                        .map((i) => `LEVANT N° ${i.num} ${i.name} [Tam ${i.selectedSize}, ${i.selectedColor}] - R$ ${i.price}`)
                        .join('\n')
                    );
                    alert('Lista copiada para a área de transferência!');
                  }}
                  className="w-full py-3 text-xs font-mono font-bold tracking-widest uppercase rounded transition-colors cursor-pointer hover:opacity-90"
                  style={{
                    backgroundColor: isDark ? '#f4f5f7' : '#18181b',
                    color: isDark ? '#18181b' : '#ffffff',
                  }}
                >
                  Copiar Lista Curada
                </button>
                <button
                  onClick={onClear}
                  className="w-full text-center text-xs font-mono uppercase py-1 cursor-pointer hover:underline opacity-60 hover:opacity-100"
                  style={{ color: isDark ? '#9da3af' : '#71717a' }}
                >
                  Limpar Seleção
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
