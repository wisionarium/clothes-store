import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { NavigationMenu } from './components/NavigationMenu';
import { ClothesRail } from './components/ClothesRail';
import { RunwayLookbook } from './components/RunwayLookbook';
import { EditorialBannerHero } from './components/EditorialBannerHero';
import { SplitMinimalHero } from './components/SplitMinimalHero';
import { BentoGridHero } from './components/BentoGridHero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetail } from './components/ProductDetail';
import { EditDrawer } from './components/EditDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';
import { applyThemeVariables } from './data/themePalettes';
import {
  getStoredConfig,
  saveStoredConfig,
  getStoredShirts,
  saveStoredShirts,
  getStoredCatalog,
  saveStoredCatalog,
  getStoredLooks,
  saveStoredLooks,
  getStoredCart,
  saveStoredCart,
  resetAllToDefaults,
  fetchRemoteStoreData,
  saveRemoteStoreData,
} from './data/storeConfig';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState('rail'); // 'rail' | 'detail'
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Estados Dinâmicos da Loja (Persistidos no localStorage sem precisar de banco agora)
  const [storeConfig, setStoreConfig] = useState(getStoredConfig);
  const [shirts, setShirts] = useState(getStoredShirts);
  const [catalog, setCatalog] = useState(getStoredCatalog);
  const [looks, setLooks] = useState(getStoredLooks);

  // Carrinho de Compras Persistente
  const [editItems, setEditItems] = useState(getStoredCart);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Modais de Checkout e Administração
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ subtotal: 0, shippingValue: 0, shippingMethod: 'pac' });

  const [selectedCategory, setSelectedCategory] = useState('todos');

  // Salva carrinho no localStorage sempre que mudar
  useEffect(() => {
    saveStoredCart(editItems);
  }, [editItems]);

  // Sincroniza dados com o Cloudflare KV na nuvem ao carregar a página
  useEffect(() => {
    fetchRemoteStoreData().then((remote) => {
      if (remote) {
        if (remote.config) setStoreConfig((prev) => ({ ...prev, ...remote.config }));
        if (remote.shirts && Array.isArray(remote.shirts) && remote.shirts.length > 0) {
          setShirts(remote.shirts);
        }
        if (remote.catalog && Array.isArray(remote.catalog) && remote.catalog.length > 0) {
          setCatalog(remote.catalog);
        }
        if (remote.looks && Array.isArray(remote.looks) && remote.looks.length > 0) {
          setLooks(remote.looks);
        }
      }
    });
  }, []);

  // Listener para abrir admin via URL hash (#admin)
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Inicializa o tema: usa preferência salva ou o padrão configurado no Admin
  const [theme, setTheme] = useState(() => {
    if (storeConfig?.themeMode === 'single') {
      return storeConfig?.defaultTheme || 'dark';
    }
    const saved = localStorage.getItem('korvo-theme');
    if (saved) return saved;
    return storeConfig?.defaultTheme || 'dark';
  });

  // Atualiza o tema se o lojista alterar nas configurações do Admin
  useEffect(() => {
    if (storeConfig?.themeMode === 'single') {
      setTheme(storeConfig?.defaultTheme || 'dark');
      return;
    }
    if (storeConfig?.defaultTheme && !localStorage.getItem('korvo-theme-manual')) {
      setTheme(storeConfig.defaultTheme);
    }
  }, [storeConfig?.defaultTheme, storeConfig?.themeMode]);

  // Aplica as variáveis CSS dinâmicas da paleta selecionada (Dark ou Light)
  useEffect(() => {
    const isDark = theme === 'dark';
    const activePalette = isDark
      ? (storeConfig?.darkPalette || 'onyx_industrial')
      : (storeConfig?.lightPalette || 'raw_canvas');
    applyThemeVariables(isDark, activePalette);
  }, [theme, storeConfig?.darkPalette, storeConfig?.lightPalette]);

  // Atualiza a classe 'dark' no elemento raiz do documento
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('korvo-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    if (storeConfig?.themeMode === 'single') return; // Bloqueia se estiver fixo
    localStorage.setItem('korvo-theme-manual', 'true');
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const currentShirt = shirts[currentIndex] || shirts[0];
  const activeProduct = selectedProduct || currentShirt;

  // Gerenciamento do Carrinho
  const handleAddToEdit = (item) => {
    setEditItems((prev) => {
      // Se a mesma peça com mesmo tamanho e cor já existir, incrementa a quantidade
      const existingIdx = prev.findIndex(
        (i) => i.id === item.id && i.selectedSize === item.selectedSize && i.selectedColor === item.selectedColor
      );
      if (existingIdx !== -1) {
        const copy = [...prev];
        copy[existingIdx].quantity = (copy[existingIdx].quantity || 1) + (item.quantity || 1);
        return copy;
      }
      return [...prev, item];
    });
  };

  const handleUpdateQuantity = (index, newQty) => {
    setEditItems((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index].quantity = newQty;
      }
      return copy;
    });
  };

  const handleRemoveFromEdit = (index) => {
    setEditItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearEdit = () => {
    setEditItems([]);
  };

  // Funções de Administração sincronizadas com Cloudflare KV
  const handleSaveConfig = (newConfig) => {
    setStoreConfig(newConfig);
    saveStoredConfig(newConfig);
    saveRemoteStoreData({ config: newConfig });
  };

  const handleSaveShirts = (newShirts) => {
    setShirts(newShirts);
    saveStoredShirts(newShirts);
    saveRemoteStoreData({ shirts: newShirts });
  };

  const handleSaveCatalog = (newCatalog) => {
    setCatalog(newCatalog);
    saveStoredCatalog(newCatalog);
    saveRemoteStoreData({ catalog: newCatalog });
  };

  const handleSaveLooks = (newLooks) => {
    setLooks(newLooks);
    saveStoredLooks(newLooks);
    saveRemoteStoreData({ looks: newLooks });
  };

  const handleResetDefaults = () => {
    resetAllToDefaults();
    setStoreConfig(getStoredConfig());
    setShirts(getStoredShirts());
    setCatalog(getStoredCatalog());
    setLooks(getStoredLooks());
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (viewMode !== 'rail') {
      setViewMode('rail');
      setSelectedProduct(null);
    }
    setTimeout(() => {
      const el = document.getElementById('catalog-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div
      className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col font-sans selection:bg-orange-500 selection:text-white transition-colors duration-200"
      style={{
        backgroundColor: 'var(--app-bg)',
        color: 'var(--app-text)',
      }}
    >
      {/* Header Fixo / Superior */}
      <Header
        editCount={editItems.reduce((acc, i) => acc + (i.quantity || 1), 0)}
        onOpenEdit={() => setIsEditOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onGoHome={() => {
          setViewMode('rail');
          setSelectedProduct(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
        storeName={storeConfig.storeName}
        logoUrl={storeConfig.logoUrl}
        showThemeToggle={storeConfig?.themeMode !== 'single'}
      />

      {/* Menu Lateral Deslizante da Esquerda */}
      <NavigationMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectCategory={handleCategorySelect}
        onOpenAdmin={() => setIsAdminOpen(true)}
        theme={theme}
        storeName={storeConfig.storeName}
        logoUrl={storeConfig.logoUrl}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col justify-start items-center w-full">
        <AnimatePresence mode="wait">
          {viewMode === 'rail' ? (
            <div key="home-view" className="w-full flex flex-col items-center">
              {/* HERO PRINCIPAL: 5 Estilos Selecionáveis no ADM */}
              {(() => {
                const currentHero = storeConfig?.heroType || 'runway';

                if (currentHero === 'runway') {
                  return (
                    <RunwayLookbook
                      looks={looks}
                      allProducts={[...shirts, ...catalog]}
                      storeName={storeConfig.storeName}
                      theme={theme}
                      onSelectProduct={(prod) => {
                        setSelectedProduct(prod);
                        setViewMode('detail');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onAddToCart={handleAddToEdit}
                    />
                  );
                }

                if (currentHero === 'editorial_banner') {
                  return (
                    <EditorialBannerHero
                      config={storeConfig.heroConfig}
                      theme={theme}
                      storeName={storeConfig.storeName}
                      onExplore={() => {
                        document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    />
                  );
                }

                if (currentHero === 'split_minimal') {
                  return (
                    <SplitMinimalHero
                      config={storeConfig.heroConfig}
                      theme={theme}
                      allProducts={[...shirts, ...catalog]}
                      onSelectProduct={(prod) => {
                        setSelectedProduct(prod);
                        setViewMode('detail');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onAddToCart={handleAddToEdit}
                    />
                  );
                }

                if (currentHero === 'bento_grid') {
                  return (
                    <BentoGridHero
                      config={storeConfig.heroConfig}
                      theme={theme}
                      onSelectCategory={(cat) => {
                        setSelectedCategory(cat);
                      }}
                    />
                  );
                }

                // Default / 'rail': Arara Metálica 3D
                return (
                  <ClothesRail
                    products={shirts}
                    currentIndex={currentIndex}
                    onSelectIndex={(newIdx) => {
                      setCurrentIndex(newIdx);
                      setSelectedProduct(null);
                    }}
                    onUnfold={() => {
                      setSelectedProduct(currentShirt);
                      setViewMode('detail');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    marqueeText={storeConfig.marqueeText}
                    theme={theme}
                    storeName={storeConfig.storeName}
                  />
                );
              })()}

              {/* Catálogo Completo Logo Abaixo da Arara (Calças, Bermudas & Casacos) */}
              <ProductCatalog
                products={catalog}
                onSelectProduct={(prod) => {
                  setSelectedProduct(prod);
                  setViewMode('detail');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                theme={theme}
              />
            </div>
          ) : (
            <div key="detail-view" className="w-full flex flex-col items-center py-4">
              <ProductDetail
                product={activeProduct}
                onBack={() => {
                  setViewMode('rail');
                  setSelectedProduct(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onAddToEdit={handleAddToEdit}
                onSelectProduct={(prod) => {
                  setSelectedProduct(prod);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                totalInEdit={editItems.length}
                theme={theme}
              />
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Rodapé Completo da Loja Online com link para ADM */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        theme={theme}
        storeName={storeConfig.storeName}
        logoUrl={storeConfig.logoUrl}
        contactEmail={storeConfig.contactEmail}
        whatsappNumber={storeConfig.whatsappNumber}
      />

      {/* Gaveta Lateral de Sacola / Carrinho */}
      <EditDrawer
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        items={editItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromEdit}
        onClear={handleClearEdit}
        onOpenCheckout={(data) => {
          setCheckoutData(data);
          setIsCheckoutOpen(true);
        }}
        storeConfig={storeConfig}
        theme={theme}
      />

      {/* Modal de Checkout (PIX, Cartão, Nuvemshop & WhatsApp) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={editItems}
        total={checkoutData.subtotal}
        shippingValue={checkoutData.shippingValue}
        shippingMethod={checkoutData.shippingMethod}
        storeConfig={storeConfig}
        onOrderCompleted={() => {
          handleClearEdit();
        }}
        theme={theme}
      />

      {/* Modal / Painel de Administração do Lojista */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }}
        config={storeConfig}
        onSaveConfig={handleSaveConfig}
        shirts={shirts}
        onSaveShirts={handleSaveShirts}
        catalog={catalog}
        onSaveCatalog={handleSaveCatalog}
        looks={looks}
        onSaveLooks={handleSaveLooks}
        onResetDefaults={handleResetDefaults}
        theme={theme}
      />
    </div>
  );
}
