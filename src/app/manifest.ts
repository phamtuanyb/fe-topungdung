import { MetadataRoute } from 'next'

/**
 * Web app manifest — trước đây trang không có file này, nên khi người dùng
 * lưu trang vào màn hình chính điện thoại thì không có tên và biểu tượng.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TopỨngDụng — Tìm đúng ứng dụng. Làm việc tốt hơn.',
    short_name: 'TopỨngDụng',
    description:
      'Đánh giá và so sánh ứng dụng, phần mềm và công cụ AI theo từng nhu cầu công việc, ' +
      'kèm điểm mạnh, điểm yếu và mức giá thực tế cho người dùng Việt Nam.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F8FC',
    theme_color: '#006FE6',
    lang: 'vi',
    categories: ['productivity', 'business', 'news'],
    // Next tự gắn mã băm vào đường dẫn của icon.png / apple-icon.png nên không
    // khai cứng ở đây được; hai tệp tĩnh trong src/app đã đủ cho trình duyệt và
    // cho màn hình chính iOS. Bản 512px dành riêng cho lời nhắc cài đặt của
    // Android, vốn đòi một biểu tượng đủ lớn.
    icons: [
      { src: '/images/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/images/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      // Bản "maskable" chừa lề rộng và có nền đặc: Android cắt biểu tượng theo
      // hình của máy (tròn, bo góc, giọt nước), nền trong sẽ bị cắt cụt dấu.
      { src: '/images/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
