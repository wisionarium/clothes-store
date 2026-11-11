// Serverless Function Vercel - Ponte Oficial com API da Nuvemshop
export default async function handler(req, res) {
  // Configuração de CORS para permitir requisições do frontend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { action = 'get_products', storeId, token, storeUrl, items } = req.method === 'POST' ? req.body : req.query;

    if (!storeId || !token) {
      return res.status(400).json({
        success: false,
        error: 'Credenciais incompletas: informe storeId e token da Nuvemshop.',
      });
    }

    const cleanStoreId = String(storeId).trim().replace(/\D/g, '');
    const cleanToken = String(token).trim();

    // 1. TESTAR CONEXÃO COM A LOJA
    if (action === 'test_connection') {
      const checkRes = await fetch(`https://api.tiendanube.com/v1/${cleanStoreId}/products?per_page=1`, {
        headers: {
          'Authentication': `bearer ${cleanToken}`,
          'User-Agent': 'Levant Store Engine (contato@levant.com.br)',
          'Content-Type': 'application/json',
        },
      });

      if (!checkRes.ok) {
        const errorText = await checkRes.text();
        return res.status(checkRes.status).json({
          success: false,
          error: `Falha na autenticação da Nuvemshop (${checkRes.status}): verifique o ID e o Token de acesso.`,
          details: errorText,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Conexão com a Nuvemshop estabelecida com sucesso!',
      });
    }

    // 2. BUSCAR TODOS OS PRODUTOS DA NUVEMSHOP (ROUPAS & ACESSÓRIOS)
    if (action === 'get_products') {
      const nuvemRes = await fetch(`https://api.tiendanube.com/v1/${cleanStoreId}/products?per_page=50`, {
        headers: {
          'Authentication': `bearer ${cleanToken}`,
          'User-Agent': 'Levant Store Engine (contato@levant.com.br)',
          'Content-Type': 'application/json',
        },
      });

      if (!nuvemRes.ok) {
        const errorText = await nuvemRes.text();
        return res.status(nuvemRes.status).json({
          success: false,
          error: `Erro ao buscar produtos na Nuvemshop (${nuvemRes.status})`,
          details: errorText,
        });
      }

      const rawProducts = await nuvemRes.json();

      // Mapeamento Inteligente para a Vitrine Levant
      const mappedProducts = (Array.isArray(rawProducts) ? rawProducts : []).map((item) => {
        const name = item.name?.pt || item.name?.es || (typeof item.name === 'string' ? item.name : 'Peça Levant');
        const rawPrice = parseFloat(item.variants?.[0]?.price || item.price || 0);
        const promotionalPrice = parseFloat(item.variants?.[0]?.promotional_price || item.promotional_price || 0);
        const finalPrice = promotionalPrice > 0 && promotionalPrice < rawPrice ? promotionalPrice : rawPrice;

        // Badge de promoção ou novidade
        let tag = null;
        if (promotionalPrice > 0 && promotionalPrice < rawPrice) {
          const discountPct = Math.round(((rawPrice - promotionalPrice) / rawPrice) * 100);
          tag = `${discountPct}% OFF`;
        } else if (item.created_at && Date.now() - new Date(item.created_at).getTime() < 30 * 24 * 60 * 60 * 1000) {
          tag = 'Novo';
        }

        // Imagens do produto
        const images = (item.images || []).map((img) => img.src);
        const mainImage = images[0] || '';

        // Classificação inteligente de categoria para Roupas & Acessórios
        let category = 'vestuario';
        let categoryLabel = 'Vestuário';
        const lowerName = name.toLowerCase();

        if (/cal[çc]a|jeans|pantalona/i.test(lowerName)) {
          category = 'calcas';
          categoryLabel = 'Calças & Jeans';
        } else if (/bermuda|short/i.test(lowerName)) {
          category = 'bermudas';
          categoryLabel = 'Bermudas & Shorts';
        } else if (/casaco|jaqueta|blazer|moletom|hoodie|cardigan/i.test(lowerName)) {
          category = 'casacos';
          categoryLabel = 'Casacos & Jaquetas';
        } else if (/camisa|camiseta|tee|cropped|regata|polo/i.test(lowerName)) {
          category = 'camisetas';
          categoryLabel = 'Camisetas';
        } else if (/bon[eé]|gorro|cinto|bolsa|bag|meia|acess[oó]rio|carteira|corrente|shoulder/i.test(lowerName)) {
          category = 'acessorios';
          categoryLabel = 'Acessórios';
        }

        // Variantes de Tamanho e Cor da Nuvemshop
        const sizes = [];
        const colors = [];
        (item.variants || []).forEach((v) => {
          (v.values || []).forEach((val) => {
            const valStr = val.pt || val.es || (typeof val === 'string' ? val : '');
            if (/^(P|M|G|GG|XG|XGG|PP|3[6-9]|4[0-9]|5[0-2])$/i.test(valStr.trim())) {
              const upper = valStr.trim().toUpperCase();
              if (!sizes.includes(upper)) sizes.push(upper);
            } else if (valStr) {
              const cleanColor = valStr.trim();
              if (!colors.includes(cleanColor)) colors.push(cleanColor);
            }
          });
        });

        // Limpeza de descrição
        const rawDesc = item.description?.pt || item.description?.es || '';
        const cleanDesc = rawDesc.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();

        return {
          id: item.id,
          nuvemshopId: item.id,
          name,
          category,
          categoryLabel,
          price: finalPrice,
          originalPrice: promotionalPrice > 0 ? rawPrice : null,
          tag,
          image: mainImage,
          images: images.length > 0 ? images : [mainImage],
          colors: colors.length > 0 ? colors : ['Padrão'],
          sizes: sizes.length > 0 ? sizes : (category === 'calcas' || category === 'bermudas' ? ['38', '40', '42', '44'] : ['P', 'M', 'G', 'GG']),
          description: cleanDesc || 'Peça autêntica desenvolvida com tecidos selecionados e acabamento de alto padrão Levant.',
          handle: item.handle?.pt || item.handle || '',
          nuvemshopUrl: item.canonical_url || '',
          stock: item.variants?.[0]?.stock ?? 10,
          variants: (item.variants || []).map((v) => ({
            id: v.id,
            price: parseFloat(v.price),
            promotional_price: v.promotional_price ? parseFloat(v.promotional_price) : null,
            stock: v.stock,
            sku: v.sku,
            values: v.values,
          })),
        };
      });

      return res.status(200).json({
        success: true,
        count: mappedProducts.length,
        products: mappedProducts,
      });
    }

    // 3. GERAR LINK DO CARRINHO DIRETO DA NUVEMSHOP (COM PRODUTOS E QUANTIDADES)
    if (action === 'build_cart_url') {
      if (!storeUrl) {
        return res.status(400).json({ success: false, error: 'storeUrl não fornecido.' });
      }

      const cleanStoreUrl = storeUrl.startsWith('http') ? storeUrl : `https://${storeUrl}`;
      // Formato oficial da Nuvemshop para adicionar variantes diretamente ao carrinho:
      // https://sua-loja.com.br/cart/add/{variant_id}:{quantity},{variant_id_2}:{quantity_2}
      const cartParams = (items || [])
        .map((item) => {
          const variantId = item.variants?.[0]?.id || item.nuvemshopId || item.id;
          return `${variantId}:${item.quantity || 1}`;
        })
        .join(',');

      const finalCartUrl = `${cleanStoreUrl.replace(/\/$/, '')}/cart/add/${cartParams}`;

      return res.status(200).json({
        success: true,
        cartUrl: finalCartUrl,
      });
    }

    return res.status(400).json({ success: false, error: 'Ação não reconhecida.' });
  } catch (error) {
    console.error('Erro na rota nuvemshop:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao processar requisição da Nuvemshop.',
      message: error.message,
    });
  }
}
