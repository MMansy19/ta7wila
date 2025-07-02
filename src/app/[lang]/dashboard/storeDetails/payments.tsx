"use client";
import { useTranslation } from '@/hooks/useTranslation';
import { formatDateTime } from "@/lib/utils";
import { CreditCard, Eye, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

type Payment = {
  id: number;
  value: string;
  payment_option: string;
  status: string;
  created_at: string;
  ref_id: string;
  is_public: boolean
};

type PaymentsProps = {
  payments?: Payment[];
};

export default function Payments({ payments = [] }: PaymentsProps) {
  const paymentOptions = [
    { name: "VF- CASH", key: "vcash", img: "/vcash.svg" },
    { name: "Et- CASH", key: "ecash", img: "/ecash.svg" },
    { name: "WE- CASH", key: "wecash", img: "/wecash.svg" },
    { name: "OR- CASH", key: "ocash", img: "/ocash.svg" },
    { name: "INSTAPAY", key: "instapay", img: "/instapay.svg" },
  ];

  const translations = useTranslation();

  return (
    <div className="bg-gradient-to-br from-neutral-800/40 to-neutral-900/60 backdrop-blur-sm rounded-2xl border border-white/10 p-4 lg:p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 lg:mb-6">
        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center border border-green-500/20">
          <CreditCard className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
        </div>
        <div>
          <h2 className="text-base lg:text-lg font-bold text-white">{translations.storeDetails.payments.title}</h2>
          <p className="text-white/60 text-xs lg:text-sm">طرق الدفع المتاحة</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 lg:py-12 text-white/50 flex-1">
          <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center mb-3 lg:mb-4 backdrop-blur-sm border border-white/10">
            <CreditCard className="w-6 h-6 lg:w-8 lg:h-8 text-white/30" />
          </div>
          <h3 className="text-base lg:text-lg font-semibold text-white/70 mb-2">لا توجد مدفوعات</h3>
          <p className="text-xs lg:text-sm text-center">{translations.storeDetails.payments.noData}</p>
        </div>
      ) : (
        <div className="space-y-3 lg:space-y-4 flex-1 overflow-y-auto">
          {payments.map((payment) => {
            const paymentOptionsArray = payment.payment_option
              ? payment.payment_option.split(",").map(opt => opt.trim())
              : [];

            return (
              <div 
                key={payment.id} 
                className="group bg-black/20 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-white/10 hover:border-white/20 transition-all duration-200 hover:bg-black/30"
              >
                <div className="flex items-center justify-between mb-2 lg:mb-3">
                  <div className="flex items-center gap-2 lg:gap-3">
                    {/* Payment Icons */}
                    <div className="flex -space-x-1 lg:-space-x-2">
                      {paymentOptionsArray.slice(0, 3).map((paymentKey, index) => {
                        const selectedOption = paymentOptions.find(option => option.key === paymentKey);
                        if (!selectedOption) return null;

                        return (
                          <div 
                            key={index}
                            className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center p-1 lg:p-1.5"
                          >
                            <Image
                              width={20}
                              height={20}
                              loading="lazy"
                              src={selectedOption.img}
                              alt={selectedOption.name}
                              className="object-contain w-full h-full"
                            />
                          </div>
                        );
                      })}
                      {paymentOptionsArray.length > 3 && (
                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center">
                          <span className="text-xs text-white/70 font-medium">+{paymentOptionsArray.length - 3}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-white font-medium text-xs lg:text-sm">{payment.payment_option}</p>
                      <p className="text-green-400 font-bold text-sm lg:text-lg">{payment.value} ج.م</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs font-medium border ${
                    payment.is_public 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                  }`}>
                    {payment.is_public ? (
                      <>
                        <CheckCircle className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                        <span className="hidden sm:inline">{translations.storeDetails.payments.payment.status.published}</span>
                        <span className="sm:hidden">نشر</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                        <span className="hidden sm:inline">{translations.storeDetails.payments.payment.status.notPublished}</span>
                        <span className="sm:hidden">غير منشور</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Payment Details */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 lg:gap-4 text-white/60">
                    <span>ID: {payment.ref_id}</span>
                    <span className="hidden sm:inline">{formatDateTime(payment.created_at).date}</span>
                    <span className="text-amber-400">{formatDateTime(payment.created_at).time}</span>
                  </div>
                  
                  <button className="group/btn flex items-center gap-1 lg:gap-1.5 px-2 lg:px-3 py-1 lg:py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-white rounded-lg transition-all duration-200 border border-blue-500/20 hover:border-blue-500/40">
                    <Eye className="w-2.5 h-2.5 lg:w-3 lg:h-3 group-hover/btn:scale-110 transition-transform duration-200" />
                    <span className="text-xs">عرض</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
