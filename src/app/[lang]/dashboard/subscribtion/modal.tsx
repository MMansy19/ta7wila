import { useTranslation } from '@/hooks/useTranslation';
import { SubscriptionModalProps } from "./types";
import useCurrency from "../Shared/useCurrency";
import { X, CreditCard, User, Calendar, Building2, Users, Package, Crown, CheckCircle } from 'lucide-react';

const SubscriptionModal = ({
  selectedSubscription,
  onClose,
}: SubscriptionModalProps) => {
  const translations = useTranslation();
  const formatCurrency = useCurrency();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Background with gradient and glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-black/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl"></div>
        
        {/* Content */}
        <div className="relative p-6 lg:p-8 overflow-y-auto max-h-[95vh]">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                <Crown className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                  {translations.subscription.modal.title}
                </h2>
                <p className="text-slate-400 mt-1">تفاصيل الاشتراك المحدد</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 flex items-center justify-center transition-all duration-200 hover:scale-110 group"
            >
              <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Subscription Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Price Card */}
              <div className="bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                    <CreditCard className="w-10 h-10 text-purple-400" />
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                    {formatCurrency(selectedSubscription.amount)}
                  </div>
                  <div className="text-purple-300 font-medium">
                    {translations.subscription.modal.subscriptionAmount}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">{selectedSubscription.status === "active" ? "نشط" : "غير نشط"}</span>
                  </div>
                </div>
              </div>

              {/* Usage Statistics */}
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <Package className="w-6 h-6 text-blue-400" />
                  إحصائيات الاستخدام
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: Building2,
                      label: translations.subscription.modal.counts.applications,
                      current: selectedSubscription.applications_count,
                      max: selectedSubscription.max_applications_count,
                      color: "blue"
                    },
                    {
                      icon: Users,
                      label: translations.subscription.modal.counts.employees,
                      current: selectedSubscription.employees_count,
                      max: selectedSubscription.max_employees_count,
                      color: "green"
                    },
                    {
                      icon: Building2,
                      label: translations.subscription.modal.counts.vendors,
                      current: selectedSubscription.vendors_count,
                      max: selectedSubscription.max_vendors_count,
                      color: "purple"
                    }
                  ].map((stat, index) => {
                    const percentage = (stat.current / stat.max) * 100;
                    const colorClasses = {
                      blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
                      green: "from-green-500/20 to-green-600/10 border-green-500/30 text-green-400",
                      purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400"
                    };
                    
                    return (
                      <div 
                        key={index}
                        className={`bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} backdrop-blur-sm border rounded-xl p-4`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <stat.icon className="w-5 h-5" />
                          <span className="text-white font-medium text-sm">{stat.label}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-white">{stat.current}</span>
                            <span className="text-slate-400 text-sm">من {stat.max}</span>
                          </div>
                          <div className="w-full bg-slate-700/50 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full bg-gradient-to-r ${
                                stat.color === 'blue' ? 'from-blue-500 to-blue-400' :
                                stat.color === 'green' ? 'from-green-500 to-green-400' :
                                'from-purple-500 to-purple-400'
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-slate-400">{percentage.toFixed(1)}% مستخدم</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* User Info */}
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <User className="w-5 h-5 text-amber-400" />
                  معلومات المشترك
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/30">
                    <span className="text-amber-400 font-bold text-xl">
                      {selectedSubscription.user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white text-lg">
                      {selectedSubscription.user.name}
                    </div>
                    <div className="text-slate-400 text-sm break-all">
                      {selectedSubscription.user.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Details */}
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  تفاصيل الاشتراك
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                    <span className="text-slate-400">نوع الاشتراك</span>
                    <span className="text-white font-medium">#{selectedSubscription.subscription_type}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                    <span className="text-slate-400">حالة الدفع</span>
                    <span className={`font-medium ${
                      selectedSubscription.status === "active" ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {selectedSubscription.status === "active" ? "مدفوع" : "غير مدفوع"}
                    </span>
                  </div>
                  <div className="flex justify-between items-start py-3">
                    <span className="text-slate-400">تاريخ الاشتراك</span>
                    <div className="text-right">
                      <div className="text-white font-medium">
                        {new Date(selectedSubscription.created_at).toLocaleDateString('ar-EG')}
                      </div>
                      <div className="text-amber-400 text-sm">
                        {new Date(selectedSubscription.created_at).toLocaleTimeString('ar-EG', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  إدارة الاشتراك
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
