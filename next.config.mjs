/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'http', hostname: '192.168.1.18' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
}

export default nextConfig
