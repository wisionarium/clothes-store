// Curadoria Editorial de Paletas de Cores Estratégicas
// Projetadas para moda streetwear & vestuário autoral contemporâneo

export const DARK_PALETTES = {
  onyx_industrial: {
    id: 'onyx_industrial',
    name: 'Onyx Industrial',
    description: 'Preto profundo e grafite com acentos em Laranja Industrial.',
    previewColors: ['#141518', '#202227', '#ff4d00'],
    accent: '#ff4d00',
    accentText: '#ffffff',
    vars: {
      '--app-bg': '#191b20',
      '--app-text': '#f4f5f7',
      '--header-bg': 'rgba(25, 27, 32, 0.92)',
      '--header-border': '#2d3038',
      '--card-bg': '#22242a',
      '--card-border': '#333742',
      '--spec-bg': '#1e2025',
      '--box-bg': '#272a31',
      '--app-accent': '#ff4d00',
      '--app-accent-hover': '#e04400',
    },
  },
  midnight_minimal: {
    id: 'midnight_minimal',
    name: 'Midnight Minimal',
    description: 'Azul noite profundo com acentos em Azul Cobalto Elétrico.',
    previewColors: ['#0d1117', '#161d27', '#3b82f6'],
    accent: '#3b82f6',
    accentText: '#ffffff',
    vars: {
      '--app-bg': '#0f141d',
      '--app-text': '#f0f4fc',
      '--header-bg': 'rgba(15, 20, 29, 0.92)',
      '--header-border': '#20293a',
      '--card-bg': '#171e2b',
      '--card-border': '#283449',
      '--spec-bg': '#131924',
      '--box-bg': '#1c2434',
      '--app-accent': '#3b82f6',
      '--app-accent-hover': '#2563eb',
    },
  },
  earth_noir: {
    id: 'earth_noir',
    name: 'Earth Noir',
    description: 'Carvão vegetal queimado com detalhes em Terracota e Argila.',
    previewColors: ['#161311', '#241f1c', '#ea580c'],
    accent: '#ea580c',
    accentText: '#ffffff',
    vars: {
      '--app-bg': '#181512',
      '--app-text': '#f7f3ee',
      '--header-bg': 'rgba(24, 21, 18, 0.92)',
      '--header-border': '#332b24',
      '--card-bg': '#221d19',
      '--card-border': '#3b322a',
      '--spec-bg': '#1c1815',
      '--box-bg': '#29231e',
      '--app-accent': '#ea580c',
      '--app-accent-hover': '#c2410c',
    },
  },
  concrete_monochrome: {
    id: 'concrete_monochrome',
    name: 'Concrete Monochrome',
    description: '100% Neutro: Cimento urbano, grafite e detalhes em Branco Puro.',
    previewColors: ['#161718', '#242629', '#f4f5f7'],
    accent: '#f4f5f7',
    accentText: '#18181b',
    vars: {
      '--app-bg': '#1a1b1d',
      '--app-text': '#f4f5f7',
      '--header-bg': 'rgba(26, 27, 29, 0.92)',
      '--header-border': '#32353a',
      '--card-bg': '#232528',
      '--card-border': '#393c42',
      '--spec-bg': '#1e2022',
      '--box-bg': '#2b2d31',
      '--app-accent': '#f4f5f7',
      '--app-accent-hover': '#e4e5e7',
    },
  },
};

export const LIGHT_PALETTES = {
  raw_canvas: {
    id: 'raw_canvas',
    name: 'Raw Canvas',
    description: 'Algodão cru, linho natural lavado e detalhes industriais.',
    previewColors: ['#f4f3ed', '#eae7df', '#ff4d00'],
    accent: '#ff4d00',
    accentText: '#ffffff',
    vars: {
      '--app-bg': '#f5f4ee',
      '--app-text': '#18181b',
      '--header-bg': 'rgba(245, 244, 238, 0.92)',
      '--header-border': '#e4e1d7',
      '--card-bg': '#ebe8df',
      '--card-border': '#dad5c7',
      '--spec-bg': '#f0ede4',
      '--box-bg': '#ffffff',
      '--app-accent': '#ff4d00',
      '--app-accent-hover': '#e04400',
    },
  },
  pure_studio: {
    id: 'pure_studio',
    name: 'Pure Studio',
    description: 'Branco puro galeria de arte com tipografia e acentos em Preto Sólido.',
    previewColors: ['#ffffff', '#f4f4f5', '#18181b'],
    accent: '#18181b',
    accentText: '#ffffff',
    vars: {
      '--app-bg': '#ffffff',
      '--app-text': '#09090b',
      '--header-bg': 'rgba(255, 255, 255, 0.92)',
      '--header-border': '#e4e4e7',
      '--card-bg': '#f4f4f5',
      '--card-border': '#e4e4e7',
      '--spec-bg': '#fafafa',
      '--box-bg': '#ffffff',
      '--app-accent': '#18181b',
      '--app-accent-hover': '#27272a',
    },
  },
  nordic_fog: {
    id: 'nordic_fog',
    name: 'Nordic Fog',
    description: 'Cinza perolado escandinavo com toques em Azul Cobalto frio.',
    previewColors: ['#f1f3f5', '#e4e7eb', '#2563eb'],
    accent: '#2563eb',
    accentText: '#ffffff',
    vars: {
      '--app-bg': '#f2f4f7',
      '--app-text': '#111827',
      '--header-bg': 'rgba(242, 244, 247, 0.92)',
      '--header-border': '#d8dde4',
      '--card-bg': '#e6eaf0',
      '--card-border': '#d0d7e2',
      '--spec-bg': '#edf0f5',
      '--box-bg': '#ffffff',
      '--app-accent': '#2563eb',
      '--app-accent-hover': '#1d4ed8',
    },
  },
  sand_warm: {
    id: 'sand_warm',
    name: 'Sand Warm',
    description: 'Tons de areia do deserto, linho bege e marrom expresso.',
    previewColors: ['#ede8df', '#dfd8cc', '#854d0e'],
    accent: '#854d0e',
    accentText: '#ffffff',
    vars: {
      '--app-bg': '#eee9e0',
      '--app-text': '#292524',
      '--header-bg': 'rgba(238, 233, 224, 0.92)',
      '--header-border': '#ded6c7',
      '--card-bg': '#e3dbcd',
      '--card-border': '#d3c9b7',
      '--spec-bg': '#eae3d6',
      '--box-bg': '#faf7f2',
      '--app-accent': '#854d0e',
      '--app-accent-hover': '#713f12',
    },
  },
};

// Aplica as variáveis CSS correspondentes da paleta ao documento
export function applyThemeVariables(isDark, paletteId) {
  if (typeof document === 'undefined') return;
  const palettes = isDark ? DARK_PALETTES : LIGHT_PALETTES;
  const fallbackKey = isDark ? 'onyx_industrial' : 'raw_canvas';
  const palette = palettes[paletteId] || palettes[fallbackKey];

  if (!palette) return;

  const root = document.documentElement;
  Object.entries(palette.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}
