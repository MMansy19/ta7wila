import type { NextConfig } from "next";

const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['cdn.builder.io'],
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
