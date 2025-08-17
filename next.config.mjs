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
  // Removed output: 'export' to allow dynamic routes with database dependencies
  trailingSlash: true,
  distDir: 'dist',
  // Optimize build for Cloudflare Pages
  experimental: {
    optimizeCss: true,
  },
  // Exclude cache and other large files from build output
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            maxSize: 244000, // ~240KB chunks
          },
        },
      },
    }
    return config
  },
}

export default nextConfig
