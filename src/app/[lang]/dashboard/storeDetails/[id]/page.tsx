"use client";
import { useTranslation } from '@/hooks/useTranslation';
import { isAuthenticated } from '@/lib/auth';
import axios from "axios";
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import getAuthHeaders from "../../Shared/getAuth";
import { formatDateTime } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import { 
  Store, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  Clock, 
  Copy, 
  MessageCircle, 
  X, 
  Send,
  Users,
  CreditCard,
  Activity,
  BarChart3,
  TrendingUp,
  Shield
} from "lucide-react";
import Employees from "../employees";
import Payments from "../payments";
import Table from "../table";
import { Params } from "../types";
import WhatsAppShareModal from "./WhatsAppShareModal";
export const dynamic = 'force-dynamic';

export default function StoreDetails({ params }: { params: Promise<Params> }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [storeDetails, setStoreDetails] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const translations = useTranslation();
  const [resolvedParams, setResolvedParams] = useState<Params | null>(null);
  const [paymentLink, setPaymentLink] = useState("");

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("يرجى تسجيل الدخول للوصول لهذه الصفحة");
      router.push('/login');
      return;
    }
  }, [router]);

  // Resolve the params Promise
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolved = await params;
        setResolvedParams(resolved);
      } catch (err) {
        setError(err as Error);
      }
    };
    
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchData = async () => {
      const { id } = resolvedParams;
      try {
        const authHeaders = getAuthHeaders();
        console.log('Auth headers:', authHeaders); // Debug log
        
        const response = await axios.get(
          `${apiUrl}/applications/${id}`,
          {
            headers: authHeaders,
          }
        );
        setStoreDetails(response.data.result || {});
        
        // Generate and set payment link
        const { lang } = resolvedParams;
        const baseUrl = window.location.origin;
        const storeName = response.data.result?.name ? encodeURIComponent(response.data.result.name) : '';
        const link = `${baseUrl}/${lang}/public-payment/${response.data.result?.subdomain}?store=${storeName}`;
        setPaymentLink(link);
        
        setError(null);
      } catch (err: any) {
        console.error('API Error:', err);
        if (err.response?.status === 401) {
          toast.error("انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.");
          router.push(`/${resolvedParams.lang}/login`);
        } else {
          toast.error("خطأ في جلب بيانات المتجر");
        }
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    
    return () => clearInterval(intervalId);
  }, [resolvedParams, apiUrl]);

  useEffect(() => {
    if (error) {
      toast.error("Error fetching transactions!");
    }
  }, [error]);

  const copyPaymentLink = () => {
    if (!paymentLink) return;
    
    navigator.clipboard.writeText(paymentLink);
    toast.success(translations.storeDetails.paymentLinkCopied || "Payment link copied to clipboard!");
  };

  if (isLoading || !resolvedParams) {
    return <div>{translations.storeDetails.loading}</div>;
  }

  if (error || !storeDetails) {
    return <div>{translations.storeDetails.error}</div>;
  }

  return (
    <div className="space-y-6 p-4 lg:p-6 bg-neutral-900 min-h-screen">
      {/* Store Header Card */}
      <div className="bg-gradient-to-br from-neutral-800/40 to-neutral-900/60 backdrop-blur-sm rounded-2xl border border-white/10 p-4 lg:p-6">
        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
          {/* Store Basic Info */}
          <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#53B4AB]/20 to-[#53B4AB]/10 flex items-center justify-center border border-[#53B4AB]/20">
              <Store className="w-8 h-8 text-[#53B4AB]" />
            </div>
            <div className="flex-1 w-full">
              <h1 className="text-xl lg:text-2xl font-bold text-white mb-2">{storeDetails.name}</h1>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-white/40 text-sm">ID:</span>
                <span className="text-white/60 font-medium">{storeDetails.id}</span>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  storeDetails.status === 'active' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    storeDetails.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-orange-400'
                  }`}></div>
                  {storeDetails.status === 'active' ? 'نشط' : 'غير نشط'}
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F58C7B]/20 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-[#F58C7B]" />
                  </div>
                  <span className="text-[#F58C7B] font-medium text-sm" style={{ direction: "ltr" }}>
                    {storeDetails.mobile}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-blue-400 font-medium text-sm truncate">{storeDetails.email}</span>
                </div>
                
                {storeDetails.webhook_url && (
                  <div className="flex items-center gap-3 lg:col-span-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-purple-400 font-medium text-sm truncate">{storeDetails.webhook_url}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Store Dates */}
          <div className="flex flex-col gap-3 xl:min-w-[200px]">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-white/60 text-xs">تاريخ الإنشاء</span>
                <div className="flex flex-col text-right">
                  <span className="text-white font-medium text-sm">{formatDateTime(storeDetails.created_at).date}</span>
                  <span className="text-emerald-400 font-medium text-xs">{formatDateTime(storeDetails.created_at).time}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-white/60 text-xs">آخر تحديث</span>
                <div className="flex flex-col text-right">
                  <span className="text-white font-medium text-sm">{formatDateTime(storeDetails.updated_at).date}</span>
                  <span className="text-amber-400 font-medium text-xs">{formatDateTime(storeDetails.updated_at).time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-gradient-to-br from-[#53B4AB]/20 to-[#53B4AB]/10 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-[#53B4AB]/20">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-[#53B4AB]/20 flex items-center justify-center">
              <CreditCard className="w-4 h-4 lg:w-5 lg:h-5 text-[#53B4AB]" />
            </div>
            <div>
              <p className="text-white/60 text-xs">طرق الدفع</p>
              <p className="text-white font-semibold text-sm lg:text-lg">{storeDetails.payment_options?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-blue-500/20">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Users className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white/60 text-xs">الموظفون</p>
              <p className="text-white font-semibold text-sm lg:text-lg">{storeDetails.application_employees?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-green-500/20">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white/60 text-xs">المدفوعات</p>
              <p className="text-white font-semibold text-sm lg:text-lg">{storeDetails.payments?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-purple-500/20">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white/60 text-xs">المعاملات</p>
              <p className="text-white font-semibold text-sm lg:text-lg">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Link Section */}
      <div className="bg-gradient-to-br from-neutral-800/40 to-neutral-900/60 backdrop-blur-sm rounded-2xl border border-white/10 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          <div className="flex items-start gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-[#53B4AB]/20 to-[#53B4AB]/10 flex items-center justify-center border border-[#53B4AB]/20">
              <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-[#53B4AB]" />
            </div>
            <div>
              <h3 className="font-semibold text-lg lg:text-xl text-white mb-2">
                {translations.storeDetails.publicPaymentLink || "رابط الدفع العام"}
              </h3>
              <p className="text-white/60 text-sm">
                {translations.storeDetails.sharePaymentLink || "شارك هذا الرابط مع العملاء للسماح لهم بإجراء المدفوعات مباشرة"}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={copyPaymentLink}
              className="group flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-[#53B4AB]/20 to-[#53B4AB]/10 hover:from-[#53B4AB]/30 hover:to-[#53B4AB]/20 text-[#53B4AB] hover:text-white rounded-xl font-medium transition-all duration-200 border border-[#53B4AB]/20 hover:border-[#53B4AB]/40"
            >
              <Copy className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm lg:text-base">{translations.storeDetails.copyPaymentLink || "نسخ الرابط"}</span>
            </button>
            
            {storeDetails && paymentLink && (
              <WhatsAppShareModal 
                storeName={storeDetails.name || ''} 
                paymentLink={paymentLink}
              />
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Payments & Employees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Payments Section */}
        <div className="w-full">
          <Payments payments={storeDetails.payments || []} />
        </div>
        
        {/* Employees Section */}
        <div className="w-full">
          <Employees employees={storeDetails.application_employees || []} params={resolvedParams} />
        </div>
      </div>

      {/* Transactions Table - Full Width */}
      <div className="w-full">
        <Table params={resolvedParams} />
      </div>
    </div>
  );
}