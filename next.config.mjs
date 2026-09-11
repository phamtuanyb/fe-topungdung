const isDev = process.env.NODE_ENV !== 'production'

// Origin của backend, lấy từ env để CSP không phải sửa tay khi đổi môi trường.
const apiOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').origin
  } catch {
    return 'http://localhost:3001'
  }
})()

// ─────────────────────────────────────────────────────────────────────────────
// Chốt chặn lúc build.
//
// NEXT_PUBLIC_* được Next nướng cứng vào bundle lúc build, không đọc lại lúc
// chạy. Build nhầm với giá trị localhost là toàn bộ canonical, og:image và
// sitemap ra bản production đều trỏ về máy cá nhân — khởi động lại không cứu
// được, phải build lại từ đầu. Thà dừng ở đây còn hơn phát hiện sau khi đã lên
// tên miền thật.
//
// Cần build thử bản production ở máy cá nhân thì đặt ALLOW_LOCALHOST_BUILD=1.
// ─────────────────────────────────────────────────────────────────────────────
if (!isDev && process.env.ALLOW_LOCALHOST_BUILD !== '1') {
  const phaiCo = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  }
  const hong = Object.entries(phaiCo).filter(
    ([, v]) => !v || v.includes('localhost') || v.includes('127.0.0.1'),
  )
  if (hong.length > 0) {
    const dong = hong.map(([k, v]) => `  ${k} = ${v || '(chưa đặt)'}`)
    throw new Error(
      [
        'Build production bị chặn — các biến sau chưa đặt hoặc còn trỏ về localhost:',
        ...dong,
        '',
        'Đặt chúng trong .env rồi build lại.',
        'Chỉ muốn build thử ở máy cá nhân: ALLOW_LOCALHOST_BUILD=1 npm run build',
      ].join('\n'),
    )
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cho phép build ra thư mục khác để không đụng .next của dev server đang chạy.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // ESLint đã bật lại: các lỗi biến thừa từ trang cũ đã dọn xong, chỉ còn
  // 1 cảnh báo <img> ở HomeClient nên build vẫn qua.
  eslint: { ignoreDuringBuilds: false },
  // TypeScript đã bật lại — typecheck hiện sạch, build sẽ chặn nếu có lỗi type mới.
  typescript: { ignoreBuildErrors: false },
  // Bật standalone build cho Docker — Next sẽ tạo .next/standalone với mọi dependency cần thiết.
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // cache image optimize 1 ngày
    // Ảnh chỉ đến từ backend của chính dự án, nên suy thẳng từ NEXT_PUBLIC_API_URL.
    // Không cần sửa tay khi đổi môi trường, và không còn hostname thừa của trang cũ
    // (192.168.1.18, api.vsoftware.vn, vsoftware.vn) hay kho ảnh không dùng tới.
    remotePatterns: [
      {
        protocol: new URL(apiOrigin).protocol.replace(':', ''),
        hostname: new URL(apiOrigin).hostname,
        ...(new URL(apiOrigin).port ? { port: new URL(apiOrigin).port } : {}),
      },
    ],
  },
  async redirects() {
    return [
      { source: '/contact', destination: '/lien-he', permanent: true },
    ]
  },
  async rewrites() {
    // Ảnh tải lên qua admin nằm ở backend, nhưng CSDL chỉ lưu đường dẫn tương
    // đối "/uploads/<tệp>" để dữ liệu không dính host. Rewrite mặc định của
    // Next chạy SAU thư mục public/, nên tệp nào đã có sẵn trong
    // public/uploads được phục vụ thẳng, còn lại mới chuyển tiếp về backend.
    return [
      { source: '/uploads/:duongDan*', destination: `${apiOrigin}/uploads/:duongDan*` },
    ]
  },
  async headers() {
    // CSP: 'unsafe-inline' cho script vẫn cần vì Next nhúng script khởi tạo inline,
    // và 'unsafe-eval' chỉ bật ở dev cho React Refresh. Ảnh cho phép mọi nguồn https
    // vì logo ứng dụng và ảnh chụp màn hình lấy từ nhiều tên miền khác nhau.
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      `img-src 'self' data: blob: https: ${apiOrigin}`,
      `connect-src 'self' ${apiOrigin} https://www.google-analytics.com https://region1.google-analytics.com${isDev ? ' ws: wss:' : ''}`,
      "manifest-src 'self'",
      'upgrade-insecure-requests',
    ].join('; ')

    const baoMat = [
      { key: 'Content-Security-Policy', value: csp },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
    ]
    // HSTS chỉ có ý nghĩa trên HTTPS — bật ở dev sẽ khoá localhost vào https.
    if (!isDev) {
      baoMat.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      })
    }

    return [
      { source: '/:path*', headers: baoMat },
      {
        // Static assets cache 1 năm — Next sẽ bust cache qua hash filename
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' }],
      },
      {
        source: '/logos/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, must-revalidate' }],
      },
      {
        // Tên tệp là uuid nên nội dung không bao giờ đổi — cache dài ngày được
        source: '/uploads/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, must-revalidate' }],
      },
    ]
  },
}

export default nextConfig
