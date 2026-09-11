import { PROMPT_FALLBACK, PROMPT_STYLES } from './prompt-meta'

/**
 * Biểu tượng cho từng thẻ prompt trong trang nhóm.
 *
 * Bảng bài viết không có cột icon, và thêm một cột chỉ để chứa hằng số thì
 * thừa — nên suy từ tiêu đề, giống cách `intent-icons.ts` làm cho nhóm ứng
 * dụng. Không khớp từ khoá nào thì lùi về biểu tượng của cả nhóm, nên thẻ
 * luôn có hình chứ không bao giờ trống.
 */
const ICONS: Record<string, string[]> = {
  nguoi: ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2', 'M12 3a4 4 0 100 8 4 4 0 000-8z'],
  cong_viec: [
    'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z',
    'M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2',
  ],
  bieu_do: ['M6 20V11', 'M12 20V4', 'M18 20v-6'],
  mon_an: ['M4 3v8a3 3 0 003 3v7', 'M7 3v6', 'M17 3c-1.5 2-2 4-2 6s.5 3 2 3v9'],
  bo_cuc: ['M3 3h18v18H3z', 'M3 9h18', 'M9 21V9'],
  video: [
    'M23 7l-7 5 7 5V7z',
    'M14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z',
  ],
  san_pham: [
    'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
    'M3.27 6.96L12 12.01l8.73-5.05',
    'M12 22.08V12',
  ],
  thu: ['M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z', 'M22 6l-10 7L2 6'],
  slide: ['M2 3h20v14H2z', 'M8 21h8', 'M12 17v4'],
  ma_nguon: ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6'],
  tang_truong: ['M23 6l-9.5 9.5-5-5L1 18', 'M17 6h6v6'],
  hoc_tap: ['M22 10L12 5 2 10l10 5 10-5z', 'M6 12v5c3 3 9 3 12 0v-5'],
  tro_chuyen: [
    'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z',
  ],
  viet: ['M12 20h9', 'M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z'],
}

/** Từ khoá xuất hiện trong tiêu đề → biểu tượng. Xét theo đúng thứ tự này. */
const TU_KHOA: [string, keyof typeof ICONS][] = [
  ['thumbnail', 'video'],
  ['youtube', 'video'],
  ['video', 'video'],
  ['mon an', 'mon_an'],
  ['thuc don', 'mon_an'],
  ['am thuc', 'mon_an'],
  ['san pham', 'san_pham'],
  ['gian hang', 'san_pham'],
  ['bao bi', 'san_pham'],
  ['infographic', 'bieu_do'],
  ['so lieu', 'bieu_do'],
  ['bang tinh', 'bieu_do'],
  ['phan tich', 'bieu_do'],
  ['bieu do', 'bieu_do'],
  ['nghe nghiep', 'cong_viec'],
  ['ho so', 'cong_viec'],
  ['cong so', 'cong_viec'],
  ['doanh nhan', 'cong_viec'],
  ['bien ban', 'cong_viec'],
  ['chan dung', 'nguoi'],
  ['dai dien', 'nguoi'],
  ['bia bai dang', 'bo_cuc'],
  ['mang xa hoi', 'bo_cuc'],
  ['anh bia', 'bo_cuc'],
  ['email', 'thu'],
  ['thu dien tu', 'thu'],
  ['slide', 'slide'],
  ['thuyet trinh', 'slide'],
  ['trinh bay', 'slide'],
  ['ma nguon', 'ma_nguon'],
  ['lap trinh', 'ma_nguon'],
  ['code', 'ma_nguon'],
  ['seo', 'tang_truong'],
  ['tu khoa', 'tang_truong'],
  ['on tap', 'hoc_tap'],
  ['hoc', 'hoc_tap'],
  ['tieng anh', 'hoc_tap'],
  ['ra de', 'hoc_tap'],
  ['tin nhan', 'tro_chuyen'],
  ['tra loi', 'tro_chuyen'],
  ['tro ly', 'tro_chuyen'],
  ['chatbot', 'tro_chuyen'],
  ['hoi thoai', 'tro_chuyen'],
  ['viet', 'viet'],
  ['bai seo', 'viet'],
  ['noi dung', 'viet'],
]

/** Bỏ dấu tiếng Việt để so khớp không phụ thuộc cách gõ. */
function bo_dau(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
}

export function promptItemIcon(title: string, catSlug: string): string[] {
  const t = bo_dau(title)
  for (const [tu, ten] of TU_KHOA) {
    if (t.includes(tu)) return ICONS[ten]
  }
  return (PROMPT_STYLES[catSlug] ?? PROMPT_FALLBACK).d
}
