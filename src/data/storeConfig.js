import { PRODUCTS } from './products';
import { CATALOG_PRODUCTS } from './catalog';
import { DEFAULT_LOOKS } from './lookbook';

const STORAGE_KEYS = {
  CONFIG: 'clotheson_store_config',
  SHIRTS: 'clotheson_store_shirts',
  CATALOG: 'clotheson_store_catalog',
  LOOKS: 'clotheson_store_looks',
  CART: 'clotheson_store_cart',
};

export const DEFAULT_CONFIG = {
  storeName: 'clothes.on',
  logoUrl: '', // URL ou imagem base64 da Logo do cliente
  heroType: 'runway', // 'runway' | 'rail' | 'editorial_banner' | 'split_minimal' | 'bento_grid'
  heroConfig: {
    banner: {
      tag: 'NEW COLLECTION · CONCRETE SEASON',
      title: 'SILHUETAS ESTRUTURADAS',
      subtitle: 'Tecidos densos de 260g/m², corte boxy contemporâneo e caimento impecável sem ruídos visuais.',
      buttonText: 'Explorar Coleção',
      imageUrl: '/images/looks/model_1.jpg',
    },
    split: {
      tag: 'DROP EXCLUSIVO · EDIÇÃO LIMITADA',
      title: 'HEAVYWEIGHT OVERSIZED TEE',
      subtitle: 'Desenvolvida com malha suedine 100% algodão penteado 260g/m². Gola canelada de 3cm que não laceia e silhueta relaxada que sustenta estrutura o dia inteiro.',
      price: 149.90,
      badge: '100% ALGODÃO 260G',
      buttonText: 'Garantir Peça',
      imageUrl: '/images/looks/model_2.jpg',
    },
    bento: {
      card1Title: 'DROP CONCRETE N° 01',
      card1Tag: 'LANÇAMENTO EXCLUSIVO',
      card1Category: 'todos',
      card1Image: '/images/looks/model_3.jpg',
      card2Title: 'CALÇAS & ALFAIATARIA',
      card2Tag: 'WIDE BARREL',
      card2Category: 'calcas',
      card2Image: '/images/looks/model_5.jpg',
      card3Title: 'CAMISETAS OVERSIZED',
      card3Tag: 'BESTSELLERS',
      card3Category: 'camisetas',
      card3Image: '/images/looks/model_4.jpg',
    },
  },
  themeMode: 'dual', // 'dual' (Comutador Sol/Lua ativo no topo) | 'single' (Fixo único na loja)
  defaultTheme: 'dark', // 'dark' | 'light' - Tema inicial do site
  darkPalette: 'onyx_industrial', // 'onyx_industrial' | 'midnight_minimal' | 'earth_noir' | 'concrete_monochrome'
  lightPalette: 'raw_canvas', // 'raw_canvas' | 'pure_studio' | 'nordic_fog' | 'sand_warm'
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
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      heroConfig: {
        ...DEFAULT_CONFIG.heroConfig,
        ...(parsed.heroConfig || {}),
        banner: { ...DEFAULT_CONFIG.heroConfig.banner, ...(parsed.heroConfig?.banner || {}) },
        split: { ...DEFAULT_CONFIG.heroConfig.split, ...(parsed.heroConfig?.split || {}) },
        bento: { ...DEFAULT_CONFIG.heroConfig.bento, ...(parsed.heroConfig?.bento || {}) },
      },
    };
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

// Helper para higienizar e garantir que os manequins nunca fiquem com fotos quebradas ou corrompidas
export function sanitizeLooks(looksArray) {
  if (!Array.isArray(looksArray) || looksArray.length === 0) return DEFAULT_LOOKS;
  return DEFAULT_LOOKS.map((defaultItem, idx) => {
    const item = looksArray[idx] || {};
    let modelImg = item.modelImage;
    if (typeof modelImg === 'string') {
      // Corrige qualquer link que usava .png para os modelos de estúdio em .jpg
      if (modelImg.startsWith('/images/looks/') && modelImg.endsWith('.png')) {
        modelImg = modelImg.replace('.png', '.jpg');
      }
    }
    const hasValidImage =
      typeof modelImg === 'string' &&
      modelImg.trim().length > 15 &&
      (modelImg.startsWith('data:image') || modelImg.startsWith('http') || modelImg.startsWith('/images/looks/'));

    return {
      ...defaultItem,
      ...item,
      modelImage: hasValidImage ? modelImg : defaultItem.modelImage,
      productIds: Array.isArray(item.productIds) && item.productIds.length > 0 ? item.productIds : defaultItem.productIds,
      pins: Array.isArray(item.pins) && item.pins.length > 0 ? item.pins : defaultItem.pins,
    };
  });
}

// Carrega os looks da passarela 3D com manequins
export function getStoredLooks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOOKS);
    if (!raw) return DEFAULT_LOOKS;
    const parsed = JSON.parse(raw);
    return sanitizeLooks(parsed);
  } catch {
    return DEFAULT_LOOKS;
  }
}

export function saveStoredLooks(looks) {
  try {
    const clean = sanitizeLooks(looks);
    localStorage.setItem(STORAGE_KEYS.LOOKS, JSON.stringify(clean));
  } catch (e) {
    console.error('Erro ao salvar looks:', e);
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
  localStorage.removeItem(STORAGE_KEYS.LOOKS);
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
      const { config, shirts, catalog, looks } = json.data;

      // Sincroniza localmente para carregar instantaneamente nos próximos acessos
      if (config) {
        if (config.storeName && config.storeName.toLowerCase() === 'levant') {
          config.storeName = 'clothes.on';
        }
        saveStoredConfig(config);
      }
      if (shirts && Array.isArray(shirts) && shirts.length > 0) saveStoredShirts(shirts);
      if (catalog && Array.isArray(catalog) && catalog.length > 0) saveStoredCatalog(catalog);
      const cleanLooks = looks && Array.isArray(looks) && looks.length > 0 ? sanitizeLooks(looks) : null;
      if (cleanLooks) saveStoredLooks(cleanLooks);

      return { config, shirts, catalog, looks: cleanLooks };
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

