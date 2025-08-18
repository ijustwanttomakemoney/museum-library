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
  // Configure for Cloudflare Pages deployment
  output: 'standalone',
  trailingSlash: true,
  distDir: '.next',
  experimental: {
    // Enable server components and app directory features
  },
  // Optimize for Cloudflare Pages
  webpack: (config, { isServer, dev }) => {
    // Only disable caching in production builds to prevent large cache files
    if (!dev && process.env.NODE_ENV === 'production') {
      config.cache = false
    }
    
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
