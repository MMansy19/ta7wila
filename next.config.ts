
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['cdn.builder.io', 'api.ta7wila.com'],
    },
    assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
    async rewrites() {
        return [
          {
            source: '/:lang/_next/:path*',
            destination: '/_next/:path*'
          }
        ]
      }
  }
  
  module.exports = nextConfig
