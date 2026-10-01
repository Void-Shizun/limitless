/** @type {import('next').NextConfig} */
const nextConfig = {

  allowedDevOrigins: ['192.168.0.7', '127.0.0.1', '192.168.0.6', '192.168.0.4', '192.168.0.8', 'mystified-declared-hypnotize.ngrok-free.dev'],

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
