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
  // Disable webpack caching to prevent large cache files
  webpack: (config, { isServer, dev }) => {
    // Disable caching in production builds to prevent large cache files
    if (!dev) {
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
