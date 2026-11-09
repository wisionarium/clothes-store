import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export function EditorialBanner({ theme = 'light' }) {
  const isDark = theme === 'dark';

  return (
    <section className="w-full max-w-6xl mx-auto px-3 sm:px-6 my-8 sm:my-12 overflow-x-hidden">
      <div
        className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden border shadow-xs transition-colors group"
        style={{
          backgroundColor: isDark ? '#23252a' : '#f0eee6',
          borderColor: isDark ? '#363942' : '#e4e4e7',
        }}
      >
        {/* Imagem do Banner Editorial */}
        <div className="w-full aspect-16/9 sm:aspect-21/9 md:aspect-24/9 max-h-[380px] overflow-hidden flex items-center justify-center bg-black/5">
          <img
            src="/images/banner/editorial_banner.png"
            alt="Levant Concrete Season Editorial Campaign"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Faixa inferior de apoio editorial com chamada sutil */}
        <div
          className="p-3.5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-t transition-colors"
          style={{
            backgroundColor: isDark ? '#27292e' : '#faf9f5',
            borderColor: isDark ? '#363942' : '#e4e4e7',
          }}
        >
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-orange-500 block mb-0.5">
              Campanha Editorial · Concrete Season
            </span>
            <h3
              className="text-sm sm:text-lg font-extrabold uppercase tracking-tight font-sans"
              style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
            >
              Silhuetas Livres, Caimento Pesado e Sem Ruído
            </h3>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('catalog-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: isDark ? '#f4f5f7' : '#18181b',
              color: isDark ? '#18181b' : '#ffffff',
            }}
          >
            <span>Explorar Drop</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
