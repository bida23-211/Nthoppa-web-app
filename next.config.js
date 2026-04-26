/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['axstdjscrdaspqeogole.supabase.co'],
  },
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
}
module.exports = nextConfig