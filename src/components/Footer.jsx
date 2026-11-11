import React, { useState } from 'react';
import { Mail, Check, ShieldCheck, RefreshCw, Truck } from 'lucide-react';

export function Footer({ onOpenAdmin, theme = 'light', storeName, logoUrl, contactEmail, whatsappNumber }) {
  const isDark = theme === 'dark';
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer
      className="w-full border-t mt-16 transition-colors"
      style={{
        backgroundColor: isDark ? '#1b1d22' : '#f4f3ed',
        borderColor: isDark ? '#33363e' : '#e4e4e7',
        color: isDark ? '#b5bac3' : '#52525b',
      }}
    >
      {/* Vantagens / Benefícios da Loja */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 border-b transition-colors"
        style={{ borderColor: isDark ? '#2b2d35' : '#e5e3dc' }}
      >
        <div className="flex items-center gap-3.5">
          <Truck className="w-6 h-6 text-orange-500 shrink-0" />
          <div>
            <h4
              className="text-xs font-mono font-bold uppercase tracking-wider"
              style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
            >
              Envio Expresso para Todo Brasil
            </h4>
            <p className="text-xs font-sans mt-0.5 opacity-80">
              Frete grátis em compras acima de R$ 299.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <RefreshCw className="w-6 h-6 text-orange-500 shrink-0" />
          <div>
            <h4
              className="text-xs font-mono font-bold uppercase tracking-wider"
              style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
            >
              Primeira Troca Grátis
            </h4>
            <p className="text-xs font-sans mt-0.5 opacity-80">
              Até 30 dias para troca sem burocracia.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          <div>
            <h4
              className="text-xs font-mono font-bold uppercase tracking-wider"
              style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
            >
              Algodão 100% Certificado
            </h4>
            <p className="text-xs font-sans mt-0.5 opacity-80">
              Malha Suedine pesada de alta durabilidade.
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal do Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Bloco 1: Marca & Newsletter */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <div>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={storeName || "Logo"}
                className="h-7 sm:h-8 max-w-[180px] object-contain mb-3"
              />
            ) : (
              <span
                className="text-xl font-mono font-black tracking-tight uppercase block mb-3"
                style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
              >
                {(!storeName || storeName.toLowerCase() === 'clothes.on') ? (
                  <>clothes<span className="text-orange-500">.on</span></>
                ) : (
                  storeName
                )}
              </span>
            )}
            <p className="text-xs leading-relaxed max-w-sm font-sans mb-6 opacity-85">
              Marca autoral brasileira focada em silhuetas estruturadas, tecidos densos e estética minimalista contemporânea.
            </p>
          </div>

          {/* Newsletter */}
          <form onSubmit={handleSubscribe} className="max-w-sm">
            <span
              className="text-xs font-mono font-bold uppercase tracking-widest block mb-2"
              style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
            >
              Receba Avisos de Novos Drops
            </span>
            <div className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs font-mono rounded border transition-colors focus:outline-none"
                style={{
                  backgroundColor: isDark ? '#27292e' : '#ffffff',
                  borderColor: isDark ? '#3d4049' : '#d4d4d8',
                  color: isDark ? '#f4f5f7' : '#18181b',
                }}
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all cursor-pointer hover:opacity-90"
                style={{
                  backgroundColor: isDark ? '#f4f5f7' : '#18181b',
                  color: isDark ? '#18181b' : '#ffffff',
                }}
              >
                {subscribed ? <Check className="w-4 h-4 text-emerald-500" /> : 'Entrar'}
              </button>
            </div>
          </form>
        </div>

        {/* Bloco 2: Navegação */}
        <div className="md:col-span-3 space-y-2 text-xs font-mono">
          <span
            className="font-bold uppercase tracking-widest block mb-3"
            style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
          >
            Coleções
          </span>
          <p className="cursor-pointer hover:text-orange-500 transition-colors">Concrete Season N° 01</p>
          <p className="cursor-pointer hover:text-orange-500 transition-colors">Camisetas Oversized</p>
          <p className="cursor-pointer hover:text-orange-500 transition-colors">Calças & Alfaiataria</p>
          <p className="cursor-pointer hover:text-orange-500 transition-colors">Bermudas Utilitárias</p>
          <p className="cursor-pointer hover:text-orange-500 transition-colors">Casacos & Jaquetas</p>
        </div>

        {/* Bloco 3: Ajuda & Institucional */}
        <div className="md:col-span-4 space-y-2 text-xs font-mono">
          <span
            className="font-bold uppercase tracking-widest block mb-3"
            style={{ color: isDark ? '#f4f5f7' : '#18181b' }}
          >
            Atendimento & Informações
          </span>
          <p className="cursor-pointer hover:text-orange-500 transition-colors">Guia de Caimento e Tamanhos</p>
          <p className="cursor-pointer hover:text-orange-500 transition-colors">Política de Trocas e Devoluções</p>
          <p className="cursor-pointer hover:text-orange-500 transition-colors">Termos de Uso e Privacidade</p>
          <p className="cursor-pointer hover:text-orange-500 transition-colors">WhatsApp: {whatsappNumber || '(11) 99999-0000'}</p>
          <p className="cursor-pointer hover:text-orange-500 transition-colors">E-mail: {contactEmail || 'contato@clotheson.com.br'}</p>
        </div>
      </div>

      {/* Copyright e Assinatura */}
      <div
        className="border-t py-6 px-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono transition-colors max-w-6xl mx-auto gap-2"
        style={{ borderColor: isDark ? '#2b2d35' : '#e5e3dc', color: isDark ? '#7a808c' : '#a1a1aa' }}
      >
        <p>© 2026 {storeName || 'clothes.on'} · Todos os direitos reservados</p>
        <button
          onClick={onOpenAdmin}
          className="hover:text-orange-500 transition-colors cursor-pointer opacity-70 hover:opacity-100 flex items-center gap-1"
        >
          <span>⚙️ Área do Lojista</span>
        </button>
      </div>
    </footer>
  );
}

