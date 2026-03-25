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

/**
 * Plain text for RSS/HTML snippets (defense in depth if the API returns markup).
 */
export function plainNewsSnippet(raw: string): string {
  if (!raw) return '';
  let s = raw.trim();
  for (let pass = 0; pass < 8; pass += 1) {
    const next = s
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
    if (next === s) break;
    s = next;
  }
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

export function isUsableSnippet(text: string): boolean {
  if (!text) return false;
  if (text.length < 24) return false;
  if (/[<>]/.test(text)) return false;
  if (/\bhref\s*=/i.test(text)) return false;
  if (/\bcolor\s*=/i.test(text)) return false;
  if (/\bfont\s+color\b/i.test(text)) return false;
  return true;
}
