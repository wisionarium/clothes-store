import React from 'react';
import { Menu, Sun, Moon, ShoppingBag, User } from 'lucide-react';

export function Header({ editCount = 0, onOpenEdit, onGoHome, onOpenMenu, onOpenAdmin, theme = 'light', onToggleTheme, storeName, logoUrl }) {
  const isDark = theme === 'dark';

  return (
    <header className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b transition-colors sticky top-0 z-40 backdrop-blur-md"
      style={{
        backgroundColor: 'var(--header-bg)',
        borderColor: 'var(--header-border)',
      }}
    >
      {/* Lado Esquerdo: Apenas o Menu */}
      <div className="flex items-center">
        <button
          onClick={onOpenMenu}
          className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono font-medium tracking-widest uppercase transition-colors cursor-pointer hover:opacity-75 py-1 px-1 -ml-1"
        >
          <Menu className="w-4 h-4" />
          <span>Menu</span>
        </button>
      </div>

      {/* Logo Central (Foto da Logo ou Texto Dinâmico White-Label) */}
      <div
        onClick={onGoHome}
        className="cursor-pointer flex items-center justify-center select-none group py-1"
        title={storeName || "clothes.on"}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={storeName || "Logo"}
            className="h-6 sm:h-8 max-w-[180px] sm:max-w-[220px] object-contain transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <span
            className="text-lg sm:text-2xl font-mono font-black tracking-tight uppercase transition-colors"
            style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
          >
            {(!storeName || storeName.toLowerCase() === 'clothes.on') ? (
              <>clothes<span className="text-orange-500">.on</span></>
            ) : (
              storeName
            )}
          </span>
        )}
      </div>

      {/* Canto Direito: Tema (Sol/Lua) + Carrinho de Compras + Ícone de Perfil */}
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Botão de Alternar Tema (Apenas o símbolo do Sol ou Lua) */}
        <button
          onClick={onToggleTheme}
          title={isDark ? "Alternar para tema Claro" : "Alternar para tema Cinza Escuro"}
          className="p-1.5 sm:p-2 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer hover:opacity-80"
          style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
        >
          {isDark ? (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-pulse stroke-[2]" />
          ) : (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700 stroke-[1.8]" />
          )}
        </button>

        {/* Ícone do Carrinho (ao lado do tema e à esquerda do perfil) */}
        <button
          onClick={onOpenEdit}
          title="Minha Sacola / Carrinho"
          className="relative p-1.5 sm:p-2 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer hover:opacity-80"
          style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
        >
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
          {editCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] px-1 text-[9px] sm:text-[10px] font-mono font-bold rounded-full flex items-center justify-center bg-orange-600 text-white shadow-xs">
              {editCount}
            </span>
          )}
        </button>

        {/* Ícone de Perfil / Acesso ADM no Canto Direito */}
        <button
          onClick={() => {
            if (onOpenAdmin) onOpenAdmin();
          }}
          title="Painel do Lojista (ADM) / Conta"
          className="p-1.5 sm:p-2 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer hover:opacity-80"
          style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
        >
          <User className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
        </button>
      </div>
    </header>
  );
}
