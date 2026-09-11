/**
 * Biểu tượng và màu cho từng nhóm prompt.
 *
 * Bảng danh mục không có cột icon/màu, và 12 nhóm này là cố định nên khai ở
 * frontend là đủ — thêm cột vào CSDL chỉ để chứa hằng số là thừa.
 *
 * Khoá là slug đầy đủ trong CSDL (`prompt-viet-lach`). Slug phải mang tiền tố
 * "prompt-" vì slug danh mục là duy nhất toàn hệ thống, mà `seo`, `email`,
 * `chatbot`, `viet-lach`... đã bị các danh mục ứng dụng dùng trước.
 */
export interface PromptCatStyle {
  /** Đường vẽ SVG, dùng chung viewBox 24×24, nét 2px */
  d: string[]
  /** Màu nét */
  color: string
  /** Màu nền ô biểu tượng */
  bg: string
}

export const PROMPT_STYLES: Record<string, PromptCatStyle> = {
  'prompt-viet-lach': {
    d: ['M12 20h9', 'M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z'],
    color: '#2563EB', bg: '#E5EDFF',
  },
  'prompt-tao-anh': {
    d: ['M3 3h18v18H3z', 'M8.5 10.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z', 'M21 15l-5-5L5 21'],
    color: '#7C3AED', bg: '#EDE7FE',
  },
  'prompt-lam-video': {
    d: ['M23 7l-7 5 7 5V7z', 'M14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z'],
    color: '#E11D48', bg: '#FFE4EA',
  },
  'prompt-lap-trinh': {
    d: ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6'],
    color: '#059669', bg: '#D8F5EA',
  },
  'prompt-chatbot': {
    d: ['M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z'],
    color: '#0891B2', bg: '#D6F1F7',
  },
  'prompt-thuyet-trinh': {
    d: ['M2 3h20v12H2z', 'M12 15v6', 'M8 21h8'],
    color: '#4F46E5', bg: '#E4E4FD',
  },
  'prompt-seo': {
    d: ['M23 6l-9.5 9.5-5-5L1 18', 'M17 6h6v6'],
    color: '#EA580C', bg: '#FFE9D6',
  },
  'prompt-marketing': {
    d: ['M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z', 'M22 6l-10 7L2 6'],
    color: '#DB2777', bg: '#FDE3F0',
  },
  'prompt-phan-tich': {
    d: ['M18 20V10', 'M12 20V4', 'M6 20v-6'],
    color: '#0284C7', bg: '#DCEEFB',
  },
  'prompt-hoc-tap': {
    d: ['M22 10L12 5 2 10l10 5 10-5z', 'M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5'],
    color: '#7E22CE', bg: '#F1E3FC',
  },
  'prompt-cong-viec': {
    d: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11'],
    color: '#CA8A04', bg: '#FDF3D0',
  },
  'prompt-khac': {
    d: ['M5 12h.01', 'M12 12h.01', 'M19 12h.01'],
    color: '#64748B', bg: '#E9EDF3',
  },
}

export const PROMPT_FALLBACK: PromptCatStyle = PROMPT_STYLES['prompt-khac']

/** `prompt-viet-lach` → `viet-lach`, để URL công khai không lặp chữ prompt. */
export function shortSlug(slug: string): string {
  return slug.startsWith('prompt-') ? slug.slice('prompt-'.length) : slug
}

/** `viet-lach` → `prompt-viet-lach`, dùng khi tra ngược từ URL về CSDL. */
export function fullSlug(short: string): string {
  return short.startsWith('prompt-') ? short : `prompt-${short}`
}
