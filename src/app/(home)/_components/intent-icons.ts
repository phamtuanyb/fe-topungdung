/**
 * Biểu tượng cho 7 nhóm ứng dụng cấp 2.
 *
 * Khoá là slug danh mục nên đổi tên nhóm trong admin cũng không ảnh hưởng.
 * Để riêng một tệp vì cả trang chủ (khối "Bạn đang muốn làm gì") và trang danh
 * mục /ungdung/<nhóm> cùng dùng.
 */
export const INTENT_ICONS: Record<string, string[]> = {
  video: ['M23 7l-7 5 7 5V7z', 'M14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z'],
  marketing: ['M6 20V11', 'M12 20V4', 'M18 20v-6'],
  ai: [
    'M7 8h10a3 3 0 013 3v5a3 3 0 01-3 3H7a3 3 0 01-3-3v-5a3 3 0 013-3z',
    'M12 4v4',
    'M9 13.5h.01',
    'M15 13.5h.01',
  ],
  sales: ['M6 8h12l1 12H5L6 8z', 'M9 8V6a3 3 0 016 0v2'],
  creator: ['M4 5.5h16v13H4z', 'M10.5 9.5l5 2.5-5 2.5z'],
  design: ['M17 3.5l3.5 3.5L9 18.5l-4.5 1 1-4.5L17 3.5z'],
  tonghop: ['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M4 14h6v6H4z', 'M14 14h6v6h-6z'],
  // Cặp toà nhà — nhóm phần mềm vận hành doanh nghiệp
  'doanh-nghiep': [
    'M3 21h18', 'M5 21V7l7-4v18', 'M12 10h7v11', 'M8.5 8h.01', 'M8.5 12h.01', 'M8.5 16h.01',
  ],
}

export const INTENT_FALLBACK = INTENT_ICONS.tonghop

/**
 * Biểu tượng cho nhóm nhỏ (cấp 3). Danh mục cấp 3 có hàng chục slug nên không
 * khai hết được; đoán theo từ khoá, không khớp thì mượn biểu tượng nhóm cha.
 *
 * Từ khoá được so theo TỪNG ĐOẠN của slug chứ không phải chuỗi con, vì so chuỗi
 * con thì "van-hanh" và "ban-hang" đều dính từ khoá "anh" và nhận nhầm biểu
 * tượng khung ảnh.
 */
const SUB_ICONS: [string[], string[]][] = [
  [['video', 'phim', 'quay', 'tao-video', 'xu-ly'], INTENT_ICONS.video],
  [['anh', 'tao-anh', 'anh-ve', 'anh-bia', 'image', 'thiet-ke', 'design', 'logo', 'vector'],
    ['M4 4.5h16v15H4z', 'M8.5 10h.01', 'M20 15l-4.5-4.5L6 20']],
  [['nhac', 'music', 'audio', 'am-thanh'],
    ['M9 18V5l10-2v13', 'M9 18a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z', 'M19 16a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z']],
  [['giong', 'giong-noi', 'voice', 'doc', 'podcast'],
    ['M12 3a3 3 0 013 3v5a3 3 0 01-6 0V6a3 3 0 013-3z', 'M5.5 11a6.5 6.5 0 0013 0', 'M12 17.5V21']],
  [['lap-trinh', 'code', 'developer', 'dev'], ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6']],
  [['chatbot', 'tro-ly', 'assistant', 'chat', 'giao-tiep'],
    ['M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z']],
  // Không để từ khoá trần 'viet': 'ban-hang-viet' sẽ nhận nhầm biểu tượng bút
  [['viet-lach', 'van-ban', 'noi-dung', 'content'],
    ['M12 20h9', 'M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z']],
  [['thuyet-trinh', 'slide', 'present'], ['M2 3h20v12H2z', 'M12 15v6', 'M8 21h8']],
  [['hop', 'meeting', 'ghi-bien-ban', 'bien-ban', 'ghi-chu', 'note', 'van-phong', 'tai-lieu'],
    ['M8 3h8v4H8z', 'M6 5H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-1', 'M8 12h8', 'M8 16h5']],
  [['email', 'mail', 'thu'],
    ['M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z', 'M22 6l-10 7L2 6']],
  [['seo', 'tim-kiem', 'search', 'trinh-duyet'], ['M11 4a7 7 0 100 14 7 7 0 000-14z', 'M20 20l-3.8-3.8']],
  [['phan-tich', 'analytics', 'bao-cao', 'so-lieu', 'tai-chinh'], ['M18 20V10', 'M12 20V4', 'M6 20v-6']],
  [['ban-hang', 'sales', 'thuong-mai-dien-tu', 'crm', 'pos'],
    ['M6 8h12l1 12H5L6 8z', 'M9 8V6a3 3 0 016 0v2']],
  [['bao-mat', 'security', 'antivirus', 'mat-khau'],
    ['M12 3l8 3.5V12c0 4.6-3.4 8-8 9-4.6-1-8-4.4-8-9V6.5L12 3z']],
  [['luu-tru', 'storage', 'cloud', 'sao-luu'], ['M7 18a4 4 0 01-.4-8A6 6 0 0118 9.5 3.5 3.5 0 0117.5 18H7z']],
  [['hoc-tap', 'hoc', 'education', 'dao-tao'],
    ['M22 10L12 5 2 10l10 5 10-5z', 'M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5']],
  [['nhan-su', 'cham-cong', 'tuyen-dung', 'hr'],
    ['M16 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2', 'M9.5 10a3.5 3.5 0 100-7 3.5 3.5 0 000 7z', 'M21 20v-2a4 4 0 00-3-3.9']],
  [['van-hanh', 'quy-trinh', 'workflow', 'cong-viec'],
    ['M4 5h6v6H4z', 'M14 13h6v6h-6z', 'M10 8h4a3 3 0 013 3v2']],
  [['erp'], ['M3 13h8V3H3z', 'M13 21h8V11h-8z', 'M13 7h8V3h-8z', 'M3 21h8v-4H3z']],
  [['quan-tri', 'dashboard'], ['M3 3v18h18', 'M7 15l4-5 3 3 5-7']],
  [['phap-ly', 'hop-dong', 'legal'],
    ['M12 3v18', 'M5 7h14', 'M7 7l-3 7a3.5 3.5 0 006 0L7 7z', 'M17 7l-3 7a3.5 3.5 0 006 0l-3-7z']],
  [['chu-ky-so', 'ky-so', 'hoa-don'], ['M3 17c3-1 4-8 7-8s2 7 5 7 3-3 6-3', 'M3 21h18']],
  // Điện thoại — nhóm dựng video trên điện thoại, quản lý thiết bị di động
  [['dien-thoai', 'mobile'],
    ['M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z', 'M10.5 18.5h3']],
  // Màn hình có nút phát — kênh YouTube, phát trực tiếp
  [['youtube', 'kenh', 'phat-truc-tiep', 'livestream'], INTENT_ICONS.creator],
  [['mang-xa-hoi', 'social'],
    ['M18 8a3 3 0 100-6 3 3 0 000 6z', 'M6 15a3 3 0 100-6 3 3 0 000 6z',
      'M18 22a3 3 0 100-6 3 3 0 000 6z', 'M8.6 13.5l6.8 4', 'M15.4 6.5l-6.8 4']],
  [['landing-page', 'giao-dien', 'website'],
    ['M3 4h18v16H3z', 'M3 9h18', 'M7 6.5h.01', 'M10 6.5h.01']],
  [['tu-dong-hoa', 'ai-agent', 'agent'], INTENT_ICONS.ai],
  [['cham-soc', 'khach-hang', 'support'],
    ['M4 14v-2a8 8 0 0116 0v2', 'M4 14h2.5a1.5 1.5 0 011.5 1.5v3A1.5 1.5 0 016.5 20H4z',
      'M20 14h-2.5a1.5 1.5 0 00-1.5 1.5v3A1.5 1.5 0 0017.5 20H20z']],
  [['ba-chieu', '3d'],
    ['M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
      'M3.3 7L12 12l8.7-5', 'M12 22V12']],
  [['tien-ich', 'utility'],
    ['M14.7 6.3a4 4 0 005.3 5.3l-8.4 8.4a2.8 2.8 0 01-4-4z', 'M3 3l5 5', 'M8 3L3 8']],
]

/** Từ khoá phải khớp trọn một hoặc vài đoạn của slug, không phải chuỗi con. */
function hitsSlug(slug: string, keyword: string): boolean {
  return new RegExp(`(^|-)${keyword}(-|$)`).test(slug)
}

/** Chọn biểu tượng cho một danh mục bất kỳ theo slug. */
export function categoryIcon(slug: string, groupSlug?: string): string[] {
  if (INTENT_ICONS[slug]) return INTENT_ICONS[slug]
  for (const [keywords, d] of SUB_ICONS) {
    if (keywords.some((k) => hitsSlug(slug, k))) return d
  }
  return (groupSlug && INTENT_ICONS[groupSlug]) || INTENT_FALLBACK
}
