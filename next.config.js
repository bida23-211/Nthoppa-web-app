/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['axstdjscrdaspqeogole.supabase.co'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
}
module.exports = nextConfig