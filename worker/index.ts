const BART_BASE = 'https://api.bart.gov/api';
const API_KEY = 'MW9S-E7SL-26DU-VV8V';

const CACHE_TTLS: Record<string, number> = {
  etd: 15,
  bsa: 60,
  count: 30,
  elev: 120,
  stn: 3600,
  route: 3600,
};

const CORS_HEADERS: HeadersInit = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const pathParts = url.pathname.replace(/^\/api\//, '').split('/');
    const endpoint = pathParts[0];

    if (!endpoint || !CACHE_TTLS[endpoint]) {
      return new Response(JSON.stringify({ error: 'Unknown endpoint' }), {
        status: 404,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const cache = caches.default;
    const cacheKey = new Request(request.url, { method: 'GET' });
    const cached = await cache.match(cacheKey);
    if (cached) {
      return cached;
    }

    const bartUrl = new URL(`${BART_BASE}/${endpoint}.aspx`);
    bartUrl.searchParams.set('key', API_KEY);
    bartUrl.searchParams.set('json', 'y');

    for (const [key, value] of url.searchParams.entries()) {
      if (key !== 'key' && key !== 'json') {
        bartUrl.searchParams.set(key, value);
      }
    }

    try {
      const bartResponse = await fetch(bartUrl.toString());
      const body = await bartResponse.text();
      const ttl = CACHE_TTLS[endpoint] ?? 30;

      const response = new Response(body, {
        status: bartResponse.status,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json',
          'Cache-Control': `public, max-age=${ttl}`,
        },
      });

      const responseToCache = response.clone();
      await cache.put(cacheKey, responseToCache);

      return response;
    } catch {
      return new Response(JSON.stringify({ error: 'Failed to fetch from BART API' }), {
        status: 502,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
  },
};
