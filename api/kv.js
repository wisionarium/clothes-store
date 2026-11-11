// Serverless Function Vercel - Ponte Direta com Cloudflare KV (Banco de Dados Serverless)
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_KV_NAMESPACE_ID = process.env.CF_KV_NAMESPACE_ID;
const CF_API_TOKEN = process.env.CF_API_TOKEN;

const CF_KV_BASE = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE_ID}`;

// Helper para ler chave do Cloudflare KV
async function getKvValue(key) {
  try {
    const res = await fetch(`${CF_KV_BASE}/values/${key}`, {
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
      },
    });

    if (res.status === 404) return null;
    if (!res.ok) {
      console.error(`Erro ao ler chave ${key} do KV:`, res.status);
      return null;
    }

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (err) {
    console.error(`Exceção ao ler chave ${key}:`, err);
    return null;
  }
}

// Helper para salvar chave no Cloudflare KV
async function putKvValue(key, value) {
  const bodyData = typeof value === 'string' ? value : JSON.stringify(value);
  const res = await fetch(`${CF_KV_BASE}/values/${key}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: bodyData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Falha ao gravar no Cloudflare KV (${res.status}): ${errText}`);
  }

  return true;
}

export default async function handler(req, res) {
  // Configuração CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 1. LEITURA (GET)
    if (req.method === 'GET') {
      const { key = 'all' } = req.query;

      if (key === 'all') {
        // Busca paralela no Cloudflare KV
        const [config, shirts, catalog] = await Promise.all([
          getKvValue('clothes_on_config'),
          getKvValue('clothes_on_shirts'),
          getKvValue('clothes_on_catalog'),
        ]);

        return res.status(200).json({
          success: true,
          source: 'cloudflare_kv',
          data: {
            config,
            shirts,
            catalog,
          },
        });
      }

      const singleValue = await getKvValue(key);
      return res.status(200).json({
        success: true,
        source: 'cloudflare_kv',
        key,
        value: singleValue,
      });
    }

    // 2. GRAVAÇÃO (POST / PUT)
    if (req.method === 'POST' || req.method === 'PUT') {
      const payload = req.body || {};

      // Gravação em lote (config + shirts + catalog)
      const promises = [];

      if (payload.config !== undefined) {
        promises.push(putKvValue('clothes_on_config', payload.config));
      }
      if (payload.shirts !== undefined) {
        promises.push(putKvValue('clothes_on_shirts', payload.shirts));
      }
      if (payload.catalog !== undefined) {
        promises.push(putKvValue('clothes_on_catalog', payload.catalog));
      }

      // Se passou { key, value } individual
      if (payload.key && payload.value !== undefined) {
        promises.push(putKvValue(payload.key, payload.value));
      }

      if (promises.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Nenhum dado informado para gravação.',
        });
      }

      await Promise.all(promises);

      return res.status(200).json({
        success: true,
        source: 'cloudflare_kv',
        message: 'Dados persistidos com sucesso no Cloudflare KV!',
      });
    }

    return res.status(405).json({ success: false, error: 'Método não permitido.' });
  } catch (error) {
    console.error('Erro na API KV:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao comunicar com Cloudflare KV.',
      details: error.message,
    });
  }
}
