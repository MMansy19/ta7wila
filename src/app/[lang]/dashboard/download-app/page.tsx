"use client";

import { useTranslation } from '@/hooks/useTranslation';
import { 
  Smartphone, 
  Download, 
  Apple, 
  Shield, 
  Zap, 
  Heart,
  Star,
  CheckCircle
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default function DownloadApp() {
  const translations = useTranslation();

  const features = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "تجربة محمولة مميزة",
      description: "تطبيق محسن للأجهزة المحمولة مع واجهة سهلة الاستخدام"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "أداء فائق السرعة", 
      description: "تطبيق سريع ومحسن لأفضل تجربة مستخدم ممكنة"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "أمان متقدم",
      description: "حماية بيانات متقدمة مع تشفير من الدرجة العسكرية"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "تصميم عصري",
      description: "واجهة مستخدم عصرية ومريحة للعين"
    }
  ];

  const handleDownload = (platform: 'ios' | 'android' | 'windows' | 'mac') => {
    console.log(`Downloading for ${platform}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30">
            <Download className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              تحميل التطبيق
            </h1>
            <p className="text-slate-400 mt-1">احصل على تطبيق تحويلة على جهازك المحمول أو الكمبيوتر</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* App Preview Section */}
        <div className="backdrop-blur-sm bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="relative mx-auto mb-6 w-48 h-96 bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl p-2 shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm">
                  <div className="p-4 text-white text-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full mx-auto mb-4"></div>
                    <h3 className="text-lg font-bold mb-2">تحويلة</h3>
                    <p className="text-sm opacity-80 mb-6">نظام الدفع الذكي</p>
                    
                    <div className="space-y-3">
                      <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-emerald-400 rounded"></div>
                          <span className="text-sm">المعاملات</span>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-400 rounded"></div>
                          <span className="text-sm">المتاجر</span>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-purple-400 rounded"></div>
                          <span className="text-sm">التقارير</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-slate-300 text-lg font-semibold">تقييم 5.0 نجوم</p>
            <p className="text-slate-400 text-sm">من أكثر من 10,000 مستخدم راضٍ</p>
          </div>
        </div>

        {/* Download Options */}
        <div className="space-y-6">
          {/* Mobile Apps */}
          <div className="backdrop-blur-sm bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Smartphone className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">تطبيقات الجوال</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleDownload('ios')}
                className="group bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-blue-600/20 hover:to-purple-600/20 border border-slate-600/50 hover:border-blue-500/50 rounded-xl p-4 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl">
                    <Apple className="w-8 h-8 text-black" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">تحميل على</p>
                    <p className="text-lg font-semibold text-white">App Store</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleDownload('android')}
                className="group bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-green-600/20 hover:to-emerald-600/20 border border-slate-600/50 hover:border-green-500/50 rounded-xl p-4 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.523 15.3414c-.5665 0-1.0253-.4588-1.0253-1.0253s.4588-1.0253 1.0253-1.0253 1.0253.4588 1.0253 1.0253-.4588 1.0253-1.0253 1.0253zm-11.046 0c-.5665 0-1.0253-.4588-1.0253-1.0253s.4588-1.0253 1.0253-1.0253 1.0253.4588 1.0253 1.0253-.4588 1.0253-1.0253 1.0253zm13.084-4.682L18.226 7.516c.0665-.1143.027-.2588-.0872-.3253-.1143-.0665-.2588-.027-.3253.0872l-1.356 2.3355C15.0395 9.0375 13.5605 8.652 12 8.652s-3.0395.3855-4.458.9254l-1.356-2.3355c-.0665-.1143-.211-.1537-.3253-.0872-.1143.0665-.1537.211-.0872.3253l1.336 2.1435C4.8145 10.8675 3.402 12.7125 3.402 14.802h17.196c0-2.0895-1.4125-3.9345-3.7405-5.1435zM12 21.348c6.627 0 12-5.373 12-12s-5.373-12-12-12-12 5.373-12 12 5.373 12 12 12z"/>
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">تحميل على</p>
                    <p className="text-lg font-semibold text-white">Google Play</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Desktop Apps */}
          <div className="backdrop-blur-sm bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Download className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">تطبيقات سطح المكتب</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleDownload('windows')}
                className="group bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-blue-600/20 hover:to-cyan-600/20 border border-slate-600/50 hover:border-blue-500/50 rounded-xl p-4 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 rounded-xl">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M0 3.5L9.5 2.207V11.5H0V3.5ZM10.5 2.125L24 0V11.5H10.5V2.125ZM0 12.5H9.5V21.793L0 20.5V12.5ZM10.5 12.5H24V24L10.5 21.875V12.5Z"/>
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">تحميل لـ</p>
                    <p className="text-lg font-semibold text-white">Windows</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleDownload('mac')}
                className="group bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-gray-600/20 hover:to-slate-600/20 border border-slate-600/50 hover:border-gray-500/50 rounded-xl p-4 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-800 rounded-xl">
                    <Apple className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">تحميل لـ</p>
                    <p className="text-lg font-semibold text-white">macOS</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="backdrop-blur-sm bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            <div className="text-center">
              <div className="w-32 h-32 bg-white rounded-xl mx-auto mb-4 p-4">
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">QR</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">امسح للتحميل</h3>
              <p className="text-slate-400 text-sm">امسح الكود للحصول على رابط التحميل المباشر</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">لماذا تطبيق تحويلة؟</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">اكتشف الميزات الرائعة التي تجعل تطبيقنا الخيار الأفضل لإدارة المدفوعات</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="backdrop-blur-sm bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:bg-slate-700/40 transition-all duration-300 group hover:scale-105"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30 group-hover:scale-110 transition-transform">
                  <div className="text-blue-400">
                    {feature.icon}
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <div className="backdrop-blur-sm bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            ابدأ رحلتك مع تحويلة اليوم
          </h2>
          <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto">
            انضم إلى آلاف المستخدمين الذين يثقون في تحويلة لإدارة مدفوعاتهم بأمان وسهولة
          </p>
          <div className="flex items-center justify-center gap-4">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <span className="text-slate-300">تحميل مجاني</span>
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <span className="text-slate-300">أمان متقدم</span>
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <span className="text-slate-300">دعم فني 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
} 