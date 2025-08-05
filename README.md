# 🚀 Ta7wila - Advanced Payment Gateway Platform

<div align="center">
  <img src="public/Frame 1984078147.svg" alt="Ta7wila Logo" width="200" height="200">
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.3.0-black?logo=next.js&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

## 🌟 Overview

**Ta7wila** is a comprehensive, modern payment gateway platform that enables businesses to accept payments through multiple Egyptian mobile wallet services. Built with cutting-edge technologies, it provides a seamless, secure, and user-friendly payment experience with real-time WhatsApp integration for transaction notifications.

### ✨ Key Features

- 🏦 **Multi-Payment Support**: Instapay, VF Cash, Orange Cash, Etisalat Cash, and more
- 🌍 **Internationalization**: Full Arabic and English support with RTL layout
- 📱 **WhatsApp Integration**: Real-time transaction notifications and status updates
- 🔐 **Secure Authentication**: JWT-based authentication with role-based access control
- 📊 **Advanced Dashboard**: Comprehensive analytics and transaction management
- 🎨 **Modern UI/UX**: Dark theme with responsive design and smooth animations
- ⚡ **Real-time Updates**: Live payment status tracking and notifications
- 🔄 **API Integration**: RESTful API with comprehensive documentation

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.3.0 with App Router
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS 3.4.1 + Framer Motion
- **State Management**: Redux Toolkit + React Query
- **Forms**: Formik + Yup validation
- **UI Components**: Radix UI + Headless UI
- **Icons**: Heroicons + React Icons + FontAwesome

### Backend Integration
- **API Client**: Axios with interceptors
- **Authentication**: JWT tokens with cookies-next
- **Internationalization**: next-intl with locale detection
- **Notifications**: React Hot Toast

### Development Tools
- **Package Manager**: npm
- **Bundler**: Next.js built-in (Turbopack)
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MMansy19/ta7wila.git
   cd ta7wila
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://api.ta7wila.com/v3
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 📱 WhatsApp Integration Setup

To enable WhatsApp notifications:

```bash
# Start WhatsApp service (development)
npm run whatsapp:simple

# Start full development environment
npm run dev:full
```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run whatsapp:simple` | Start WhatsApp integration |
| `npm run dev:full` | Start both web and WhatsApp services |
| `npm run start:production` | Start production with WhatsApp |

## 🏗️ Project Structure

```
ta7wila/
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 [lang]/              # Internationalized routes
│   │   │   ├── 📁 dashboard/       # Admin dashboard
│   │   │   ├── 📁 public-payment/  # Public payment pages
│   │   │   └── page.tsx            # Landing page
│   │   └── 📁 api/                 # API routes
│   ├── 📁 components/              # Reusable components
│   ├── 📁 hooks/                   # Custom React hooks
│   ├── 📁 lib/                     # Utility libraries
│   ├── 📁 types/                   # TypeScript definitions
│   └── 📁 styles/                  # Global styles
├── 📁 public/                      # Static assets
├── 📁 lib/                         # WhatsApp integration
└── 📄 Configuration files
```

## 🔧 Configuration

### Internationalization
The app supports Arabic and English with automatic locale detection:

```typescript
// i18n-config.ts
export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'ar']
} as const
```

### Payment Methods
Supported payment options:

```typescript
const paymentMethods = [
  { name: "VF Cash", key: "vcash", img: "/vcash.svg" },
  { name: "Orange Cash", key: "ocash", img: "/ocash.svg" },
  { name: "Etisalat Cash", key: "ecash", img: "/ecash.svg" },
  { name: "InstaPay", key: "instapay", img: "/instapay.svg" }
]
```

## 📖 API Documentation

The platform integrates with Ta7wila's RESTful API. Key endpoints include:

### Authentication
```http
POST /auth/login
POST /auth/register
POST /auth/refresh
```

### Payments
```http
POST /checkout/generate
POST /transactions/public-payment
GET /payments/{id}
```

### Applications
```http
GET /applications
POST /applications
PUT /applications/{id}
```

For complete API documentation, visit: [API Docs](public/documentation.md)

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive form validation with Yup
- **XSS Protection**: Built-in Next.js security features
- **CSRF Protection**: Token-based request validation
- **Environment Variables**: Sensitive data protection

## 🌍 Internationalization

Full RTL support for Arabic language:

- **Dynamic Language Switching**: Real-time locale changes
- **RTL Layout**: Proper right-to-left text direction
- **Localized Content**: Translated UI and error messages
- **Number Formatting**: Locale-specific number and currency formatting

## 📱 Responsive Design

Optimized for all devices:

- **Mobile First**: Progressive enhancement approach
- **Tablet Optimized**: Perfect tablet experience
- **Desktop Enhanced**: Rich desktop functionality
- **Touch Friendly**: Optimized touch interactions

## 🚀 Performance Optimizations

- **Next.js App Router**: Latest routing system for optimal performance
- **Image Optimization**: Automatic image optimization with Next.js Image
- **Code Splitting**: Automatic code splitting for faster loads
- **Caching**: Intelligent caching strategies
- **Bundle Analysis**: Optimized bundle sizes

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Deployment

### Vercel (Recommended)

1. **Deploy to Vercel**
   ```bash
   npx vercel
   ```

2. **Configure environment variables** in Vercel dashboard

3. **Set up domain** and SSL certificates

### Docker Deployment

```bash
# Build Docker image
docker build -t ta7wila .

# Run container
docker run -p 3000:3000 ta7wila
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design
- Test in both Arabic and English

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [API Docs](public/documentation.md)
- **Issues**: [GitHub Issues](https://github.com/MMansy19/ta7wila/issues)
- **Email**: support@ta7wila.com
- **Discord**: [Join our community](https://discord.gg/ta7wila)

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment
- **Tailwind CSS** for the utility-first CSS framework
- **All contributors** who have helped improve this project

---

<div align="center">
  <p>Made with ❤️ by the Ta7wila Team</p>
  <p>
    <a href="https://github.com/MMansy19/ta7wila">⭐ Star this repository</a> |
    <a href="https://github.com/MMansy19/ta7wila/issues">🐛 Report Bug</a> |
    <a href="https://github.com/MMansy19/ta7wila/issues">💡 Request Feature</a>
  </p>
</div>
