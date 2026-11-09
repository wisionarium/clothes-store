import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, MessageCircle } from 'lucide-react';

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function NavigationMenu({ isOpen, onClose, onSelectCategory, theme = 'light' }) {
  const isDark = theme === 'dark';

  const categories = [
    { id: 'todos', label: 'Ver Todo o Catálogo', badge: 'Novo Drop' },
    { id: 'camisetas', label: 'Camisetas Oversized & Boxy', count: '07' },
    { id: 'calcas', label: 'Calças & Jeans', count: '03' },
    { id: 'bermudas', label: 'Bermudas & Shorts', count: '02' },
    { id: 'casacos', label: 'Casacos, Blazers & Jaquetas', count: '03' },
  ];

  const handleCategoryClick = (catId) => {
    onSelectCategory(catId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop escuro com blur que cobre a tela sem mudar a estrutura */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 cursor-pointer"
          />

          {/* Drawer Lateral que desliza da ESQUERDA para a DIREITA */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-sm sm:max-w-md z-50 shadow-2xl flex flex-col border-r transition-colors"
            style={{
              backgroundColor: isDark ? '#27292e' : '#ffffff',
              borderColor: isDark ? '#363942' : '#e4e4e7',
              color: isDark ? '#f4f5f7' : '#18181b',
            }}
          >
            {/* Topo do Menu: Logo + Botão Fechar */}
            <div
              className="p-6 border-b flex items-center justify-between transition-colors"
              style={{ borderColor: isDark ? '#363942' : '#e4e4e7' }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={isDark ? '/images/logo/logo_white.png' : '/images/logo/logo_black.png'}
                  alt="Levant"
                  className="h-6 w-auto object-contain"
                />
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

            {/* Conteúdo com Categorias e Navegação */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-between">
              <div>
                <span
                  className="text-[11px] font-mono tracking-widest uppercase font-bold block mb-4"
                  style={{ color: isDark ? '#808794' : '#a1a1aa' }}
                >
                  Navegue pela Coleção
                </span>

                <nav className="space-y-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className="w-full flex items-center justify-between py-3 px-3.5 rounded-lg text-left transition-all cursor-pointer group"
                      style={{
                        backgroundColor: isDark ? 'transparent' : 'transparent',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-sans font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                          {cat.label}
                        </span>
                        {cat.badge && (
                          <span className="text-[10px] font-mono bg-orange-600 text-white font-bold px-1.5 py-0.5 rounded uppercase">
                            {cat.badge}
                          </span>
                        )}
                      </div>

                      {cat.count && (
                        <span
                          className="text-xs font-mono"
                          style={{ color: isDark ? '#808794' : '#a1a1aa' }}
                        >
                          ({cat.count})
                        </span>
                      )}
                    </button>
                  ))}
                </nav>

                <div
                  className="border-t my-6 pt-6 space-y-3 transition-colors"
                  style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}
                >
                  <span
                    className="text-[11px] font-mono tracking-widest uppercase font-bold block mb-2"
                    style={{ color: isDark ? '#808794' : '#a1a1aa' }}
                  >
                    Universo Levant
                  </span>

                  <button
                    onClick={() => {
                      alert('Manifesto Levant: Minimalismo industrial, tecidos nobres com suedine pesado e modelagens modernas que duram uma vida inteira.');
                      onClose();
                    }}
                    className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider cursor-pointer hover:opacity-100 transition-opacity"
                    style={{ color: isDark ? '#b5bac3' : '#52525b' }}
                  >
                    <span>Manifesto & Tecidos Nobres</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  <button
                    onClick={() => {
                      alert('Guia de Medidas: Nossas peças possuem corte Boxy/Oversized com ombros caídos. Recomendamos escolher seu tamanho habitual para o caimento amplo clássico.');
                      onClose();
                    }}
                    className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider cursor-pointer hover:opacity-100 transition-opacity"
                    style={{ color: isDark ? '#b5bac3' : '#52525b' }}
                  >
                    <span>Guia de Medidas & Caimento</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                </div>
              </div>

              {/* Rodapé do Menu com Links de Suporte e Redes */}
              <div
                className="border-t pt-5 mt-6 transition-colors"
                style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-orange-500 transition-colors"
                    style={{ color: isDark ? '#b5bac3' : '#52525b' }}
                  >
                    <InstagramIcon className="w-4 h-4" />
                    <span>@levant.studio</span>
                  </a>

                  <a
                    href="https://whatsapp.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors"
                    style={{ color: isDark ? '#b5bac3' : '#52525b' }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp VIP</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
