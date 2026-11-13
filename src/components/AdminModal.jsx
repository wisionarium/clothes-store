import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Save, RotateCcw, Download, ShoppingBag, Sliders, Shield, Store, Check, ExternalLink, RefreshCw, CheckCircle2, AlertCircle, Upload, Image as ImageIcon, Trash2, Plus, Sparkles, Palette, Layers, Sun, Moon } from 'lucide-react';
import { DEFAULT_CONFIG } from '../data/storeConfig';
import { CATALOG_PRODUCTS } from '../data/catalog';
import { DARK_PALETTES, LIGHT_PALETTES } from '../data/themePalettes';

export function AdminModal({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  shirts,
  onSaveShirts,
  catalog,
  onSaveCatalog,
  looks = [],
  onSaveLooks,
  onResetDefaults,
  theme = 'dark',
}) {
  const isDark = theme === 'dark';

  // Autenticação simples por PIN
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Aba ativa: 'shirts' | 'catalog' | 'looks' | 'settings' | 'nuvemshop' | 'backup'
  const [activeTab, setActiveTab] = useState('settings');

  // Estado local para edição
  const [localConfig, setLocalConfig] = useState(config);
  const [localShirts, setLocalShirts] = useState(shirts);
  const [localCatalog, setLocalCatalog] = useState(catalog);
  const [localLooks, setLocalLooks] = useState(looks);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Estados de Conexão e Sincronização Nuvemshop
  const [isTestingNuvem, setIsTestingNuvem] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success: boolean, message: string }
  const [isSyncingNuvem, setIsSyncingNuvem] = useState(false);
  const [syncResult, setSyncResult] = useState(null); // { success: boolean, message: string, count?: number }

  // Sincroniza estado quando modal abre
  React.useEffect(() => {
    if (isOpen) {
      setLocalConfig(config);
      setLocalShirts(shirts);
      setLocalCatalog(catalog);
      setLocalLooks(looks);
      setSavedSuccess(false);
      setTestResult(null);
      setSyncResult(null);
    }
  }, [isOpen, config, shirts, catalog, looks]);

  // Testar conexão oficial com Nuvemshop
  const handleTestNuvemshop = async () => {
    const storeId = localConfig.nuvemshop?.storeId?.trim();
    const token = localConfig.nuvemshop?.accessToken?.trim();

    if (!storeId || !token) {
      setTestResult({
        success: false,
        message: 'Por favor, preencha o Store ID e o Access Token da Nuvemshop antes de testar.',
      });
      return;
    }

    setIsTestingNuvem(true);
    setTestResult(null);

    try {
      const res = await fetch(`/api/nuvemshop?action=test_connection&storeId=${encodeURIComponent(storeId)}&token=${encodeURIComponent(token)}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: 'Conexão estabelecida com sucesso! Loja Nuvemshop autenticada e pronta.',
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Credenciais inválidas. Verifique o Store ID e o Token da Nuvemshop.',
        });
      }
    } catch {
      setTestResult({
        success: false,
        message: 'Não foi possível contatar o serviço de conexão. Verifique sua conexão com a internet.',
      });
    } finally {
      setIsTestingNuvem(false);
    }
  };

  // Sincronizar todos os produtos da Nuvemshop para a vitrine
  const handleSyncNuvemshop = async () => {
    const storeId = localConfig.nuvemshop?.storeId?.trim();
    const token = localConfig.nuvemshop?.accessToken?.trim();

    if (!storeId || !token) {
      setSyncResult({
        success: false,
        message: 'Preencha o Store ID e o Access Token para buscar os produtos da sua Nuvemshop.',
      });
      return;
    }

    setIsSyncingNuvem(true);
    setSyncResult(null);

    try {
      const res = await fetch(`/api/nuvemshop?action=get_products&storeId=${encodeURIComponent(storeId)}&token=${encodeURIComponent(token)}`);
      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.products)) {
        if (data.products.length === 0) {
          setSyncResult({
            success: true,
            message: 'Conexão realizada, mas nenhum produto foi encontrado na sua conta Nuvemshop. Cadastre peças lá para exibi-las aqui!',
            count: 0,
          });
        } else {
          // Atualiza o catálogo local com os produtos reais da Nuvemshop
          setLocalCatalog(data.products);
          
          // Ativa a Nuvemshop e sincroniza a logo e nome da loja automaticamente
          const updatedConfig = {
            ...localConfig,
            nuvemshop: {
              ...localConfig.nuvemshop,
              enabled: true,
            },
            logoUrl: data.storeLogo || localConfig.logoUrl || '',
            storeName: data.storeName || localConfig.storeName || 'clothes.on',
          };
          setLocalConfig(updatedConfig);

          // Salva imediatamente
          onSaveCatalog(data.products);
          onSaveConfig(updatedConfig);

          setSyncResult({
            success: true,
            message: `${data.products.length} peças e acessórios importados com sucesso! ${data.storeLogo ? 'A logo oficial da sua loja Nuvemshop também foi importada automaticamente.' : ''}`,
            count: data.products.length,
          });
        }
      } else {
        setSyncResult({
          success: false,
          message: data.error || 'Erro ao importar produtos da Nuvemshop.',
        });
      }
    } catch {
      setSyncResult({
        success: false,
        message: 'Falha de comunicação com o servidor ao importar produtos.',
      });
    } finally {
      setIsSyncingNuvem(false);
    }
  };

  // Desconectar Nuvemshop e restaurar catálogo padrão para deixar limpo para o cliente
  const handleDisconnectNuvemshop = () => {
    if (
      window.confirm(
        'Tem certeza que deseja desconectar a Nuvemshop e apagar os dados de teste? Isso vai limpar o Store ID, Access Token e restaurar os produtos padrão da vitrine para deixar o sistema pronto e limpo para o seu cliente.'
      )
    ) {
      const resetConfig = {
        ...localConfig,
        nuvemshop: {
          enabled: false,
          storeUrl: '',
          storeId: '',
          accessToken: '',
          checkoutMode: 'redirect_cart',
        },
      };
      setLocalConfig(resetConfig);
      setLocalCatalog(CATALOG_PRODUCTS);
      onSaveConfig(resetConfig);
      onSaveCatalog(CATALOG_PRODUCTS);
      setSyncResult({
        success: true,
        message: 'Loja Nuvemshop desconectada com sucesso! Credenciais e produtos de teste foram apagados.',
      });
      setTestResult(null);
    }
  };

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
    if (onSaveLooks) onSaveLooks(localLooks);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLookChange = (index, field, value) => {
    setLocalLooks((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleToggleProductInLook = (lookIndex, productId) => {
    setLocalLooks((prev) => {
      const copy = [...prev];
      const currentIds = copy[lookIndex].productIds || [];
      if (currentIds.includes(productId)) {
        copy[lookIndex] = {
          ...copy[lookIndex],
          productIds: currentIds.filter((id) => id !== productId),
        };
      } else {
        copy[lookIndex] = {
          ...copy[lookIndex],
          productIds: [...currentIds, productId],
        };
      }
      return copy;
    });
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

  // Compressor e otimizador de imagens para garantir carregamento ultrarrápido
  const compressImage = (file, maxWidth = 1000, quality = 0.85) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          resolve(canvas.toDataURL(mimeType, quality));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleCatalogFileUpload = async (index, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem é muito pesada (máximo 10MB). Escolha uma foto menor ou use um link de URL.');
      return;
    }

    const compressed = await compressImage(file, 1000, 0.85);
    if (compressed) {
      handleCatalogChange(index, 'image', compressed);
    }
  };

  const handleShirtFileUpload = async (index, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem é muito pesada (máximo 10MB). Escolha uma foto menor ou use um link de URL.');
      return;
    }

    const compressed = await compressImage(file, 1000, 0.85);
    if (compressed) {
      handleShirtChange(index, 'image', compressed);
    }
  };

  const handleLogoFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('A logo é muito pesada (máximo 10MB). Escolha uma imagem menor.');
      return;
    }

    const compressed = await compressImage(file, 800, 0.9);
    if (compressed) {
      setLocalConfig((prev) => ({ ...prev, logoUrl: compressed }));
    }
  };

  const handleLookPhotoUpload = async (index, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('A foto do modelo é muito pesada (máximo 10MB). Escolha uma foto menor.');
      return;
    }

    const compressed = await compressImage(file, 1000, 0.88);
    if (compressed) {
      handleLookChange(index, 'modelImage', compressed);
    }
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
    const cleanBrand = (localConfig.storeName || 'clothes_on').toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.download = `${cleanBrand}_backup_${new Date().toISOString().slice(0, 10)}.json`;
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
                  Administração {localConfig.storeName || 'Clothes.on'}
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
                  onClick={() => setActiveTab('looks')}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-left transition-all shrink-0 cursor-pointer"
                  style={{
                    backgroundColor: activeTab === 'looks' ? (isDark ? '#2f3239' : '#ffffff') : 'transparent',
                    color: activeTab === 'looks' ? '#f97316' : (isDark ? '#b5bac3' : '#52525b'),
                    fontWeight: activeTab === 'looks' ? 'bold' : 'normal',
                  }}
                >
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Passarela 3D (Looks)</span>
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
                  <Palette className="w-4 h-4 text-orange-500" />
                  <span>Estilo, Hero & Cores</span>
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

                    <div className="space-y-3.5">
                      {localShirts.map((shirt, idx) => (
                        <div
                          key={shirt.id}
                          className="p-3.5 rounded-xl border flex flex-col gap-3 transition-colors"
                          style={{
                            backgroundColor: isDark ? '#27292f' : '#f9f8f4',
                            borderColor: isDark ? '#363942' : '#e5e7eb',
                          }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {/* Miniatura da Camisa */}
                              <div
                                className="w-12 h-14 rounded-lg overflow-hidden border shrink-0 flex items-center justify-center relative bg-black/10"
                                style={{ borderColor: isDark ? '#41454f' : '#d4d4d8' }}
                              >
                                {shirt.image && typeof shirt.image === 'string' ? (
                                  <img
                                    src={shirt.image}
                                    alt={shirt.name}
                                    className="w-full h-full object-contain p-1"
                                  />
                                ) : (
                                  <ImageIcon className="w-5 h-5 opacity-40" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded bg-orange-600/20 text-orange-500 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                                    {shirt.num}
                                  </span>
                                  <input
                                    type="text"
                                    value={shirt.name}
                                    onChange={(e) => handleShirtChange(idx, 'name', e.target.value)}
                                    className="font-bold text-xs font-sans uppercase bg-transparent border-b border-dashed border-zinc-500 outline-none w-full max-w-[240px]"
                                  />
                                </div>
                                <span className="text-[10px] font-mono opacity-60 block mt-0.5">
                                  {shirt.category}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                              <span className="text-xs font-mono opacity-70">R$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={shirt.price}
                                onChange={(e) => handleShirtChange(idx, 'price', parseFloat(e.target.value) || 0)}
                                className="w-24 px-2 py-1 text-xs font-mono font-bold rounded border outline-none text-right"
                                style={{
                                  backgroundColor: isDark ? '#18191d' : '#ffffff',
                                  borderColor: isDark ? '#363942' : '#d4d4d8',
                                }}
                              />
                            </div>
                          </div>

                          {/* Linha 2: Controle de Foto da Camisa (Upload ou Link Direto) */}
                          <div
                            className="pt-2 border-t flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-[11px] font-mono"
                            style={{ borderColor: isDark ? '#363942' : '#e5e7eb' }}
                          >
                            <label className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border cursor-pointer hover:bg-orange-500/10 hover:border-orange-500 transition-colors shrink-0 font-medium"
                              style={{
                                borderColor: isDark ? '#434752' : '#d4d4d8',
                                backgroundColor: isDark ? '#1c1e22' : '#ffffff',
                              }}
                            >
                              <Upload className="w-3.5 h-3.5 text-orange-500" />
                              <span>Upload Foto</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleShirtFileUpload(idx, e)}
                                className="hidden"
                              />
                            </label>

                            <input
                              type="text"
                              placeholder="ou cole a URL da foto (PNG transparente)"
                              value={shirt.image && typeof shirt.image === 'string' ? shirt.image : ''}
                              onChange={(e) => handleShirtChange(idx, 'image', e.target.value)}
                              className="flex-1 px-2.5 py-1.5 rounded-lg border outline-none text-[11px]"
                              style={{
                                backgroundColor: isDark ? '#1a1c20' : '#ffffff',
                                borderColor: isDark ? '#363942' : '#d4d4d8',
                              }}
                            />

                            {shirt.image && (
                              <button
                                type="button"
                                onClick={() => handleShirtChange(idx, 'image', '')}
                                title="Limpar Foto"
                                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0 self-end sm:self-auto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
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
                          Calças, bermudas, casacos e acessórios. Altere fotos, nomes, preços ou faça upload do seu computador/celular.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      {localCatalog.map((prod, idx) => (
                        <div
                          key={prod.id}
                          className="p-3.5 rounded-xl border flex flex-col gap-3 transition-colors"
                          style={{
                            backgroundColor: isDark ? '#27292f' : '#f9f8f4',
                            borderColor: isDark ? '#363942' : '#e5e7eb',
                          }}
                        >
                          {/* Linha 1: Foto Miniatura + Nome + Tag + Preço */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {/* Miniatura da Foto do Produto */}
                              <div
                                className="w-12 h-14 rounded-lg overflow-hidden border shrink-0 flex items-center justify-center relative bg-black/10"
                                style={{ borderColor: isDark ? '#41454f' : '#d4d4d8' }}
                              >
                                {prod.image && typeof prod.image === 'string' ? (
                                  <img
                                    src={prod.image}
                                    alt={prod.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ImageIcon className="w-5 h-5 opacity-40" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
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
                                  {prod.categoryLabel || prod.category}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                              <span className="text-xs font-mono opacity-70">R$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={prod.price}
                                onChange={(e) => handleCatalogChange(idx, 'price', parseFloat(e.target.value) || 0)}
                                className="w-24 px-2 py-1 text-xs font-mono font-bold rounded border outline-none text-right"
                                style={{
                                  backgroundColor: isDark ? '#18191d' : '#ffffff',
                                  borderColor: isDark ? '#363942' : '#d4d4d8',
                                }}
                              />
                            </div>
                          </div>

                          {/* Linha 2: Controle de Foto (URL ou Upload direto) */}
                          <div
                            className="pt-2 border-t flex flex-col sm:flex-row items-center gap-2"
                            style={{ borderColor: isDark ? '#343842' : '#e5e7eb' }}
                          >
                            <span className="text-[10px] font-mono uppercase opacity-60 shrink-0">
                              Foto da Peça:
                            </span>

                            <input
                              type="text"
                              placeholder="Cole o link da foto (URL / Cloudflare R2 / Nuvemshop) ou faça upload ao lado ➔"
                              value={prod.image || ''}
                              onChange={(e) => handleCatalogChange(idx, 'image', e.target.value)}
                              className="flex-1 px-2.5 py-1 rounded text-[11px] font-mono border outline-none w-full"
                              style={{
                                backgroundColor: isDark ? '#18191d' : '#ffffff',
                                borderColor: isDark ? '#363942' : '#d4d4d8',
                              }}
                            />

                            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                              <label
                                className="py-1 px-2.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all border shadow-xs hover:bg-zinc-700 active:scale-95"
                                style={{
                                  backgroundColor: isDark ? '#2f333c' : '#f0f0ed',
                                  borderColor: isDark ? '#474c57' : '#d4d4d8',
                                }}
                              >
                                <Upload className="w-3 h-3 text-orange-500" />
                                <span>Upload Foto</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleCatalogFileUpload(idx, e)}
                                />
                              </label>

                              {prod.image && (
                                <button
                                  type="button"
                                  onClick={() => handleCatalogChange(idx, 'image', '')}
                                  title="Remover foto desta peça"
                                  className="p-1 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ABA 3: PASSARELA 3D (LOOKS / TRY THE LOOK) */}
                {activeTab === 'looks' && (
                  <div className="space-y-5">
                    <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}>
                      <div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-orange-500" />
                          <h3 className="text-base font-bold uppercase font-sans">Passarela 3D Giratória (Shop the Look)</h3>
                        </div>
                        <p className="text-xs font-mono opacity-70 mt-0.5">
                          Configure os modelos, envie fotos de corpo inteiro e vincule as roupas que compõem cada look.
                        </p>
                      </div>

                      {localConfig.heroType !== 'runway' && (
                        <button
                          type="button"
                          onClick={() => setLocalConfig({ ...localConfig, heroType: 'runway' })}
                          className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-orange-600 hover:bg-orange-500 text-white cursor-pointer transition-transform active:scale-95 shrink-0 flex items-center gap-1.5 shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Ativar Passarela no Topo</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {localLooks.map((look, lIdx) => {
                        const allAvailableProducts = [...localShirts, ...localCatalog];
                        const linkedProds = allAvailableProducts.filter((p) =>
                          (look.productIds || []).includes(p.id)
                        );

                        return (
                          <div
                            key={look.id || lIdx}
                            className="p-4 rounded-2xl border space-y-4 transition-colors"
                            style={{
                              backgroundColor: isDark ? '#23252a' : '#fcfcfc',
                              borderColor: isDark ? '#333742' : '#e5e7eb',
                            }}
                          >
                            {/* Linha 1: Foto do Modelo + Informações do Look */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                              {/* Miniatura do Modelo */}
                              <div
                                className="w-16 h-22 sm:w-20 sm:h-26 rounded-xl border shrink-0 flex items-center justify-center overflow-hidden bg-black/10 relative"
                                style={{ borderColor: isDark ? '#41454f' : '#d4d4d8' }}
                              >
                                {look.modelImage && typeof look.modelImage === 'string' && !look.modelImage.startsWith('/images/looks') ? (
                                  <img
                                    src={look.modelImage}
                                    alt={look.name}
                                    className="w-full h-full object-contain p-1"
                                  />
                                ) : (
                                  <span className="text-[10px] font-mono font-bold opacity-40 uppercase text-center p-1">
                                    Modelo 0{lIdx + 1}
                                  </span>
                                )}
                              </div>

                              {/* Campos: Título, Categoria e Foto */}
                              <div className="flex-1 w-full space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded bg-orange-600/20 text-orange-500 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                    {look.number || `0${lIdx + 1}`}
                                  </span>
                                  <input
                                    type="text"
                                    value={look.name || ''}
                                    onChange={(e) => handleLookChange(lIdx, 'name', e.target.value)}
                                    placeholder="Nome do Look (ex: The City Suit)"
                                    className="font-bold text-xs font-sans uppercase bg-transparent border-b border-dashed border-zinc-500 outline-none w-full max-w-sm"
                                  />
                                </div>

                                <input
                                  type="text"
                                  value={look.description || ''}
                                  onChange={(e) => handleLookChange(lIdx, 'description', e.target.value)}
                                  placeholder="Descrição editorial do look..."
                                  className="w-full text-xs font-mono opacity-80 bg-transparent border-b border-zinc-600/30 outline-none"
                                />

                                {/* Upload / URL da Foto do Modelo */}
                                <div className="flex items-center gap-2 pt-1">
                                  <label className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border cursor-pointer hover:bg-orange-500/10 hover:border-orange-500 transition-colors shrink-0 text-[11px] font-mono font-bold"
                                    style={{
                                      borderColor: isDark ? '#434752' : '#d4d4d8',
                                      backgroundColor: isDark ? '#1a1c20' : '#ffffff',
                                    }}
                                  >
                                    <Upload className="w-3.5 h-3.5 text-orange-500" />
                                    <span>Upload Modelo</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleLookPhotoUpload(lIdx, e)}
                                      className="hidden"
                                    />
                                  </label>

                                  <input
                                    type="text"
                                    placeholder="ou link direto da foto do modelo (PNG/JPG)"
                                    value={look.modelImage && !look.modelImage.startsWith('/images/looks') ? look.modelImage : ''}
                                    onChange={(e) => handleLookChange(lIdx, 'modelImage', e.target.value)}
                                    className="flex-1 px-2.5 py-1.5 rounded-lg border outline-none text-[11px] font-mono"
                                    style={{
                                      backgroundColor: isDark ? '#1a1c20' : '#ffffff',
                                      borderColor: isDark ? '#363942' : '#d4d4d8',
                                    }}
                                  />

                                  {look.modelImage && !look.modelImage.startsWith('/images/looks') && (
                                    <button
                                      type="button"
                                      onClick={() => handleLookChange(lIdx, 'modelImage', '')}
                                      title="Restaurar Modelo Padrão"
                                      className="p-1.5 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Linha 2: Peças Vinculadas ao Look */}
                            <div className="pt-2 border-t" style={{ borderColor: isDark ? '#333742' : '#e5e7eb' }}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-mono font-bold uppercase text-orange-500">
                                  Roupas Vestidas Neste Look ({linkedProds.length} selecionadas):
                                </span>
                                <span className="text-[10px] font-mono opacity-60">
                                  Clique para marcar ou desmarcar
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 rounded-xl border bg-black/5" style={{ borderColor: isDark ? '#363942' : '#e4e4e7' }}>
                                {allAvailableProducts.map((prod) => {
                                  const isSelected = (look.productIds || []).includes(prod.id);
                                  return (
                                    <button
                                      key={prod.id}
                                      type="button"
                                      onClick={() => handleToggleProductInLook(lIdx, prod.id)}
                                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
                                        isSelected
                                          ? 'bg-orange-600 text-white border-orange-500 font-bold shadow-xs'
                                          : isDark
                                          ? 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60 hover:bg-zinc-700'
                                          : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                                      }`}
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isSelected ? '#ffffff' : '#f97316' }} />
                                      <span className="truncate max-w-[140px]">{prod.name}</span>
                                      <span className="opacity-80">R${prod.price?.toFixed(0)}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ABA 4: CONFIGURAÇÕES DE ESTILO, HERO & TEMAS */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div className="border-b pb-3" style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}>
                      <h3 className="text-base font-bold uppercase font-sans">Estilo Visual, Layout do Topo & Cores</h3>
                      <p className="text-xs font-mono opacity-70">
                        Escolha o formato da seção Hero principal, defina o comportamento dos temas e selecione paletas de cores de alta curadoria.
                      </p>
                    </div>

                    {/* SELETOR VISUAL DO TIPO DE HERO (COM CARDS ILUSTRADOS) */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider block font-bold text-orange-500">
                          1. Formato da Seção Hero (Topo Principal da Loja)
                        </span>
                        <p className="text-[10px] font-mono opacity-60">
                          Selecione como os produtos serão apresentados no primeiro impacto visual da vitrine.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Card 1: Arara Metálica 3D */}
                        <div
                          onClick={() => setLocalConfig({ ...localConfig, heroType: 'rail' })}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                            (localConfig.heroType || 'rail') === 'rail'
                              ? 'border-orange-500 shadow-md'
                              : isDark ? 'border-zinc-700/60 bg-zinc-800/40 opacity-70 hover:opacity-100' : 'border-zinc-300 bg-zinc-50 opacity-70 hover:opacity-100'
                          }`}
                          style={{
                            backgroundColor: (localConfig.heroType || 'rail') === 'rail' ? (isDark ? '#23252a' : '#ffffff') : undefined,
                          }}
                        >
                          {(localConfig.heroType || 'rail') === 'rail' && (
                            <span className="absolute top-3 right-3 text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded-full">
                              Ativo
                            </span>
                          )}

                          {/* Ilustração Visual da Arara Metálica */}
                          <div className="h-28 w-full rounded-xl flex flex-col items-center justify-center p-2 mb-3 bg-zinc-950/20 border border-zinc-500/20 relative">
                            {/* Cano cromado */}
                            <div className="w-full h-2 rounded-full bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-500 shadow-xs mb-2" />
                            {/* Cabides com camisas suspensas */}
                            <div className="flex items-center justify-center gap-3 w-full">
                              {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`flex flex-col items-center transition-transform ${i === 2 ? 'scale-110 -translate-y-1' : 'opacity-60 scale-90'}`}>
                                  <div className="w-3 h-2 border-t border-l border-zinc-400 rotate-45 rounded-tl" />
                                  <div className="w-8 h-10 rounded-t-sm rounded-b-xs bg-zinc-700/70 border border-zinc-400/40" />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold uppercase font-sans">Arara Metálica 3D</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-500/15 text-orange-500 font-bold">The Rail</span>
                            </div>
                            <p className="text-[11px] font-sans opacity-75 mt-1 leading-relaxed">
                              Camisas em suspensão real com balanço pendular interativo, efeito de onda física e ticker marquee laranja.
                            </p>
                          </div>
                        </div>

                        {/* Card 2: Passarela 3D Giratória (Shop the Look) */}
                        <div
                          onClick={() => setLocalConfig({ ...localConfig, heroType: 'runway' })}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                            localConfig.heroType === 'runway'
                              ? 'border-orange-500 shadow-md'
                              : isDark ? 'border-zinc-700/60 bg-zinc-800/40 opacity-70 hover:opacity-100' : 'border-zinc-300 bg-zinc-50 opacity-70 hover:opacity-100'
                          }`}
                          style={{
                            backgroundColor: localConfig.heroType === 'runway' ? (isDark ? '#23252a' : '#ffffff') : undefined,
                          }}
                        >
                          {localConfig.heroType === 'runway' && (
                            <span className="absolute top-3 right-3 text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded-full">
                              Ativo
                            </span>
                          )}

                          {/* Ilustração Visual da Passarela 3D Giratória */}
                          <div className="h-28 w-full rounded-xl flex items-center justify-center p-2 mb-3 bg-zinc-950/20 border border-zinc-500/20 relative overflow-hidden">
                            {/* Modelos vizinhos com blur */}
                            <div className="w-8 h-20 rounded-md bg-zinc-600/40 blur-[2px] scale-90 -translate-x-12 absolute" />
                            {/* Modelo central nítido com pin */}
                            <div className="w-10 h-24 rounded-lg bg-zinc-300/80 border border-white/60 shadow-lg relative flex flex-col items-center justify-center z-10">
                              <div className="w-4 h-4 rounded-full bg-orange-500 animate-ping absolute" />
                              <div className="w-3 h-3 rounded-full bg-zinc-950 border border-white z-10" />
                            </div>
                            {/* Modelo vizinho direito com blur */}
                            <div className="w-8 h-20 rounded-md bg-zinc-600/40 blur-[2px] scale-90 translate-x-12 absolute" />
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold uppercase font-sans">Passarela 3D Giratória</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-500/15 text-orange-500 font-bold">Shop the Look</span>
                            </div>
                            <p className="text-[11px] font-sans opacity-75 mt-1 leading-relaxed">
                              Modelos em 3D circular com profundidade focal (blur), arrasto touch/mouse, pins interativos e gaveta "In this look".
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SISTEMA ESTRATÉGICO DE TEMAS & CORES */}
                    <div className="space-y-4 pt-2 border-t" style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}>
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider block font-bold text-orange-500">
                          2. Estratégia de Cores e Temas
                        </span>
                        <p className="text-[10px] font-mono opacity-60">
                          Defina se o cliente poderá alternar o tema ou se a loja terá uma estética fixa única.
                        </p>
                      </div>

                      {/* Modo Dual vs Modo Fixo Único */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setLocalConfig({ ...localConfig, themeMode: 'dual' })}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                            (localConfig.themeMode || 'dual') === 'dual'
                              ? 'border-orange-500 bg-orange-500/10'
                              : isDark ? 'border-zinc-700 bg-zinc-800/40' : 'border-zinc-300 bg-zinc-50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <Sun className="w-3.5 h-3.5 text-amber-400" />
                              <Moon className="w-3.5 h-3.5 text-zinc-400" />
                              <span className="font-bold text-xs uppercase font-sans">Modo Dual (Claro & Escuro)</span>
                            </div>
                            <span className="text-[10px] font-mono opacity-70 block mt-0.5">
                              Botão Sol/Lua visível no topo para o cliente alternar.
                            </span>
                          </div>
                          {(localConfig.themeMode || 'dual') === 'dual' && (
                            <Check className="w-4 h-4 text-orange-500 shrink-0" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setLocalConfig({ ...localConfig, themeMode: 'single' })}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                            localConfig.themeMode === 'single'
                              ? 'border-orange-500 bg-orange-500/10'
                              : isDark ? 'border-zinc-700 bg-zinc-800/40' : 'border-zinc-300 bg-zinc-50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-orange-500" />
                              <span className="font-bold text-xs uppercase font-sans">Modo Fixo Único</span>
                            </div>
                            <span className="text-[10px] font-mono opacity-70 block mt-0.5">
                              Sem botão no topo. Fica 100% no tema padrão que você definir.
                            </span>
                          </div>
                          {localConfig.themeMode === 'single' && (
                            <Check className="w-4 h-4 text-orange-500 shrink-0" />
                          )}
                        </button>
                      </div>

                      {/* Seletor de Tema Inicial / Fixo */}
                      <div>
                        <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                          Tema Padrão / Inicial da Loja
                        </label>
                        <div className="grid grid-cols-2 gap-2 max-w-xs">
                          <button
                            type="button"
                            onClick={() => setLocalConfig({ ...localConfig, defaultTheme: 'dark' })}
                            className={`py-2 px-3 rounded-lg border text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${
                              (localConfig.defaultTheme || 'dark') === 'dark'
                                ? 'bg-zinc-950 text-white border-orange-500'
                                : isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-zinc-100 border-zinc-300 text-zinc-600'
                            }`}
                          >
                            <Moon className="w-3.5 h-3.5 text-amber-400" />
                            <span>Escuro (Dark)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setLocalConfig({ ...localConfig, defaultTheme: 'light' })}
                            className={`py-2 px-3 rounded-lg border text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${
                              localConfig.defaultTheme === 'light'
                                ? 'bg-zinc-100 text-zinc-950 border-orange-500'
                                : isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-zinc-100 border-zinc-300 text-zinc-600'
                            }`}
                          >
                            <Sun className="w-3.5 h-3.5 text-amber-500" />
                            <span>Claro (Light)</span>
                          </button>
                        </div>
                      </div>

                      {/* Paletas de Cores Pré-Setadas para o Modo Escuro */}
                      <div className="space-y-2 pt-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider block font-bold text-zinc-400">
                          Paleta do Modo Escuro (Dark Themes):
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {Object.values(DARK_PALETTES).map((pal) => {
                            const isSelected = (localConfig.darkPalette || 'onyx_industrial') === pal.id;
                            return (
                              <div
                                key={pal.id}
                                onClick={() => setLocalConfig({ ...localConfig, darkPalette: pal.id })}
                                className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                                  isSelected
                                    ? 'border-orange-500 bg-zinc-900/90 shadow-sm'
                                    : 'border-zinc-700/60 bg-zinc-800/30 opacity-70 hover:opacity-100'
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs font-sans text-zinc-200">{pal.name}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-orange-500" />}
                                  </div>
                                  <p className="text-[10px] font-mono text-zinc-400">{pal.description}</p>
                                </div>

                                {/* Amostras de Cor (Swatches) */}
                                <div className="flex items-center gap-1 shrink-0 ml-2">
                                  {pal.previewColors.map((hex, cIdx) => (
                                    <span
                                      key={cIdx}
                                      className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                                      style={{ backgroundColor: hex }}
                                    />
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Paletas de Cores Pré-Setadas para o Modo Claro */}
                      <div className="space-y-2 pt-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider block font-bold text-zinc-400">
                          Paleta do Modo Claro (Light Themes):
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {Object.values(LIGHT_PALETTES).map((pal) => {
                            const isSelected = (localConfig.lightPalette || 'raw_canvas') === pal.id;
                            return (
                              <div
                                key={pal.id}
                                onClick={() => setLocalConfig({ ...localConfig, lightPalette: pal.id })}
                                className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                                  isSelected
                                    ? 'border-orange-500 bg-zinc-900/90 shadow-sm'
                                    : 'border-zinc-700/60 bg-zinc-800/30 opacity-70 hover:opacity-100'
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs font-sans text-zinc-200">{pal.name}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-orange-500" />}
                                  </div>
                                  <p className="text-[10px] font-mono text-zinc-400">{pal.description}</p>
                                </div>

                                {/* Amostras de Cor (Swatches) */}
                                <div className="flex items-center gap-1 shrink-0 ml-2">
                                  {pal.previewColors.map((hex, cIdx) => (
                                    <span
                                      key={cIdx}
                                      className="w-4 h-4 rounded-full border border-black/20 shadow-xs"
                                      style={{ backgroundColor: hex }}
                                    />
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* IDENTIDADE DA MARCA (LOGO & NOME WHITE-LABEL) */}
                    <div className="space-y-4 pt-2 border-t" style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}>
                      <span className="text-[11px] font-mono uppercase tracking-wider block font-bold text-orange-500">
                        3. Identidade da Marca (White-Label)
                      </span>

                      {/* Upload / URL da Logo da Marca */}
                      <div
                        className="p-3.5 rounded-xl border space-y-3"
                        style={{
                          borderColor: isDark ? '#363942' : '#e4e4e7',
                          backgroundColor: isDark ? '#202227' : '#fcfcfc',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-[11px] font-mono uppercase tracking-wider block font-bold text-orange-500">
                              Logo da Loja (Substitui o nome no Cabeçalho e Rodapé)
                            </label>
                            <span className="text-[10px] font-mono opacity-60 block mt-0.5">
                              Puxe automaticamente da Nuvemshop ou envie o arquivo da logo do seu cliente.
                            </span>
                          </div>
                          {localConfig.logoUrl && (
                            <button
                              type="button"
                              onClick={() => setLocalConfig({ ...localConfig, logoUrl: '' })}
                              className="px-2 py-1 rounded text-[10px] font-mono text-red-400 hover:bg-red-500/10 flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3 h-3" /> Remover Logo
                            </button>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {/* Preview da Logo */}
                          <div
                            className="w-36 h-16 rounded-lg border flex items-center justify-center p-2 shrink-0 overflow-hidden"
                            style={{
                              backgroundColor: isDark ? '#141518' : '#f0f0ed',
                              borderColor: isDark ? '#33363e' : '#d4d4d8',
                            }}
                          >
                            {localConfig.logoUrl ? (
                              <img
                                src={localConfig.logoUrl}
                                alt="Logo Preview"
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <span className="text-xs font-mono font-bold opacity-40 uppercase">
                                {localConfig.storeName || 'clothes.on'}
                              </span>
                            )}
                          </div>

                          <div className="flex-1 w-full space-y-2">
                            <div className="flex items-center gap-2">
                              <label className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-orange-600 hover:bg-orange-500 text-white cursor-pointer transition-colors shrink-0 shadow-xs">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Imagem</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleLogoFileUpload}
                                  className="hidden"
                                />
                              </label>
                              <span className="text-[10px] font-mono opacity-50">ou cole o link da foto abaixo:</span>
                            </div>

                            <input
                              type="text"
                              placeholder="https://exemplo.com/logo-da-marca.png"
                              value={localConfig.logoUrl || ''}
                              onChange={(e) => setLocalConfig({ ...localConfig, logoUrl: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg text-xs font-mono border outline-none"
                              style={{
                                backgroundColor: isDark ? '#1a1c20' : '#ffffff',
                                borderColor: isDark ? '#363942' : '#d4d4d8',
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Nome da Loja */}
                      <div>
                        <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                          Nome da Loja / Marca do Cliente (White-Label)
                        </label>
                        <input
                          type="text"
                          placeholder="ex: Clothes.on ou Nome da Sua Marca"
                          value={localConfig.storeName || ''}
                          onChange={(e) => setLocalConfig({ ...localConfig, storeName: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl text-xs font-mono font-bold border outline-none focus:border-orange-500"
                          style={{
                            backgroundColor: isDark ? '#1a1c20' : '#f8f8f6',
                            borderColor: isDark ? '#363942' : '#d4d4d8',
                          }}
                        />
                        <span className="text-[10px] font-mono opacity-60 block mt-1">
                          Usado quando não houver imagem de logo definida.
                        </span>
                      </div>
                    </div>

                    {/* CONFIGURAÇÕES DE TEXTO E VENDAS */}
                    <div className="space-y-4 pt-2 border-t" style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}>
                      <span className="text-[11px] font-mono uppercase tracking-wider block font-bold text-orange-500">
                        4. Marquee, Frete & Atendimento
                      </span>

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
                            placeholder="pix@clotheson.com.br"
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
                  <div className="space-y-5">
                    <div className="border-b pb-3" style={{ borderColor: isDark ? '#33363e' : '#e4e4e7' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">☁️</span>
                        <h3 className="text-base font-bold uppercase font-sans">Conexão Oficial Nuvemshop</h3>
                      </div>
                      <p className="text-xs font-mono opacity-70 mt-1">
                        Ponte completa: estoque sincronizado, vitrine de roupas e acessórios, pagamentos no Nuvem Pago e etiquetas de frete geradas automaticamente.
                      </p>
                    </div>

                    {/* Banner explicativo */}
                    <div
                      className="p-4 rounded-xl border space-y-2"
                      style={{
                        backgroundColor: isDark ? '#1a2233' : '#eff6ff',
                        borderColor: '#3b82f6',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-mono uppercase font-bold text-blue-500 block">
                          Logística, Pagamentos & Etiquetas Integradas
                        </span>
                      </div>
                      <p className="text-xs font-sans leading-relaxed opacity-90">
                        Quando o cliente inserir o <strong>Store ID</strong> e o <strong>Access Token</strong>, clique em <strong>Sincronizar Produtos</strong> para puxar todas as peças e acessórios cadastrados na Nuvemshop para a vitrine. Ao finalizar a compra, o carrinho vai direto para a Nuvemshop do cliente, onde a etiqueta de envio do <strong>Nuvem Envio / Melhor Envio</strong> e os pagamentos via <strong>Nuvem Pago / Cartão</strong> já são emitidos nativamente!
                      </p>
                    </div>

                    {/* Mensagem de Feedback de Teste ou Sincronização */}
                    {testResult && (
                      <div
                        className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs font-mono ${
                          testResult.success
                            ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-400'
                            : 'bg-red-950/30 border-red-500/50 text-red-400'
                        }`}
                      >
                        {testResult.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        )}
                        <span>{testResult.message}</span>
                      </div>
                    )}

                    {syncResult && (
                      <div
                        className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs font-mono ${
                          syncResult.success
                            ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-400'
                            : 'bg-red-950/30 border-red-500/50 text-red-400'
                        }`}
                      >
                        {syncResult.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        )}
                        <span>{syncResult.message}</span>
                      </div>
                    )}

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
                        <span className="text-[10px] font-mono opacity-60 block mt-1">
                          Usada para redirecionar o cliente para a tela de pagamento e emissão da etiqueta de envio.
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                            1. Store ID da Nuvemshop
                          </label>
                          <input
                            type="text"
                            placeholder="ex: 1234567"
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
                          <span className="text-[10px] font-mono opacity-60 block mt-1">
                            Disponível na URL do painel administrativo da Nuvemshop.
                          </span>
                        </div>

                        <div>
                          <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                            2. Access Token da API Nuvemshop
                          </label>
                          <input
                            type="password"
                            placeholder="ex: 8a9f...3e1d"
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
                          <span className="text-[10px] font-mono opacity-60 block mt-1">
                            Gerado no aplicativo de API ou integrações da Nuvemshop.
                          </span>
                        </div>
                      </div>

                      {/* Botões de Ação Direta com a Nuvemshop */}
                      <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                        <button
                          type="button"
                          onClick={handleTestNuvemshop}
                          disabled={isTestingNuvem}
                          className="flex-1 py-2.5 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-zinc-800 disabled:opacity-50"
                          style={{
                            borderColor: isDark ? '#3b404d' : '#d4d4d8',
                            backgroundColor: isDark ? '#23252a' : '#f4f4f5',
                            color: isDark ? '#f4f5f7' : '#18181b',
                          }}
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                          <span>{isTestingNuvem ? 'Verificando...' : '1. Testar Conexão'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSyncNuvemshop}
                          disabled={isSyncingNuvem}
                          className="flex-1 py-2.5 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 active:scale-98"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncingNuvem ? 'animate-spin' : ''}`} />
                          <span>{isSyncingNuvem ? 'Importando Peças...' : '2. 🔄 Sincronizar Produtos'}</span>
                        </button>
                      </div>

                      <div className="pt-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider block mb-1 opacity-70">
                          Comportamento do Botão de Finalizar Compra
                        </label>
                        <select
                          value={localConfig.nuvemshop?.checkoutMode || 'redirect_cart'}
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
                          <option value="redirect_cart">
                            Checkout Direto Nuvemshop (Recomendado: Nuvem Pago + Emissão de Etiquetas de Frete)
                          </option>
                          <option value="built_in">
                            Checkout Próprio da Loja (PIX instantâneo na tela + Confirmação WhatsApp)
                          </option>
                        </select>
                      </div>

                      {/* Status de Ativação Geral */}
                      <div
                        className="p-3.5 rounded-xl border flex items-center justify-between"
                        style={{
                          backgroundColor: isDark ? '#181a1f' : '#f9f9f7',
                          borderColor: isDark ? '#33363e' : '#e4e4e7',
                        }}
                      >
                        <div>
                          <span className="font-bold text-xs block">Status da Integração Nuvemshop</span>
                          <span className="text-[11px] font-mono opacity-60">
                            {localConfig.nuvemshop?.enabled
                              ? 'Ativa: Vitrine e checkout conectados à Nuvemshop'
                              : 'Inativa: Utilizando catálogo padrão demonstrativo'}
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!localConfig.nuvemshop?.enabled}
                            onChange={(e) =>
                              setLocalConfig({
                                ...localConfig,
                                nuvemshop: { ...localConfig.nuvemshop, enabled: e.target.checked },
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      {/* Desconectar e Limpar Loja de Teste */}
                      <div
                        className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4"
                        style={{
                          backgroundColor: isDark ? '#261616' : '#fef2f2',
                          borderColor: isDark ? '#7f1d1d' : '#fecaca',
                        }}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-red-500 font-bold text-xs uppercase font-mono">
                              🔌 Desconectar Loja & Limpar Dados de Teste
                            </span>
                          </div>
                          <span
                            className="text-[11px] font-mono opacity-80 block mt-0.5"
                            style={{ color: isDark ? '#fca5a5' : '#991b1b' }}
                          >
                            Apaga o Store ID, Access Token e restaura as peças de demonstração da vitrine para que você possa transferir a loja 100% limpa ao cliente final.
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={handleDisconnectNuvemshop}
                          className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-all active:scale-95 shrink-0 shadow-xs"
                        >
                          Desconectar & Limpar
                        </button>
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

