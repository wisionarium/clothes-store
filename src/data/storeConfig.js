import { PRODUCTS } from './products';
import { CATALOG_PRODUCTS } from './catalog';

const STORAGE_KEYS = {
  CONFIG: 'clotheson_store_config',
  SHIRTS: 'clotheson_store_shirts',
  CATALOG: 'clotheson_store_catalog',
  CART: 'clotheson_store_cart',
};

export const DEFAULT_CONFIG = {
  storeName: 'clothes.on',
  logoUrl: '', // URL ou imagem base64 da Logo do cliente
  defaultTheme: 'dark', // 'dark' | 'light' - Tema inicial do site
  adminPin: '1234',
  marqueeText: 'CLOTHES.ON · HEAVY STREETWEAR & ESSENTIALS + 100% PREMIUM COTTON + HEAVY ROBUST FIT + NO NOISE, PURE FORM + BUILT TO BE WORN HARD +',
  freeShippingThreshold: 299,
  defaultPacPrice: 19.90,
  defaultSedexPrice: 32.90,
  whatsappNumber: '5511999999999',
  instagramHandle: 'clothes.on',
  contactEmail: 'contato@clotheson.com.br',
  // Conexão Nuvemshop
  nuvemshop: {
    enabled: false,
    storeUrl: '', // ex: 'https://sualoja.lojavirtualnuvem.com.br'
    storeId: '',
    accessToken: '',
    // 'redirect_cart' (abre carrinho na Nuvemshop) ou 'built_in' (checkout próprio)
    checkoutMode: 'redirect_cart',
  },
  pixKey: 'pix@clotheson.com.br',
  pixBeneficiary: 'CLOTHES.ON STORE',
};

// Carrega configurações da loja
export function getStoredConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!raw) {
      const oldRaw = localStorage.getItem('levant_store_config');
      if (oldRaw) {
        const oldParsed = JSON.parse(oldRaw);
        if (oldParsed?.storeName && oldParsed.storeName.toLowerCase() === 'levant') {
          oldParsed.storeName = 'clothes.on';
        }
        return { ...DEFAULT_CONFIG, ...oldParsed };
      }
      return DEFAULT_CONFIG;
    }
    const parsed = JSON.parse(raw);
    if (parsed?.storeName && parsed.storeName.toLowerCase() === 'levant') {
      parsed.storeName = 'clothes.on';
    }
    return { ...DEFAULT_CONFIG, ...parsed };
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
    const raw = localStorage.getItem(STORAGE_KEYS.SHIRTS) || localStorage.getItem('levant_store_shirts');
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
    const raw = localStorage.getItem(STORAGE_KEYS.CATALOG) || localStorage.getItem('levant_store_catalog');
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
    const raw = localStorage.getItem(STORAGE_KEYS.CART) || localStorage.getItem('levant_store_cart');
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

// ==========================================
// INTEGRAÇÃO NUVEM COM CLOUDFLARE KV
// ==========================================

// Busca todos os dados da loja salvos no Cloudflare KV
export async function fetchRemoteStoreData() {
  try {
    const res = await fetch('/api/kv?key=all');
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data) {
      const { config, shirts, catalog } = json.data;

      // Sincroniza localmente para carregar instantaneamente nos próximos acessos
      if (config) {
        if (config.storeName && config.storeName.toLowerCase() === 'levant') {
          config.storeName = 'clothes.on';
        }
        saveStoredConfig(config);
      }
      if (shirts && Array.isArray(shirts) && shirts.length > 0) saveStoredShirts(shirts);
      if (catalog && Array.isArray(catalog) && catalog.length > 0) saveStoredCatalog(catalog);

      return { config, shirts, catalog };
    }
    return null;
  } catch (err) {
    console.error('Falha ao sincronizar com Cloudflare KV:', err);
    return null;
  }
}

// Salva alterações no Cloudflare KV em segundo plano
export async function saveRemoteStoreData(payload) {
  try {
    const res = await fetch('/api/kv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.error('Falha ao persistir no Cloudflare KV:', err);
    return false;
  }
}

