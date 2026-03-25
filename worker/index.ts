const BART_BASE = 'https://api.bart.gov/api';
const API_KEY = 'MW9S-E7SL-26DU-VV8V';

const CACHE_TTLS: Record<string, number> = {
  etd: 15,
  bsa: 60,
  stn: 3600,
  route: 3600,
};

const NEWS_CACHE_SECONDS = 300;
const NEWS_ITEM_LIMIT = 10;
/** Plain-text preview cap (RSS blurbs are short; this avoids mid-word cuts where the feed allows more). */
const NEWS_SNIPPET_MAX_CHARS = 1200;
const NEWS_RSS_URLS = [
  'https://news.google.com/rss/search?q=BART+OR+%22Bay+Area+Rapid+Transit%22+OR+%22San+Francisco+Bay%22+transit&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=%22Bay+Area%22+%28BART+OR+ferry+OR+Caltrain%29&hl=en-US&gl=US&ceid=US:en',
] as const;

const CORS_HEADERS: HeadersInit = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

interface ParsedNewsItem {
  title: string;
  link: string;
  pubDate: string;
  snippet: string;
  sourceName: string;
}

function decodeBasicEntitiesOnce(text: string): string {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function decodeEntitiesDeep(text: string): string {
  let s = text;
  for (let pass = 0; pass < 8; pass += 1) {
    const next = decodeBasicEntitiesOnce(s);
    if (next === s) break;
    s = next;
  }
  return s;
}

/** Strip broken or legacy font/color fragments RSS sometimes leaves after tag removal. */
function stripResidualMarkup(s: string): string {
  return s
    .replace(/\bfont\s+color\s*=\s*"[^"]*"/gi, ' ')
    .replace(/\bfont\s+color\s*=\s*'[^']*'/gi, ' ')
    .replace(/\bfont\s+color\s*=\s*\S+/gi, ' ')
    .replace(/\bcolor\s*=\s*"[^"]*"/gi, ' ')
    .replace(/\bcolor\s*=\s*'[^']*'/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function stripHtml(html: string): string {
  let s = decodeEntitiesDeep(html);
  for (let i = 0; i < 8; i += 1) {
    s = s.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1');
  }
  s = s.replace(/<(?:font|span|div|p|b|i|strong|em)\b[^>]*>/gi, ' ');
  s = s.replace(/<\/(?:font|span|div|p|b|i|strong|em)>/gi, ' ');
  s = s.replace(/<[^>]+>/g, ' ');
  s = s.replace(/[<>]/g, ' ');
  s = stripResidualMarkup(s);
  return s.replace(/\s+/g, ' ').trim();
}

function truncatePreview(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const slice = t.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  if (lastSpace >= Math.floor(max * 0.55)) {
    return `${slice.slice(0, lastSpace)}…`;
  }
  return `${slice}…`;
}

function extractInnerXml(block: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = block.match(re);
  if (!m) return '';
  let inner = m[1].trim();
  const cdata = inner.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  if (cdata) inner = cdata[1].trim();
  return inner;
}

function parseRssItems(xml: string): ParsedNewsItem[] {
  const items: ParsedNewsItem[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/gi;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml)) !== null) {
    const chunk = m[1];
    const title = stripHtml(extractInnerXml(chunk, 'title'));
    const link = extractInnerXml(chunk, 'link').trim();
    const pubDate = extractInnerXml(chunk, 'pubDate').trim();
    const rawDesc = extractInnerXml(chunk, 'description');
    const rawEncoded = extractInnerXml(chunk, 'content:encoded');
    const fromDesc = stripHtml(rawDesc);
    const fromEncoded = stripHtml(rawEncoded);
    const merged = fromEncoded.length > fromDesc.length ? fromEncoded : fromDesc;
    const snippet = truncatePreview(merged, NEWS_SNIPPET_MAX_CHARS);
    const sourceChunk = extractInnerXml(chunk, 'source');
    const sourceName = stripHtml(sourceChunk);

    if (title && link) {
      items.push({ title, link, pubDate, snippet, sourceName });
    }
  }
  return items;
}

function mergeNewsItems(batches: ParsedNewsItem[][]): ParsedNewsItem[] {
  const seen = new Set<string>();
  const out: ParsedNewsItem[] = [];
  for (const batch of batches) {
    for (const item of batch) {
      if (seen.has(item.link)) continue;
      seen.add(item.link);
      out.push(item);
      if (out.length >= NEWS_ITEM_LIMIT) return out;
    }
  }
  return out;
}

async function fetchNewsJson(): Promise<{ items: ParsedNewsItem[]; fetchedAt: string }> {
  const results = await Promise.all(
    NEWS_RSS_URLS.map(async (rssUrl) => {
      const res = await fetch(rssUrl, {
        headers: {
          Accept: 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
          'User-Agent': 'BART-Tracker/1.0',
        },
      });
      if (!res.ok) {
        throw new Error(`RSS fetch failed: ${res.status}`);
      }
      const xml = await res.text();
      return parseRssItems(xml);
    }),
  );

  const items = mergeNewsItems(results);
  return { items, fetchedAt: new Date().toISOString() };
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const pathParts = url.pathname.replace(/^\/api\//, '').split('/');
    const endpoint = pathParts[0];

    if (endpoint === 'news') {
      const cache = caches.default;
      const cacheKey = new Request(request.url, { method: 'GET' });
      const cached = await cache.match(cacheKey);
      if (cached) {
        return cached;
      }

      try {
        const payload = await fetchNewsJson();
        const body = JSON.stringify(payload);
        const response = new Response(body, {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
            'Cache-Control': `public, max-age=${NEWS_CACHE_SECONDS}`,
          },
        });
        await cache.put(cacheKey, response.clone());
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return new Response(JSON.stringify({ error: message }), {
          status: 502,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }
    }

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
