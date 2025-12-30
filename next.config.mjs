/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
  },
  cleanDistDir: true,
  experimental: {
    serverComponentsExternalPackages: ['mongodb'],
  },
  // Prevent API routes from being called during build
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

export default nextConfig
