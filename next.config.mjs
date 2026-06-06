/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bật standalone build cho Docker — Next sẽ tạo .next/standalone với mọi dependency cần thiết.
  output: 'standalone',
  images: {
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
}

export default nextConfig
