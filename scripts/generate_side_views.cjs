const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PRODUCTS = [
  { key: 'green', name: 'green_front.png', outSide: 'green_side.png', bg: [235, 234, 229] },
  { key: 'black', name: 'black_front.png', outSide: 'black_side.png', bg: [235, 234, 229] },
  { key: 'blue', name: 'blue_front.png', outSide: 'blue_side.png', bg: [235, 234, 229] },
  { key: 'mint', name: 'mint_front.png', outSide: 'mint_side.png', bg: [235, 234, 229] },
];

const PROD_DIR = path.join(__dirname, '../public/images/products');

async function processProduct(p) {
  const inputPath = path.join(PROD_DIR, p.name);
  const outSidePath = path.join(PROD_DIR, p.outSide);

  // Carrega a imagem original
  const image = sharp(inputPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  const W = info.width;
  const H = info.height;
  const channels = info.channels;

  // Encontra a bounding box da camiseta
  let minX = W, maxX = 0, minY = H, maxY = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * channels;
      const diff = Math.abs(data[idx] - p.bg[0]) + Math.abs(data[idx+1] - p.bg[1]) + Math.abs(data[idx+2] - p.bg[2]);
      if (diff > 22) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`[${p.key}] Bounding box:`, { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY });

  // Para a visão de lado:
  // Uma camiseta pendurada de lado exibe o ombro, a dobra da manga suspensa e a lateral do corpo.
  // Vamos extrair a lateral esquerda (onde está a manga e costura lateral)
  // Largura da visão de perfil: ~140px, altura: mesma altura da camiseta (minY até maxY)
  const sideWidth = 145;
  const cropX = minX;
  const cropW = Math.min(220, maxX - minX);
  const cropH = maxY - minY + 30;
  const cropY = Math.max(0, minY - 10);

  // Recorta a lateral real da peça
  const sideCrop = await sharp(inputPath)
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .resize(sideWidth, cropH, { fit: 'fill' })
    .toBuffer();

  // Cria uma máscara / gradiente de sombreamento de perfil:
  // O lado direito da dobra fica mais sombreado (profundidade da arara)
  // O lado esquerdo recebe luz direta
  const shadowSvg = Buffer.from(`
    <svg width="${sideWidth}" height="${cropH}">
      <defs>
        <linearGradient id="foldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.1" />
          <stop offset="60%" stop-color="#000000" stop-opacity="0.0" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.45" />
        </linearGradient>
      </defs>
      <rect width="${sideWidth}" height="${cropH}" fill="url(#foldGrad)" />
      <!-- Borda lateral suave -->
      <line x1="${sideWidth - 1}" y1="0" x2="${sideWidth - 1}" y2="${cropH}" stroke="rgba(0,0,0,0.3)" stroke-width="2" />
    </svg>
  `);

  // Combina o recorte da lateral com o sombreamento de dobra
  const finalSideBuffer = await sharp(sideCrop)
    .composite([
      { input: shadowSvg, blend: 'multiply' }
    ])
    .png()
    .toBuffer();

  // Agora vamos montar o canvas vertical completo com o fundo de estúdio suave (563x845)
  // posicionando a camiseta de perfil centralizada no eixo X
  const targetW = 200; // imagem de perfil compacta perfeita para o trilho
  const targetH = 845;

  const bgSvg = Buffer.from(`
    <svg width="${targetW}" height="${targetH}">
      <rect width="${targetW}" height="${targetH}" fill="rgb(${p.bg[0]}, ${p.bg[1]}, ${p.bg[2]})" />
    </svg>
  `);

  await sharp(bgSvg)
    .composite([
      {
        input: finalSideBuffer,
        left: Math.floor((targetW - sideWidth) / 2),
        top: cropY
      }
    ])
    .png()
    .toFile(outSidePath);

  console.log(`[${p.key}] Saved ${p.outSide}`);
}

async function run() {
  for (const p of PRODUCTS) {
    await processProduct(p);
  }
  console.log('All side views generated successfully!');
}

run().catch(console.error);

