/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '/PitchCraft-AI' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/PitchCraft-AI' : '',
}

export default nextConfig
