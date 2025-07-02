"use client";
import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import getAuthHeaders from "../../Shared/getAuth";
import { formatDateTime } from "@/lib/utils";
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
export const dynamic = 'force-dynamic';

export default function StoreDetails({ params }: { params: Promise<Params> }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [storeDetails, setStoreDetails] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const translations = useTranslation();
  const [resolvedParams, setResolvedParams] = useState<Params | null>(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [messageHistory, setMessageHistory] = useState<any[]>([]);

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
        const response = await axios.get(
          `${apiUrl}/applications/${id}`,
          {
            headers: {
              ...getAuthHeaders(),
            },
          }
        );
        setStoreDetails(response.data.result || {});
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    
    // Load WhatsApp messages for this store
    loadStoreMessages();
    
    return () => clearInterval(intervalId);
  }, [resolvedParams, apiUrl]);

  useEffect(() => {
    if (error) {
      toast.error("Error fetching transactions!");
    }
  }, [error]);

  const copyPaymentLink = () => {
    if (!resolvedParams || !storeDetails) return;
    
    const { id, lang } = resolvedParams;
    const baseUrl = window.location.origin;
    const paymentLink = `${baseUrl}/${lang}/public-payment/${id}`;
    
    navigator.clipboard.writeText(paymentLink);
    toast.success(translations.storeDetails.paymentLinkCopied || "Payment link copied to clipboard!");
  };

  const openWhatsAppModal = () => {
    setShowWhatsAppModal(true);
    setPhoneNumber("");
    setMessage("");
    setSelectedTemplate("");
  };

  const sendWhatsAppMessage = async () => {
    if (!phoneNumber) {
      toast.error("يرجى إدخال رقم الهاتف");
      return;
    }

    if (!message.trim()) {
      toast.error("يرجى إدخال رسالة");
      return;
    }

    setIsSendingWhatsApp(true);

    try {
      // First, check if there's an active WhatsApp session
      const sessionsResponse = await fetch('/api/whatsapp?action=getSessions');
      const sessionsData = await sessionsResponse.json();
      
      let activeSession = null;
      if (sessionsData.success && sessionsData.sessions.length > 0) {
        activeSession = sessionsData.sessions.find((s: any) => s.isConnected);
      }
      
      if (!activeSession) {
        toast.error("لا يوجد اتصال واتساب نشط. يرجى الاتصال بواتساب من صفحة الإعدادات أولاً");
        setIsSendingWhatsApp(false);
        return;
      }

      // Format phone number (remove any non-digit characters except +)
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber.replace(/\D/g, '')}`;
      
      // Send message via API
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sendMessage',
          sessionId: activeSession.id,
          recipient: formattedNumber,
          message: message.trim(),
          storeId: storeDetails.id
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Add message to local history
        const newMessage = {
          id: data.messageId,
          recipient: formattedNumber,
          message: message.trim(),
          status: 'sent' as const,
          sentAt: new Date().toISOString(),
          storeId: storeDetails.id
        };
        
        setMessageHistory(prev => [newMessage, ...prev]);
        
        toast.success("تم إرسال الرسالة بنجاح!");
        
        // Optionally open WhatsApp Web for manual verification
        if (data.whatsappUrl) {
          const popup = window.open(
            data.whatsappUrl,
            'whatsapp-popup',
            'width=800,height=600,scrollbars=yes,resizable=yes'
          );
          
          if (popup) {
            popup.blur();
            window.focus();
          }
        }
        
        // Close the modal
        setShowWhatsAppModal(false);
        setPhoneNumber("");
        setMessage("");
        setSelectedTemplate("");
      } else {
        throw new Error(data.error || 'Failed to send message');
      }

    } catch (error: any) {
      console.error("WhatsApp send error:", error);
      toast.error(`فشل في إرسال الرسالة: ${error.message || 'خطأ غير معروف'}`);
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  // Function to handle template selection
  const handleTemplateSelect = (templateNumber: number) => {
    const { id, lang } = resolvedParams || {};
    const baseUrl = window.location.origin;
    const paymentLink = `${baseUrl}/${lang}/public-payment/${id}`;
    const storeName = storeDetails?.name || "المتجر";
    
    let templateMessage = "";
    switch (templateNumber) {
      case 1:
        templateMessage = `مرحباً! هذا رابط الدفع الخاص بمتجر ${storeName}: ${paymentLink}`;
        break;
      case 2:
        templateMessage = `يمكنك الآن الدفع بسهولة من خلال هذا الرابط: ${paymentLink} - شكراً لك!`;
        break;
      case 3:
        templateMessage = `عزيزي العميل، يرجى استكمال عملية الدفع من خلال الرابط التالي: ${paymentLink}`;
        break;
    }
    
    setMessage(templateMessage);
    setSelectedTemplate(templateNumber.toString());
  };

  // Load messages for this specific store
  const loadStoreMessages = async () => {
    if (!resolvedParams?.id) return;
    
    try {
      const response = await fetch(`/api/whatsapp?action=getMessages&storeId=${resolvedParams.id}`);
      const data = await response.json();
      
      if (data.success) {
        setMessageHistory(data.messages);
      }
    } catch (error) {
      console.error("Error loading store messages:", error);
    }
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
            
            <button
              onClick={openWhatsAppModal}
              className="group flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-[#25D366] to-[#1DA851] hover:from-[#1DA851] hover:to-[#25D366] text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#25D366]/25"
            >
              <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm lg:text-base">{translations.storeDetails?.shareViaWhatsApp || "مشاركة عبر واتساب"}</span>
            </button>
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

      {/* WhatsApp Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-gradient-to-br from-neutral-800/90 to-neutral-900/90 backdrop-blur-xl rounded-2xl w-full max-w-sm sm:max-w-md lg:max-w-2xl xl:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-white/10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#25D366]/20 to-[#25D366]/10 flex items-center justify-center border border-[#25D366]/20">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#25D366]" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-white">
                  إرسال رابط الدفع عبر واتساب
                </h3>
              </div>
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row h-[calc(95vh-80px)] sm:h-[calc(90vh-120px)]">
              {/* Left Side - Message Form */}
              <div className="w-full lg:w-2/3 p-3 sm:p-4 lg:p-6 lg:border-r border-white/10 overflow-y-auto">
                <div className="space-y-4 sm:space-y-6">
                  {/* Phone Number Input */}
                  <div>
                    <label className="block text-white/80 text-xs sm:text-sm mb-2 font-medium">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="مثال: 201234567890"
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-neutral-700/50 backdrop-blur-sm text-white rounded-xl border border-white/10 focus:border-[#25D366]/50 focus:outline-none focus:ring-2 focus:ring-[#25D366]/20 transition-all text-sm"
                    />
                    <p className="text-xs text-white/50 mt-1">
                      يجب تضمين كود الدولة (مثال: 20 لمصر)
                    </p>
                  </div>
                  
                  {/* Message Templates */}
                  <div>
                    <label className="block text-white/80 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
                      قوالب الرسائل
                    </label>
                    <div className="space-y-2 sm:space-y-3">
                      <button
                        onClick={() => handleTemplateSelect(1)}
                        className={`w-full p-3 sm:p-4 text-right rounded-xl border transition-all ${
                          selectedTemplate === '1' 
                            ? 'bg-[#25D366]/20 border-[#25D366]/50 text-[#25D366]' 
                            : 'bg-neutral-700/30 border-white/10 text-white/80 hover:bg-neutral-700/50'
                        }`}
                      >
                        <p className="text-xs sm:text-sm font-medium mb-1">القالب الأول</p>
                        <p className="text-xs opacity-80">مرحباً! هذا رابط الدفع الخاص بمتجر...</p>
                      </button>
                      
                      <button
                        onClick={() => handleTemplateSelect(2)}
                        className={`w-full p-3 sm:p-4 text-right rounded-xl border transition-all ${
                          selectedTemplate === '2' 
                            ? 'bg-[#25D366]/20 border-[#25D366]/50 text-[#25D366]' 
                            : 'bg-neutral-700/30 border-white/10 text-white/80 hover:bg-neutral-700/50'
                        }`}
                      >
                        <p className="text-xs sm:text-sm font-medium mb-1">القالب الثاني</p>
                        <p className="text-xs opacity-80">يمكنك الآن الدفع بسهولة من خلال هذا الرابط...</p>
                      </button>
                      
                      <button
                        onClick={() => handleTemplateSelect(3)}
                        className={`w-full p-3 sm:p-4 text-right rounded-xl border transition-all ${
                          selectedTemplate === '3' 
                            ? 'bg-[#25D366]/20 border-[#25D366]/50 text-[#25D366]' 
                            : 'bg-neutral-700/30 border-white/10 text-white/80 hover:bg-neutral-700/50'
                        }`}
                      >
                        <p className="text-xs sm:text-sm font-medium mb-1">القالب الثالث</p>
                        <p className="text-xs opacity-80">عزيزي العميل، يرجى استكمال عملية الدفع...</p>
                      </button>
                    </div>
                  </div>
                  
                  {/* Custom Message */}
                  <div>
                    <label className="block text-white/80 text-xs sm:text-sm mb-2 font-medium">
                      رسالة مخصصة
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      placeholder="اكتب رسالتك هنا أو اختر قالب من الأعلى..."
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-neutral-700/50 backdrop-blur-sm text-white rounded-xl border border-white/10 focus:border-[#25D366]/50 focus:outline-none focus:ring-2 focus:ring-[#25D366]/20 transition-all resize-none text-sm"
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 sm:gap-3 pt-2 sm:pt-4">
                    <button
                      onClick={() => setShowWhatsAppModal(false)}
                      className="px-4 py-2 sm:px-6 sm:py-3 text-white/60 hover:text-white transition-colors rounded-xl hover:bg-white/5 text-sm"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={sendWhatsAppMessage}
                      disabled={isSendingWhatsApp}
                      className="flex items-center gap-2 px-6 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-[#25D366] to-[#1DA851] hover:from-[#1DA851] hover:to-[#25D366] disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200 text-sm"
                    >
                      {isSendingWhatsApp ? (
                        <>
                          <div className="animate-spin h-3 w-3 sm:h-4 sm:w-4 border-2 border-white/30 border-t-white rounded-full" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                          إرسال الرسالة
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Message History */}
              <div className="w-full lg:w-1/3 p-3 sm:p-4 lg:p-6 overflow-y-auto border-t lg:border-t-0 border-white/10">
                <h4 className="text-white font-medium text-xs sm:text-sm mb-3 sm:mb-4 flex items-center gap-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#53B4AB]" />
                  سجل رسائل المتجر
                </h4>
                
                <div className="space-y-2 sm:space-y-3">
                  {messageHistory.length > 0 ? (
                    messageHistory.map((msg) => (
                      <div key={msg.id} className="bg-neutral-700/30 rounded-lg p-2 sm:p-3">
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <span className="text-[#25D366] text-xs sm:text-sm font-medium truncate">{msg.recipient}</span>
                          <span className="text-green-400 text-xs">تم الإرسال</span>
                        </div>
                        <p className="text-white/80 text-xs mb-1 sm:mb-2 line-clamp-2">{msg.message}</p>
                        <p className="text-white/50 text-xs">{new Date(msg.sentAt).toLocaleString()}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <MessageCircle className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-white/30" />
                      <p className="text-white/50 text-xs sm:text-sm">لا توجد رسائل مرسلة من هذا المتجر</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}