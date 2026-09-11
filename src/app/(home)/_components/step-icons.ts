/**
 * Biểu tượng cho các bước trong bộ công cụ xây kênh.
 *
 * Để riêng một tệp vì hai nơi cùng dùng: dải trang trí ở cột trái (HomeClient)
 * và danh sách bước ở cột phải (StackFlow). Vẽ bằng đường SVG thay vì emoji để
 * nét đồng đều trên mọi máy.
 */
export const STEP_ICONS: Record<string, string[]> = {
  // Bút — viết kịch bản
  viet: ['M12 20h9', 'M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z'],
  // Micro — tạo giọng đọc
  giongnoi: [
    'M12 3a3 3 0 013 3v5a3 3 0 01-6 0V6a3 3 0 013-3z',
    'M5.5 11a6.5 6.5 0 0013 0',
    'M12 17.5V21',
  ],
  // Máy quay — chỉnh sửa video
  video: ['M23 7l-7 5 7 5V7z', 'M14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z'],
  // Khung ảnh — thiết kế thumbnail
  anh: ['M4 4.5h16v15H4z', 'M8.5 10h.01', 'M20 15l-4.5-4.5L6 20'],
  // Biểu đồ cột — xuất bản và phân tích
  phantich: ['M6 20V11', 'M12 20V4', 'M18 20v-6'],
}

/** Thứ tự dùng khi bước chưa khai `icon` — khớp với 5 bước mặc định. */
const ORDER = ['viet', 'giongnoi', 'video', 'anh', 'phantich']

/**
 * Lấy đường vẽ cho một bước. Ưu tiên khoá trong config, không có thì suy theo
 * vị trí, cuối cùng mới về biểu đồ cột để thẻ không bao giờ trống.
 */
export function stepIcon(icon: string | undefined, index: number): string[] {
  return STEP_ICONS[icon ?? ''] ?? STEP_ICONS[ORDER[index] ?? ''] ?? STEP_ICONS.phantich
}
