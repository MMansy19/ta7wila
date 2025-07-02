"use client";
import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";
import useCurrency from "../Shared/useCurrency";
import SubscriptionModal from "./modal";
import { ApiResponse, Plan } from "./types";
import { CreditCard, Users, Building2, Calendar, Eye } from "lucide-react";
export const dynamic = 'force-dynamic';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<Plan | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const formatCurrency = useCurrency();

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const translations = useTranslation();

  const openModal = (subscription: Plan) => {
    setSelectedSubscription(subscription);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSubscription(null);
    setIsModalOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const url = `${apiUrl}/subscriptions?page=${currentPage}`;
      try {
        const response = await axios.get<ApiResponse>(url, {
          headers: getAuthHeaders(),
        });
        setSubscriptions(response.data.result.data);      } catch (error: unknown) {
        let errorMessage = translations.errors?.developerMode || "Failed to fetch subscriptions";
        
        if (error && typeof error === 'object' && 'response' in error) {
          const err = error as { 
            response: { 
              data?: { 
                errorMessage?: string;
                message?: string;
                result?: Record<string, string>;
              } | string;
            }
          };

          if (typeof err.response.data === "string") {
            errorMessage = err.response.data;
          } else if (err.response.data?.errorMessage) {
            errorMessage = err.response.data.errorMessage;
          } else if (err.response.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.data?.result) {
            errorMessage = Object.values(err.response.data.result).join(", ");
          }
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, [currentPage, apiUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubscription) return;

    setSubmitting(true);
    try {
      const response = await axios.put(
        `${apiUrl}/subscriptions/${selectedSubscription.id}`,
        selectedSubscription,
        { headers: getAuthHeaders() }
      );
      toast.success("Subscription updated successfully");
      setSubscriptions(
        subscriptions.map((sub) =>
          sub.id === selectedSubscription.id
            ? response.data.result.data[0]
            : sub
        )
      );
      closeModal();    } catch (error: unknown) {
      let errorMessage = translations.errors?.developerMode || "Failed to update subscription";
      
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { 
          response: { 
            data?: { 
              errorMessage?: string;
              message?: string;
              result?: Record<string, string>;
            } | string;
          }
        };

        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else if (err.response.data?.errorMessage) {
          errorMessage = err.response.data.errorMessage;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data?.result) {
          errorMessage = Object.values(err.response.data.result).join(", ");
        }
      }

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-white/70">جاري تحميل الاشتراكات...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="max-w-md mx-auto p-6 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-300 mb-2">خطأ في تحميل البيانات</h3>
          <p className="text-red-400/80">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30">
            <CreditCard className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
              {translations.subscription.title}
            </h1>
            <p className="text-slate-400 mt-1">إدارة وعرض جميع الاشتراكات والخطط المتاحة</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="backdrop-blur-sm bg-slate-800/40 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <CreditCard className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-white">قائمة الاشتراكات</h2>
            </div>
            <div className="text-sm text-slate-400">
              المجموع: <span className="text-white font-medium">{subscriptions.length}</span>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-b border-slate-600/50">
                  <th className="px-4 py-4 text-right text-sm font-semibold text-white/90 tracking-wide">العنوان</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-white/90 tracking-wide">المبلغ</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-white/90 tracking-wide">النوع</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-white/90 tracking-wide">الحالة</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-white/90 tracking-wide">التطبيقات</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-white/90 tracking-wide">الموظفين</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-white/90 tracking-wide">الموردين</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-white/90 tracking-wide">تاريخ الإنشاء</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-white/90 tracking-wide">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {subscriptions.length > 0 ? (
                  subscriptions.map((subscription, index) => (
                    <tr 
                      key={subscription.id} 
                      className="group hover:bg-slate-700/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                    >
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                            <span className="text-purple-400 font-bold text-sm">{subscription.title.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                              {subscription.title}
                            </div>
                            <div className="text-xs text-slate-400">اشتراك نشط</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-emerald-400">{formatCurrency(subscription.amount)}</span>
                          <span className="text-xs text-slate-400">/ شهر</span>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></span>
                          {subscription.subscription_type}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          subscription.status === "active" 
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                            : "bg-red-500/20 text-red-300 border border-red-500/30"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 animate-pulse ${
                            subscription.status === "active" ? "bg-emerald-400" : "bg-red-400"
                          }`}></span>
                          {subscription.status === "active" ? "نشط" : "غير نشط"}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-400" />
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="text-white font-semibold">{subscription.applications_count}</span>
                              <span className="text-slate-400 text-xs">/</span>
                              <span className="text-orange-400 font-semibold">{subscription.max_applications_count}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-400" />
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="text-white font-semibold">{subscription.employees_count}</span>
                              <span className="text-slate-400 text-xs">/</span>
                              <span className="text-orange-400 font-semibold">{subscription.max_employees_count}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-purple-400" />
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="text-white font-semibold">{subscription.vendors_count}</span>
                              <span className="text-slate-400 text-xs">/</span>
                              <span className="text-orange-400 font-semibold">{subscription.max_vendors_count}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-400" />
                          <div>
                            <div className="font-medium text-white text-xs">
                              {new Date(subscription.created_at).toLocaleDateString('ar-EG')}
                            </div>
                            <div className="text-xs text-amber-400">
                              {new Date(subscription.created_at).toLocaleTimeString('ar-EG', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: true 
                              })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5 text-center">
                        <button
                          onClick={() => openModal(subscription)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg group"
                        >
                          <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          عرض
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="w-20 h-20 bg-slate-700/30 rounded-full flex items-center justify-center">
                          <CreditCard className="w-10 h-10 text-slate-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-300 mb-2">لا توجد اشتراكات</h3>
                          <p className="text-slate-400">لم يتم العثور على أي اشتراكات في الوقت الحالي</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden p-4 space-y-4">
          {subscriptions.length > 0 ? (
            subscriptions.map((subscription, index) => (
              <div 
                key={subscription.id}
                className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-5 hover:bg-slate-700/40 transition-all duration-300 hover:shadow-lg"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                      <span className="text-purple-400 font-bold text-lg">{subscription.title.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{subscription.title}</h3>
                      <p className="text-sm text-slate-400">اشتراك نشط</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-bold text-emerald-400">{formatCurrency(subscription.amount)}</div>
                    <div className="text-xs text-slate-400">/ شهر</div>
                  </div>
                </div>

                {/* Status and Type */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                    {subscription.subscription_type}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    subscription.status === "active" 
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 animate-pulse ${
                      subscription.status === "active" ? "bg-emerald-400" : "bg-red-400"
                    }`}></span>
                    {subscription.status === "active" ? "نشط" : "غير نشط"}
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Building2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-white font-bold">{subscription.applications_count}</div>
                    <div className="text-xs text-slate-400">تطبيق</div>
                    <div className="text-xs text-orange-400">من {subscription.max_applications_count}</div>
                  </div>
                  <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-white font-bold">{subscription.employees_count}</div>
                    <div className="text-xs text-slate-400">موظف</div>
                    <div className="text-xs text-orange-400">من {subscription.max_employees_count}</div>
                  </div>
                  <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Building2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-white font-bold">{subscription.vendors_count}</div>
                    <div className="text-xs text-slate-400">مورد</div>
                    <div className="text-xs text-orange-400">من {subscription.max_vendors_count}</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-600/30">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>{new Date(subscription.created_at).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <button
                    onClick={() => openModal(subscription)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg group"
                  >
                    <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    عرض
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 bg-slate-700/30 rounded-full flex items-center justify-center">
                  <CreditCard className="w-10 h-10 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">لا توجد اشتراكات</h3>
                  <p className="text-slate-400">لم يتم العثور على أي اشتراكات في الوقت الحالي</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedSubscription && (
        <SubscriptionModal
          selectedSubscription={selectedSubscription}
          onClose={closeModal}
        />
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
