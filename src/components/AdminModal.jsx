import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Save, RotateCcw, Download, ShoppingBag, Sliders, Shield, Store, Check, ExternalLink } from 'lucide-react';
import { DEFAULT_CONFIG } from '../data/storeConfig';

export function AdminModal({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  shirts,
  onSaveShirts,
  catalog,
  onSaveCatalog,
  onResetDefaults,
  theme = 'dark',
}) {
  const isDark = theme === 'dark';

  // Autenticação simples por PIN
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Aba ativa: 'shirts' | 'catalog' | 'settings' | 'nuvemshop' | 'backup'
  const [activeTab, setActiveTab] = useState('shirts');

  // Estado local para edição
  const [localConfig, setLocalConfig] = useState(config);
  const [localShirts, setLocalShirts] = useState(shirts);
  const [localCatalog, setLocalCatalog] = useState(catalog);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sincroniza estado quando modal abre
  React.useEffect(() => {
    if (isOpen) {
      setLocalConfig(config);
      setLocalShirts(shirts);
      setLocalCatalog(catalog);
      setSavedSuccess(false);
    }
  }, [isOpen, config, shirts, catalog]);

  const handleLogin = (e) => {
    e.preventDefault();
    const correctPin = config?.adminPin || DEFAULT_CONFIG.adminPin;
    if (pinInput === correctPin) {
      setIsAuthenticated(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleSaveAll = () => {
    onSaveConfig(localConfig);
    onSaveShirts(localShirts);
    onSaveCatalog(localCatalog);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleShirtChange = (index, field, value) => {
    setLocalShirts((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleCatalogChange = (index, field, value) => {
    setLocalCatalog((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleExportBackup = () => {
    const backupData = {
      config: localConfig,
      shirts: localShirts,
      catalog: localCatalog,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `levant_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl rounded-2xl shadow-2xl border overflow-hidden my-auto z-10 transition-colors flex flex-col max-h-[88vh]"
          style={{
            backgroundColor: isDark ? '#1f2126' : '#ffffff',
            borderColor: isDark ? '#363942' : '#e4e4e7',
            color: isDark ? '#f4f5f7' : '#18181b',
          }}
        >
          {/* Header */}
          <div
            className="p-4 sm:p-6 border-b flex items-center justify-between shrink-0"
            style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-600/15 text-orange-500 flex items-center justify-center font-bold font-mono">
                ⚙️
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-orange-500 block">
                  Painel de Controle
                </span>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight font-sans uppercase">
                  Administração Levant
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <button
                  onClick={handleSaveAll}
                  className="px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Salvo!
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" /> Salvar Tudo
                    </>
                  )}
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:opacity-75 transition-colors cursor-pointer"
                style={{ backgroundColor: isDark ? '#2c2f36' : '#f4f4f5' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Se NÃO estiver autenticado: Tela de Login por PIN */}
          {!isAuthenticated ? (
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-sm mx-auto my-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-2">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold uppercase font-sans">Acesso ao Lojista</h3>
                <p className="text-xs font-mono opacity-70 mt-1">
                  Digite a senha/PIN mestre para acessar as configurações da loja.
                </p>
                <span className="text-[10px] font-mono text-orange-500 block mt-1">
                  (PIN padrão de fábrica: <strong>1234</strong>)
                </span>
              </div>

              <form onSubmit={handleLogin} className="w-full space-y-3 pt-2">
                <input
                  type="password"
                  maxLength={6}
                  placeholder="PIN (ex: 1234)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full text-center tracking-[0.4em] text-lg font-mono py-2.5 rounded-xl border outline-none focus:border-orange-500"
                  style={{
                    backgroundColor: isDark ? '#16171b' : '#f8f8f6',
                    borderColor: pinError ? '#ef4444' : isDark ? '#363942' : '#d4d4d8',
                    color: isDark ? '#ffffff' : '#000000',
                  }}
                  autoFocus
                />

                {pinError && (
                  <span className="text-[11px] font-mono text-red-500 block">
                    PIN incorreto. Tente 1234.
                  </span>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-widest bg-orange-600 hover:bg-orange-500 text-white transition-colors cursor-pointer"
                >
                  Entrar no Painel
                </button>
              </form>
            </div>
          ) : (
            /* CONTEÚDO AUTENTICADO: NAVEGAÇÃO POR ABAS */
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Barra Lateral de Abas */}
              <div
                className="w-full md:w-56 border-b md:border-b-0 md:border-r p-3 sm:p-4 flex md:flex-col gap-1.5 shrink-0 overflow-x-auto"
                style={{
                  backgroundColor: isDark ? '#191b20' : '#faf9f5',
                  borderColor: isDark ? '#33363e' : '#e4e4e7',
                }}
              >
                <button
                  onClick={() => setActiveTab('shirts')}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-left transition-all shrink-0 cursor-pointer"
                  style={{
                    backgroundColor: activeTab === 'shirts' ? (isDark ? '#2f3239' : '#ffffff') : 'transparent',
                    color: activeTab === 'shirts' ? '#f97316' : (isDark ? '#b5bac3' : '#52525b'),
                    fontWeight: activeTab === 'shirts' ? 'bold' : 'normal',
                  }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Arara (Camisas)</span>
                </button>

                <button
                  onClick={() => setActiveTab('catalog')}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-left transition-all shrink-0 cursor-pointer"
                  style={{
                    backgroundColor: activeTab === 'catalog' ? (isDark ? '#2f3239' : '#ffffff') : 'transparent',
                    color: activeTab === 'catalog' ? '#f97316' : (isDark ? '#b5bac3' : '#52525b'),
                    fontWeight: activeTab === 'catalog' ? 'bold' : 'normal',
                  }}
                >
                  <Sliders className="w-4 h-4" />
                  <span>Catálogo de Peças</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-left transition-all shrink-0 cursor-pointer"
                  style={{
                    backgroundColor: activeTab === 'settings' ? (isDark ? '#2f3239' : '#ffffff') : 'transparent',
                    color: activeTab === 'settings' ? '#f97316' : (isDark ? '#b5bac3' : '#52525b'),
                    fontWeight: activeTab === 'settings' ? 'bold' : 'normal',
                  }}
                >
                  <Store className="w-4 h-4" />
                  <span>Loja & Marquee</span>
                </button>

                <button
                  onClick={() => setActiveTab('nuvemshop')}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-left transition-all shrink-0 cursor-pointer"
                  style={{
                    backgroundColor: activeTab === 'nuvemshop' ? (isDark ? '#2f3239' : '#ffffff') : 'transparent',
                    color: activeTab === 'nuvemshop' ? '#f97316' : (isDark ? '#b5bac3' : '#52525b'),
                    fontWeight: activeTab === 'nuvemshop' ? 'bold' : 'normal',
                  }}
                >
                  <ExternalLink className="w-4 h-4 text-orange-500" />
                  <span>Nuvemshop ☁️</span>
                </button>

                <button
                  onClick={() => setActiveTab('backup')}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-left transition-all shrink-0 cursor-pointer"
                  style={{
                    backgroundColor: activeTab === 'backup' ? (isDark ? '#2f3239' : '#ffffff') : 'transparent',
                    color: activeTab === 'backup' ? '#f97316' : (isDark ? '#b5bac3' : '#52525b'),
                    fontWeight: activeTab === 'backup' ? 'bold' : 'normal',
                  }}
                >
                  <Shield className="w-4 h-4" />
                  <span>Backup & Reset</span>
                </button>
              </div>

              {/* Área de Conteúdo da Aba */}
              <div className="flex-1 p-5 sm:p-6 overflow-y-auto">
                {/* ABA 1: CAMISAS DA ARARA */}
                {activeTab === 'shirts' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}>
                      <div>
                        <h3 className="text-base font-bold uppercase font-sans">Camisas na Arara Metálica</h3>
                        <p className="text-xs font-mono opacity-70">
                          Edite os preços e nomes das camisetas exibidas na arara principal.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {localShirts.map((shirt, idx) => (
                        <div
                          key={shirt.id}
                          className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                          style={{
                            backgroundColor: isDark ? '#27292f' : '#f9f8f4',
                            borderColor: isDark ? '#363942' : '#e5e7eb',
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded bg-orange-600/20 text-orange-500 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                              {shirt.num}
                            </span>
                            <div className="min-w-0">
                              <input
                                type="text"
                                value={shirt.name}
                                onChange={(e) => handleShirtChange(idx, 'name', e.target.value)}
                                className="font-bold text-xs font-sans uppercase bg-transparent border-b border-dashed border-zinc-500 outline-none w-full max-w-[200px]"
                              />
                              <span className="text-[10px] font-mono opacity-60 block mt-0.5">
                                {shirt.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-mono opacity-70">R$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={shirt.price}
                                onChange={(e) => handleShirtChange(idx, 'price', parseFloat(e.target.value) || 0)}
                                className="w-20 px-2 py-1 text-xs font-mono font-bold rounded border outline-none text-right"
                                style={{
                                  backgroundColor: isDark ? '#18191d' : '#ffffff',
                                  borderColor: isDark ? '#363942' : '#d4d4d8',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ABA 2: CATÁLOGO COMPLETO */}
                {activeTab === 'catalog' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}>
                      <div>
                        <h3 className="text-base font-bold uppercase font-sans">Catálogo de Produtos (2x2)</h3>
                        <p className="text-xs font-mono opacity-70">
                          Calças, bermudas e casacos exibidos na vitrine abaixo da arara.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {localCatalog.map((prod, idx) => (
                        <div
                          key={prod.id}
                          className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                          style={{
                            backgroundColor: isDark ? '#27292f' : '#f9f8f4',
                            borderColor: isDark ? '#363942' : '#e5e7eb',
                          }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={prod.name}
                                onChange={(e) => handleCatalogChange(idx, 'name', e.target.value)}
                                className="font-bold text-xs font-sans uppercase bg-transparent border-b border-dashed border-zinc-500 outline-none w-full max-w-[260px]"
                              />
                              <input
                                type="text"
                                placeholder="Tag (ex: Novo)"
                                value={prod.tag || ''}
                                onChange={(e) => handleCatalogChange(idx, 'tag', e.target.value)}
                                className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border outline-none w-24"
                                style={{
                                  backgroundColor: isDark ? '#1a1c20' : '#ffffff',
                                  borderColor: isDark ? '#363942' : '#d4d4d8',
                                }}
                              />
                            </div>
                            <span className="text-[10px] font-mono opacity-60 block mt-0.5">
                              {prod.categoryLabel}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            <span className="text-xs font-mono opacity-70">R$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={prod.price}
                              onChange={(e) => handleCatalogChange(idx, 'price', parseFloat(e.target.value) || 0)}
                              className="w-20 px-2 py-1 text-xs font-mono font-bold rounded border outline-none text-right"
                              style={{
                                backgroundColor: isDark ? '#18191d' : '#ffffff',
                                borderColor: isDark ? '#363942' : '#d4d4d8',
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ABA 3: CONFIGURAÇÕES DA LOJA */}
                {activeTab === 'settings' && (
                  <div className="space-y-4">
                    <div className="border-b pb-3" style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}>
                      <h3 className="text-base font-bold uppercase font-sans">Configurações Gerais</h3>
                      <p className="text-xs font-mono opacity-70">
                        Ajuste textos dinâmicos, WhatsApp, PIX e valor de frete grátis.
                      </p>
                    </div>

                    <div className="space-y-4 text-xs font-sans">
                      <div>
                        <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                          Texto da Faixa Laranja Animada (Marquee da Arara)
                        </label>
                        <textarea
                          rows={2}
                          value={localConfig.marqueeText || ''}
                          onChange={(e) => setLocalConfig({ ...localConfig, marqueeText: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl text-xs font-mono border outline-none focus:border-orange-500"
                          style={{
                            backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                            borderColor: isDark ? '#363942' : '#d4d4d8',
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                            Frete Grátis a partir de (R$)
                          </label>
                          <input
                            type="number"
                            value={localConfig.freeShippingThreshold || 299}
                            onChange={(e) => setLocalConfig({ ...localConfig, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 rounded-xl text-xs font-mono border outline-none"
                            style={{
                              backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                              borderColor: isDark ? '#363942' : '#d4d4d8',
                            }}
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                            WhatsApp do Atendimento VIP
                          </label>
                          <input
                            type="text"
                            placeholder="5511999999999"
                            value={localConfig.whatsappNumber || ''}
                            onChange={(e) => setLocalConfig({ ...localConfig, whatsappNumber: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl text-xs font-mono border outline-none"
                            style={{
                              backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                              borderColor: isDark ? '#363942' : '#d4d4d8',
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                            Chave PIX da Loja
                          </label>
                          <input
                            type="text"
                            placeholder="pix@levant.com.br"
                            value={localConfig.pixKey || ''}
                            onChange={(e) => setLocalConfig({ ...localConfig, pixKey: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl text-xs font-mono border outline-none"
                            style={{
                              backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                              borderColor: isDark ? '#363942' : '#d4d4d8',
                            }}
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                            Alterar Senha/PIN de Acesso ADM
                          </label>
                          <input
                            type="text"
                            value={localConfig.adminPin || '1234'}
                            onChange={(e) => setLocalConfig({ ...localConfig, adminPin: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl text-xs font-mono border outline-none"
                            style={{
                              backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                              borderColor: isDark ? '#363942' : '#d4d4d8',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ABA 4: CONEXÃO NUVEMSHOP */}
                {activeTab === 'nuvemshop' && (
                  <div className="space-y-4">
                    <div className="border-b pb-3" style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">☁️</span>
                        <h3 className="text-base font-bold uppercase font-sans">Conexão Nuvemshop</h3>
                      </div>
                      <p className="text-xs font-mono opacity-70 mt-1">
                        Configure a ponte para que o estoque, pagamentos e etiquetas de envio rodem direto na Nuvemshop do seu cliente.
                      </p>
                    </div>

                    {/* Banner explicativo */}
                    <div
                      className="p-4 rounded-xl border space-y-2"
                      style={{
                        backgroundColor: isDark ? '#1e2430' : '#f0f5ff',
                        borderColor: '#3b82f6',
                      }}
                    >
                      <span className="text-[10px] font-mono uppercase font-bold text-blue-500 block">
                        Como funciona essa integração
                      </span>
                      <p className="text-xs font-sans leading-relaxed opacity-85">
                        A Levant funciona como a vitrine exclusiva de alta performance. Ao colocar a URL da loja Nuvemshop aqui, o botão de checkout pode redirecionar automaticamente com o carrinho pré-montado na Nuvemshop, onde o frete com desconto e a etiqueta do <strong>Nuvem Envio / Melhor Envio</strong> já são emitidos instantaneamente!
                      </p>
                    </div>

                    <div className="space-y-4 text-xs font-sans">
                      <div>
                        <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                          URL da Loja Nuvemshop do Cliente
                        </label>
                        <input
                          type="text"
                          placeholder="ex: https://minhaloja.lojavirtualnuvem.com.br"
                          value={localConfig.nuvemshop?.storeUrl || ''}
                          onChange={(e) =>
                            setLocalConfig({
                              ...localConfig,
                              nuvemshop: { ...localConfig.nuvemshop, storeUrl: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl text-xs font-mono border outline-none"
                          style={{
                            backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                            borderColor: isDark ? '#363942' : '#d4d4d8',
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                            Store ID (Opcional - API)
                          </label>
                          <input
                            type="text"
                            placeholder="ID da loja Nuvemshop"
                            value={localConfig.nuvemshop?.storeId || ''}
                            onChange={(e) =>
                              setLocalConfig({
                                ...localConfig,
                                nuvemshop: { ...localConfig.nuvemshop, storeId: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl text-xs font-mono border outline-none"
                            style={{
                              backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                              borderColor: isDark ? '#363942' : '#d4d4d8',
                            }}
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                            Access Token da API (Opcional)
                          </label>
                          <input
                            type="password"
                            placeholder="Token de autorização"
                            value={localConfig.nuvemshop?.accessToken || ''}
                            onChange={(e) =>
                              setLocalConfig({
                                ...localConfig,
                                nuvemshop: { ...localConfig.nuvemshop, accessToken: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl text-xs font-mono border outline-none"
                            style={{
                              backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                              borderColor: isDark ? '#363942' : '#d4d4d8',
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                          Comportamento do Botão de Finalizar Compra
                        </label>
                        <select
                          value={localConfig.nuvemshop?.checkoutMode || 'built_in'}
                          onChange={(e) =>
                            setLocalConfig({
                              ...localConfig,
                              nuvemshop: { ...localConfig.nuvemshop, checkoutMode: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl text-xs font-mono border outline-none"
                          style={{
                            backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                            borderColor: isDark ? '#363942' : '#d4d4d8',
                          }}
                        >
                          <option value="built_in">Checkout Próprio Levant (PIX instantâneo + WhatsApp)</option>
                          <option value="redirect_cart">Redirecionar direto para o Checkout da Nuvemshop</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* ABA 5: BACKUP & RESET */}
                {activeTab === 'backup' && (
                  <div className="space-y-5">
                    <div className="border-b pb-3" style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}>
                      <h3 className="text-base font-bold uppercase font-sans">Backup & Sincronização</h3>
                      <p className="text-xs font-mono opacity-70">
                        Como não estamos usando banco de dados agora, você pode exportar um arquivo JSON com todas as configurações.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        className="p-5 rounded-2xl border space-y-3"
                        style={{
                          backgroundColor: isDark ? '#27292f' : '#f9f8f4',
                          borderColor: isDark ? '#363942' : '#e4e4e7',
                        }}
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                          <Download className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-bold uppercase font-sans">Exportar Configurações</h4>
                        <p className="text-xs font-mono opacity-70 leading-relaxed">
                          Baixe um arquivo <code>.json</code> completo contendo preços alterados, configurações e chaves salvas.
                        </p>
                        <button
                          onClick={handleExportBackup}
                          className="w-full py-2.5 rounded-xl text-xs font-mono font-bold uppercase bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                        >
                          Baixar Arquivo JSON
                        </button>
                      </div>

                      <div
                        className="p-5 rounded-2xl border space-y-3"
                        style={{
                          backgroundColor: isDark ? '#27292f' : '#f9f8f4',
                          borderColor: isDark ? '#363942' : '#e4e4e7',
                        }}
                      >
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                          <RotateCcw className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-bold uppercase font-sans">Restaurar Padrões</h4>
                        <p className="text-xs font-mono opacity-70 leading-relaxed">
                          Apaga as alterações do navegador e restaura todas as camisas e produtos para o valor original.
                        </p>
                        <button
                          onClick={() => {
                            if (confirm('Tem certeza que deseja restaurar as configurações originais de fábrica?')) {
                              onResetDefaults();
                              onClose();
                            }
                          }}
                          className="w-full py-2.5 rounded-xl text-xs font-mono font-bold uppercase border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          Restaurar Original
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
