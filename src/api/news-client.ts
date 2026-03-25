const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  snippet: string;
  sourceName: string;
}

export interface NewsResponse {
  items: NewsItem[];
  fetchedAt: string;
}

export async function getBayAreaNews(): Promise<NewsResponse> {
  const url = new URL(`${BASE_URL}/news`, window.location.origin);
  const response = await fetch(url.toString());
  if (!response.ok) {
    const text = await response.text();
    let detail = response.statusText;
    try {
      const parsed = JSON.parse(text) as { error?: string };
      if (parsed.error) detail = parsed.error;
    } catch {
      /* use statusText */
    }
    throw new Error(`News request failed: ${response.status} ${detail}`);
  }
  return response.json() as Promise<NewsResponse>;
}
