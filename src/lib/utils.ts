import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

const HTML_ENTITIES: Record<string, string> = {
  '&lt;':     '<',
  '&gt;':     '>',
  '&amp;':    '&',
  '&quot;':   '"',
  '&apos;':   "'",
  '&#39;':    "'",
  '&nbsp;':   ' ',
  '&ndash;':  '–',
  '&mdash;':  '—',
  '&laquo;':  '«',
  '&raquo;':  '»',
  '&hellip;': '…',
  '&copy;':   '©',
  '&reg;':    '®',
  '&trade;':  '™',
  '&euro;':   '€',
  '&pound;':  '£',
  '&yen;':    '¥',
  '&cent;':   '¢',
  '&times;':  '×',
  '&divide;': '÷',
  '&plusmn;': '±',
  '&frac12;': '½',
  '&frac14;': '¼',
  '&frac34;': '¾',
  '&lsquo;':  '\u2018',
  '&rsquo;':  '\u2019',
  '&ldquo;':  '\u201C',
  '&rdquo;':  '\u201D',
  '&bull;':   '•',
  '&middot;': '·',
  '&acute;':  '´',
  '&uml;':    '¨',
};

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/\\"/g, '"')
    .replace(/&[a-zA-Z]+;/g, (match: string): string => HTML_ENTITIES[match] ?? match)
    .replace(/&#(\d+);/g, (_: string, code: string): string => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_: string, hex: string): string => String.fromCharCode(parseInt(hex, 16)));
}

function unwrapSpuriousParagraphs(html: string): string {
  // <p> chỉ chứa 1 HTML tag (không phải text content) → bỏ <p>...</p>
  // Ví dụ: <p>  <blockquote class="...">  </p> → <blockquote class="...">
  return html
    // Unwrap <p> bọc quanh block-level opening tags
    .replace(/<p>\s*(<(?:blockquote|div|section|article|ul|ol|li|table|thead|tbody|tr|td|th|h[1-6]|figure|figcaption|pre|details|summary)[^>]*>)\s*<\/p>/gi, '$1')
    // Unwrap <p> bọc quanh block-level closing tags
    .replace(/<p>\s*(<\/(?:blockquote|div|section|article|ul|ol|li|table|thead|tbody|tr|td|th|h[1-6]|figure|figcaption|pre|details|summary)>)\s*<\/p>/gi, '$1')
    // Unwrap <p> chỉ chứa attributes tiếp nối (fragment của tag bị xuống dòng)
    .replace(/<p>\s*((?:[a-zA-Z-]+=(?:"[^"]*"|'[^']*')[\s]*)+>?)\s*<\/p>/gi, ' $1');
}

export function decodeHtmlContent(encodedStr: string): string {
  let decoded = encodedStr;
  let prev = '';
  while (prev !== decoded) {
    prev = decoded;
    decoded = decodeHtmlEntities(decoded);
  }

  decoded = unwrapSpuriousParagraphs(decoded);

  return decoded;
}

export function buildTree<T extends { id: number; parentId?: number | null; children?: T[] | null }>(items: T[]): T[] {
  const map = new Map<number, T>()
  const roots: T[] = []

  // Clone để không mutate data gốc
  items.forEach(item => map.set(item.id, { ...item, children: [] }))

  map.forEach(item => {
    if (!item.parentId) {
      roots.push(item)
    } else {
      const parent = map.get(item.parentId)
      if (parent) {
        parent.children = [...(parent.children ?? []), item]
      }
    }
  })

  return roots
}