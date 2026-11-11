import { PRODUCTS } from './products';
import { CATALOG_PRODUCTS } from './catalog';

const STORAGE_KEYS = {
  CONFIG: 'levant_store_config',
  SHIRTS: 'levant_store_shirts',
  CATALOG: 'levant_store_catalog',
  CART: 'levant_store_cart',
};

export const DEFAULT_CONFIG = {
  storeName: 'Levant',
  adminPin: '1234',
  marqueeText: 'LEVANT · CONCRETE SEASON N° 01 + ON LOOKS, BE HYPER + TAKE IT TO 100% WASH SAND + FAULT HEAVY + ROBUST FIT + NO LOGOS, NO NOISE + MADE TO BE WORN HARD + BUILT HEAVY +',
  freeShippingThreshold: 299,
  defaultPacPrice: 19.90,
  defaultSedexPrice: 32.90,
  whatsappNumber: '5511999999999',
  instagramHandle: 'levant.studio',
  contactEmail: 'contato@levant.com.br',
  // Conexão Nuvemshop
  nuvemshop: {
    enabled: false,
    storeUrl: '', // ex: 'https://sualoja.lojavirtualnuvem.com.br'
    storeId: '',
    accessToken: '',
    // 'redirect_cart' (abre carrinho na Nuvemshop) ou 'built_in' (checkout próprio)
    checkoutMode: 'built_in',
  },
  pixKey: 'pix@levant.com.br',
  pixBeneficiary: 'LEVANT CLOTHING CO',
};

// Carrega configurações da loja
export function getStoredConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!raw) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveStoredConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Erro ao salvar config:', e);
  }
}

// Carrega produtos da arara (camisas)
export function getStoredShirts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHIRTS);
    if (!raw) return PRODUCTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : PRODUCTS;
  } catch {
    return PRODUCTS;
  }
}

export function saveStoredShirts(shirts) {
  try {
    localStorage.setItem(STORAGE_KEYS.SHIRTS, JSON.stringify(shirts));
  } catch (e) {
    console.error('Erro ao salvar camisas:', e);
  }
}

// Carrega catálogo (calças, bermudas, casacos)
export function getStoredCatalog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATALOG);
    if (!raw) return CATALOG_PRODUCTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : CATALOG_PRODUCTS;
  } catch {
    return CATALOG_PRODUCTS;
  }
}

export function saveStoredCatalog(catalog) {
  try {
    localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(catalog));
  } catch (e) {
    console.error('Erro ao salvar catálogo:', e);
  }
}

// Carrinho persistente
export function getStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    if (!raw) return [];
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

export function saveStoredCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  } catch (e) {
    console.error('Erro ao salvar carrinho:', e);
  }
}

// Reset para os padrões originais
export function resetAllToDefaults() {
  localStorage.removeItem(STORAGE_KEYS.CONFIG);
  localStorage.removeItem(STORAGE_KEYS.SHIRTS);
  localStorage.removeItem(STORAGE_KEYS.CATALOG);
}

