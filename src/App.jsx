import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { NavigationMenu } from './components/NavigationMenu';
import { ClothesRail } from './components/ClothesRail';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetail } from './components/ProductDetail';
import { EditDrawer } from './components/EditDrawer';
import { Footer } from './components/Footer';
import { PRODUCTS } from './data/products';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState('rail'); // 'rail' | 'detail'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editItems, setEditItems] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');

  // Inicializa o tema a partir do localStorage ou preferência do sistema
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('korvo-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

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
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const currentShirt = PRODUCTS[currentIndex] || PRODUCTS[0];
  const activeProduct = selectedProduct || currentShirt;

  const handleAddToEdit = (item) => {
    setEditItems((prev) => [...prev, item]);
  };

  const handleRemoveFromEdit = (index) => {
    setEditItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearEdit = () => {
    setEditItems([]);
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
        editCount={editItems.length}
        onOpenEdit={() => setIsEditOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onGoHome={() => {
          setViewMode('rail');
          setSelectedProduct(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Menu Lateral Deslizante da Esquerda (abre da esquerda pra direita sem mudar a estrutura do site) */}
      <NavigationMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectCategory={handleCategorySelect}
        theme={theme}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col justify-start items-center w-full">
        <AnimatePresence mode="wait">
          {viewMode === 'rail' ? (
            <div key="home-view" className="w-full flex flex-col items-center">
              {/* Arara de Roupas Interativa (100% preservada, sem nenhuma alteração) */}
              <ClothesRail
                products={PRODUCTS}
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
                theme={theme}
              />

              {/* Catálogo Completo Logo Abaixo da Arara (Calças, Bermudas & Casacos) */}
              <ProductCatalog
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

      {/* Rodapé Completo da Loja Online */}
      <Footer theme={theme} />

      {/* Gaveta Lateral de Curadoria (EDIT) */}
      <EditDrawer
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        items={editItems}
        onRemoveItem={handleRemoveFromEdit}
        onClear={handleClearEdit}
        theme={theme}
      />
    </div>
  );
}
