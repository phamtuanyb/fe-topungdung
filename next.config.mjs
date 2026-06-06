/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Bật standalone build cho Docker — Next sẽ tạo .next/standalone với mọi dependency cần thiết.
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // cache image optimize 1 ngày
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'http', hostname: '192.168.1.18' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'api.vsoftware.vn' },
      { protocol: 'https', hostname: 'vsoftware.vn' },
    ],
  },
  async redirects() {
    return [
      { source: '/contact', destination: '/lien-he', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        // Static assets cache 1 năm — Next sẽ bust cache qua hash filename
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' }],
      },
    ]
  },
}

export default nextConfig
