// Catálogo Curado de Looks de Passarela 3D (Shop the Look)
// Cada look é composto por peças reais da loja (Camisas da Arara + Calças/Bermudas/Casacos)

export const DEFAULT_LOOKS = [
  {
    id: 'look_01',
    number: '01',
    name: 'The City Suit',
    category: 'Drop 01 · Alfaiataria Urbana',
    description: 'Sobreposição contemporânea unindo o caimento solto da alfaiataria pregueada ao conforto do moletom estruturado.',
    modelImage: '/images/looks/model_1.png',
    bgTone: '#e5e7eb',
    productIds: [108, 102, 1], // Casaco Pullover + Calça Alfaiataria + Slab Tee
    pins: [
      { id: 'p1', x: 50, y: 32, productId: 108, label: 'Casaco Pullover Half-Zip', part: 'superior' },
      { id: 'p2', x: 52, y: 68, productId: 102, label: 'Calça Alfaiataria Pleated', part: 'inferior' },
    ],
  },
  {
    id: 'look_02',
    number: '02',
    name: 'Studio Canvas Day',
    category: 'Drop 01 · Workwear Utilitário',
    description: 'Jaqueta em lona de alta gramatura sobre jeans de silhueta ampla barrel leg.',
    modelImage: '/images/looks/model_2.png',
    bgTone: '#e2e8f0',
    productIds: [106, 101, 7], // Jaqueta Canvas + Calça Jeans Wide + Camiseta Heavy Noir
    pins: [
      { id: 'p1', x: 48, y: 35, productId: 106, label: 'Jaqueta Overshirt Canvas', part: 'superior' },
      { id: 'p2', x: 50, y: 70, productId: 101, label: 'Calça Jeans Wide Barrel', part: 'inferior' },
    ],
  },
  {
    id: 'look_03',
    number: '03',
    name: 'Onyx Monochrome',
    category: 'Drop 02 · Boxy Estruturado',
    description: 'Blazer transpassado sem forro rígido com camiseta de algodão pesado em caimento geométrico.',
    modelImage: '/images/looks/model_3.png',
    bgTone: '#d1d5db',
    productIds: [105, 102, 7], // Blazer + Calça Alfaiataria + Heavy Noir
    pins: [
      { id: 'p1', x: 48, y: 36, productId: 105, label: 'Blazer Double-Breasted Boxy', part: 'superior' },
      { id: 'p2', x: 52, y: 68, productId: 102, label: 'Calça Alfaiataria Pleated', part: 'inferior' },
    ],
  },
  {
    id: 'look_04',
    number: '04',
    name: 'Heavy Boxy Navy',
    category: 'Drop 02 · Street Essentials',
    description: 'Camiseta encorpada 260gsm azul marinho com calça carpenter de sarja crua 100% algodão.',
    modelImage: '/images/looks/model_4.png',
    bgTone: '#e0e7ff',
    productIds: [2, 107], // Port Soléa + Calça Carpenter
    pins: [
      { id: 'p1', x: 50, y: 38, productId: 2, label: 'Port Soléa · Deep Navy', part: 'superior' },
      { id: 'p2', x: 50, y: 72, productId: 107, label: 'Calça Carpenter Workwear', part: 'inferior' },
    ],
  },
  {
    id: 'look_05',
    number: '05',
    name: 'Field Cargo Drop',
    category: 'Drop 03 · Silhueta Relaxada',
    description: 'Bermuda utilitária com bolsos sanfonados e camiseta verde militar em ribana 2x1 reforçada.',
    modelImage: '/images/looks/model_5.png',
    bgTone: '#ecfdf5',
    productIds: [3, 103], // Field Utility + Bermuda Cargo
    pins: [
      { id: 'p1', x: 50, y: 38, productId: 3, label: 'Field Utility · Olive Moss', part: 'superior' },
      { id: 'p2', x: 50, y: 64, productId: 103, label: 'Bermuda Cargo Heavy Canvas', part: 'inferior' },
    ],
  },
  {
    id: 'look_06',
    number: '06',
    name: 'Washed Concrete',
    category: 'Drop 03 · Pura Forma',
    description: 'Estética brutalista: tons de cinza lavado com bermuda em moletom pesado felpado.',
    modelImage: '/images/looks/model_6.png',
    bgTone: '#f3f4f6',
    productIds: [4, 104], // Raw Concrete + Bermuda French Terry
    pins: [
      { id: 'p1', x: 50, y: 38, productId: 4, label: 'Raw Concrete · Washed Gray', part: 'superior' },
      { id: 'p2', x: 50, y: 64, productId: 104, label: 'Bermuda French Terry Sweat', part: 'inferior' },
    ],
  },
];
