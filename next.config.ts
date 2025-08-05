import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['cdn.builder.io', 'api.ta7wila.com'],
    },
    assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
    webpack: (config: any) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, 'src'),
        '@/components': path.resolve(__dirname, 'src/components'),
        '@/styles': path.resolve(__dirname, 'src/styles'),
        '@/lib': path.resolve(__dirname, 'src/lib'),
        '@/types': path.resolve(__dirname, 'src/types'),
        '@/hooks': path.resolve(__dirname, 'src/hooks'),
        '@/api': path.resolve(__dirname, 'src/api'),
        '@/context': path.resolve(__dirname, 'src/context'),
      };
      return config;
    },
    async rewrites() {
        return [
          {
            source: '/:lang/_next/:path*',
            destination: '/_next/:path*'
          },
          // WhatsApp API Proxy - يوجه طلبات /api/whatsapp إلى خدمة الواتساب
          {
            source: '/api/whatsapp/:path*',
            destination: 'http://localhost:3001/whatsapp/:path*'
          }
        ]
      }
  }
  
  export default withNextIntl(nextConfig);
