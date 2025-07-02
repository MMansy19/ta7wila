"use client"
import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import { MessageSquare, Wifi, WifiOff, Clock, Eye, Phone, Calendar } from "lucide-react";
import getAuthHeaders from "../Shared/getAuth";
export const dynamic = 'force-dynamic';

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface User {
  id: number;
  username: string;
  name: string;
  mobile: string;
  email: string;
  [key: string]: any;
}

interface PasswordChangeValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface WhatsAppMessage {
  id: string;
  recipient: string;
  message: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  sentAt: string;
}

interface WhatsAppSession {
  id: string;
  isConnected: boolean;
  lastActivity?: string;
  session?: any;
}

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const translations = useTranslation();
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // WhatsApp states
  const [whatsappSession, setWhatsappSession] = useState<WhatsAppSession | null>(null);
  const [qrCode, setQrCode] = useState<string>("");
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [showQR, setShowQR] = useState(false);

  const validationSchema = Yup.object({
    username: Yup.string().required(translations.auth.validation.nameRequired),
    name: Yup.string().required(translations.auth.validation.nameRequired),
    mobile: Yup.string().required(translations.auth.validation.mobileRequired),
    email: Yup.string().email(translations.auth.validation.invalidEmail).required(translations.auth.validation.emailRequired),
  });

  const passwordValidationSchema = Yup.object({
    currentPassword: Yup.string().required(translations.auth.forgetPassword.validation.passwordRequired),
    newPassword: Yup.string()
      .required(translations.auth.forgetPassword.validation.passwordRequired)
      .min(8, translations.auth.forgetPassword.validation.passwordMinLength),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], translations.auth.forgetPassword.validation.confirmPasswordMatch)
      .required(translations.auth.forgetPassword.validation.confirmPasswordRequired),
  });

  const copyToClipboard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText(token);
    toast.success(translations.settings.tokenCopied);
  };

  // WhatsApp functions
  const startConnectionCheck = () => {
    let connectionAttempts = 0;
    const maxConnectionAttempts = 90; // 90 seconds to complete connection
    
    const connectionInterval = setInterval(async () => {
      connectionAttempts++;
      try {
        const statusResponse = await fetch('/api/whatsapp?action=status');
        const statusData = await statusResponse.json();
        
        console.log(`Connection check ${connectionAttempts}:`, statusData);
        
        if (statusData.status === 'ready') {
          // Connection successful!
          setWhatsappSession({
            id: 'ta7wila-simple',
            isConnected: true,
            lastActivity: new Date().toISOString(),
            session: statusData.session
          });
          setShowQR(false);
          setQrCode("");
          clearInterval(connectionInterval);
          
          // Multiple success notifications
          toast.success("🎉 تم الاتصال بالواتساب بنجاح!");
          setTimeout(() => {
            toast.success("📱 الواتساب جاهز للاستخدام الآن");
          }, 2000);
          
        } else if (statusData.status === 'auth_failed') {
          clearInterval(connectionInterval);
          setShowQR(false);
          setQrCode("");
          toast.error("❌ فشل في المصادقة - يرجى المحاولة مرة أخرى");
          
        } else if (connectionAttempts >= maxConnectionAttempts) {
          clearInterval(connectionInterval);
          setShowQR(false);
          setQrCode("");
          toast.error("⏰ انتهت مهلة انتظار الاتصال - يرجى المحاولة مرة أخرى");
        }
        
      } catch (error) {
        console.error("Error checking connection:", error);
        if (connectionAttempts >= maxConnectionAttempts) {
          clearInterval(connectionInterval);
          setShowQR(false);
          setQrCode("");
          toast.error("خطأ في التحقق من حالة الاتصال");
        }
      }
    }, 1000); // Check every second
  };

  const generateQRCode = async () => {
    try {
      console.log('🚀 Starting QR generation...');
      
      // FORCE show QR section immediately
      setShowQR(true);
      setQrCode("");
      
      console.log('📱 showQR FORCED to true, qrCode cleared');
      
      toast.success("جاري الحصول على أحدث رمز QR...");
      
      // Function to get FRESH QR code
      const getFreshQR = async () => {
        const timestamp = Date.now();
        console.log(`📡 Fetching FRESH QR code at ${new Date().toLocaleTimeString()}...`);
        
        const qrResponse = await fetch(`/api/whatsapp?action=qr&t=${timestamp}`);
        const qrData = await qrResponse.json();
        
        console.log('📊 Fresh QR API Response:', {
          hasQR: !!qrData.qr,
          length: qrData.qr?.length || 0,
          timestamp: new Date().toLocaleTimeString()
        });
        
        return qrData;
      };
      
      // Get initial QR code
      let qrData = await getFreshQR();
      
      if (qrData.qr) {
        console.log('✅ QR Code received, setting state...');
        console.log('🔍 QR Code length:', qrData.qr.length);
        
        // FORCE set QR code
        setQrCode(qrData.qr);
        
        // Set session
        setWhatsappSession({
          id: 'ta7wila-simple',
          isConnected: false,
          lastActivity: new Date().toISOString()
        });
        
        toast.success("✅ تم الحصول على رمز QR جديد - امسحه من هاتفك الآن");
        
        // Auto-refresh QR code every 10 seconds to ensure it's always fresh
        const qrRefreshInterval = setInterval(async () => {
          try {
            console.log('🔄 Auto-refreshing QR code...');
            const freshQrData = await getFreshQR();
            
            if (freshQrData.qr && freshQrData.qr !== qrCode) {
              console.log('🆕 New QR code detected, updating...');
              setQrCode(freshQrData.qr);
              toast.success("تم تحديث رمز QR تلقائياً");
            }
          } catch (error) {
            console.error('❌ QR refresh error:', error);
          }
        }, 10000); // Every 10 seconds
        
        // Store interval reference to clear it later
        (window as any).qrRefreshInterval = qrRefreshInterval;
        
        console.log('🔄 Starting connection check...');
        startConnectionCheck();
        return; // Exit early since we got the QR
      } else {
        console.log('❌ No QR code in response');
        toast.error("فشل في الحصول على رمز QR - يرجى المحاولة مرة أخرى");
        setShowQR(false);
        return;
      }

    } catch (error) {
      console.error("QR Generation Error:", error);
      toast.error("فشل في إنشاء رمز QR");
      setShowQR(false);
    }
  };

  const connectWhatsApp = async () => {
    try {
      if (!whatsappSession?.id) {
        toast.error("لا يوجد session نشط");
        return;
      }

      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'connect',
          sessionId: whatsappSession.id
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setWhatsappSession(data.session);
        setShowQR(false);
        setQrCode("");
        toast.success(translations.whatsapp.sessions.connectionSuccess);
        loadMessages(); // Reload messages after connection
      } else {
        throw new Error(data.error || 'Failed to connect');
      }
    } catch (error) {
      console.error("Connection Error:", error);
      toast.error("فشل في الاتصال بواتساب");
    }
  };

  const disconnectWhatsApp = async () => {
    try {
      if (!whatsappSession?.id) {
        toast.error("لا يوجد session للقطع");
        return;
      }

      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'disconnect',
          sessionId: whatsappSession.id
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setWhatsappSession(null);
        setQrCode("");
        setShowQR(false);
        toast.success(translations.whatsapp.sessions.sessionDisconnected);
      } else {
        throw new Error(data.error || 'Failed to disconnect');
      }
    } catch (error) {
      console.error("Disconnect Error:", error);
      toast.error("فشل في قطع الاتصال");
    }
  };

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/whatsapp?action=getMessages', {
        method: 'GET',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages);
      } else {
        console.error("Failed to load messages:", data.error);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const checkSessionStatus = async () => {
    try {
      const response = await fetch('/api/whatsapp?action=getSessions', {
        method: 'GET',
      });
      
      const data = await response.json();
      
      if (data.success && data.sessions.length > 0) {
        const activeSession = data.sessions.find((s: any) => s.isConnected);
        if (activeSession) {
          setWhatsappSession(activeSession);
        }
      }
    } catch (error) {
      console.error("Error checking session status:", error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${apiUrl}/profile`, { headers: getAuthHeaders() });
        setUser(response.data.result.profile);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else if (error.response?.data.errorMessage ) {
            toast.error(error.response?.data.errorMessage);
          } else if (error.response?.status === 401) {
            toast.error("Unauthorized access");
          } else {
            toast.error(translations.errors?.developerMode || "Failed to fetch profile data");
          }
        }
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchToken = async () => {
      try {
        const response = await axios.get(`${apiUrl}/token`, { headers: getAuthHeaders() });
        setToken(response.data.result.value);
      } catch (error) {
        console.error("Error fetching token:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error(translations.errors?.developerMode || "Failed to fetch token");
          }
        }
      }
    };

    fetchUserProfile();
    fetchToken();
    loadMessages();
    checkSessionStatus();
  }, [translations.errors?.developerMode]);

  const handleSubmit = async (
    values: User,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    setSubmitting(true);
    try {
      const response = await axios.post(
        `${apiUrl}/profile/update`, 
        values, 
        { headers: getAuthHeaders() }
      );
      const updatedUser = response.data.result;
      setUser(prev => prev ? { ...prev, ...updatedUser } : updatedUser);
      toast.success(translations.settings?.profileUpdated || "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(translations.errors?.developerMode || "Failed to update profile");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async (
    values: PasswordChangeValues,
    { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    setSubmitting(true);
    try {
      await axios.post(
        `${apiUrl}/profile/change-password`,
        {
          id: user?.id,
          password: values.currentPassword,
          newPassword: values.newPassword,
        },
        { headers: getAuthHeaders() }
      );
      toast.success(translations.settings?.passwordChanged || "Password changed successfully");
      resetForm();
    } catch (error) {
      console.error("Error changing password:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(translations.errors?.developerMode || "Failed to change password");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#53B4AB]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <div className="text-center p-8 rounded-lg bg-neutral-800">
          <div className="text-red-500 text-xl mb-4">
            {translations.errors?.developerMode || "An error occurred"}
          </div>
          <div className="text-white/70 mb-4">{error}</div>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              window.location.reload();
            }}
            className="bg-[#53B4AB] hover:bg-[#347871] text-black px-6 py-2 rounded-lg"
          >
            {"Try Again"}
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#53B4AB]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              إعدادات الحساب
            </h1>
            <p className="text-slate-400 mt-2">إدارة معلوماتك الشخصية وإعدادات التطبيق</p>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <Formik
        initialValues={{
          id: user.id,
          username: user.username || "",
          name: user.name || "",
          mobile: user.mobile || "",
          email: user.email || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="mb-8">
            <div className="backdrop-blur-sm bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{translations.header.profile}</h2>
                  <p className="text-slate-400">تحديث معلوماتك الشخصية</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Username */}
                <div className="space-y-2">
                  <Field type="hidden" name="id" />
                  <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {translations.auth.userName}
                    </div>
                  </label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                  <ErrorMessage name="username" component="p" className="text-red-400 text-sm mt-1" />
                </div>
                
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {translations.auth.name}
                    </div>
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                  />
                  <ErrorMessage name="name" component="p" className="text-red-400 text-sm mt-1" />
                </div>
                
                {/* Mobile */}
                <div className="space-y-2">
                  <label htmlFor="mobile" className="block text-sm font-medium text-slate-300 mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {translations.auth.mobile}
                    </div>
                  </label>
                  <Field
                    type="text"
                    id="mobile"
                    name="mobile"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  />
                  <ErrorMessage name="mobile" component="p" className="text-red-400 text-sm mt-1" />
                </div>
                
                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {translations.auth.email}
                    </div>
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
                  />
                  <ErrorMessage name="email" component="p" className="text-red-400 text-sm mt-1" />
                </div>
              </div>
              
              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500/80 to-teal-500/80 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                      </svg>
                      {translations.auth.submitting}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {translations.header.updateProfile}
                    </>
                  )}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {/* App Token Section */}
      <div className="backdrop-blur-sm bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{translations.settings.appToken}</h2>
            <p className="text-slate-400">مفتاح API الخاص بتطبيقك</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="app-token" className="block text-sm font-medium text-slate-300 mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {translations.settings.Token}
              </div>
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                id="app-token"
                value={token}
                className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white font-mono text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                readOnly
              />
              <button 
                onClick={copyToClipboard} 
                className="px-4 py-3 bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                نسخ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Section */}
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={passwordValidationSchema}
        onSubmit={handlePasswordChange}
      >
        {({ isSubmitting }) => (
          <Form className="backdrop-blur-sm bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 shadow-2xl hover:shadow-red-500/10 transition-all duration-300 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl border border-red-500/30">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{translations.auth.forgetPassword.resetTitle}</h2>
                <p className="text-slate-400">تحديث كلمة المرور الخاصة بك</p>
              </div>
            </div>
            
            {/* Current Password */}
            <div className="space-y-2">
              <label htmlFor="current-password" className="block text-sm font-medium text-slate-300 mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {translations.auth.password}
                </div>
              </label>
              <Field
                name="currentPassword"
                type="password"
                id="current-password"
                placeholder={translations.auth.password}
                autoComplete="off"
                autoCorrect="off"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
              />
              <ErrorMessage
                name="currentPassword"
                component="p"
                className="text-red-400 text-sm"
                aria-live="assertive"
              />
            </div>
            
            {/* New Password */}
            <div className="space-y-2">
              <label htmlFor="new-password" className="block text-sm font-medium text-slate-300 mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                  </svg>
                  {translations.auth.forgetPassword.newPassword}
                </div>
              </label>
              <Field
                name="newPassword"
                type="password"
                id="new-password"
                placeholder={translations.auth.forgetPassword.newPassword}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
              />
              <ErrorMessage
                name="newPassword"
                component="p"
                className="text-red-400 text-sm"
                aria-live="assertive"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-300 mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {translations.auth.forgetPassword.confirmPassword}
                </div>
              </label>
              <Field
                name="confirmPassword"
                type="password"
                id="confirm-password"
                placeholder={translations.auth.forgetPassword.confirmPassword}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
              />
              <ErrorMessage
                name="confirmPassword"
                component="p"
                className="text-red-400 text-sm"
                aria-live="assertive"
              />
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-red-500/80 to-orange-500/80 hover:from-red-500 hover:to-orange-500 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                    </svg>
                    {translations.auth.forgetPassword.resetting}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {translations.auth.forgetPassword.resetPassword}
                  </>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {/* WhatsApp Settings Section */}
      <div className="backdrop-blur-sm bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
            <MessageSquare className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{translations.whatsapp.title}</h2>
            <p className="text-slate-400">{translations.whatsapp.subtitle}</p>
          </div>
        </div>
        
        {/* Connection Status */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            {whatsappSession?.isConnected ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            حالة الاتصال
          </h3>
          
          <div className="bg-slate-700/50 border border-slate-600/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${whatsappSession?.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="font-medium">
                  {whatsappSession?.isConnected ? translations.whatsapp.sessions.connected : translations.whatsapp.sessions.disconnected}
                </span>
              </div>
              
              {whatsappSession?.isConnected ? (
                <button
                  onClick={disconnectWhatsApp}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                >
                  {translations.whatsapp.sessions.disconnect}
                </button>
              ) : (
                <button
                  onClick={generateQRCode}
                  className="px-4 py-2 bg-[#53B4AB] hover:bg-[#347871] text-black rounded-lg text-sm transition-colors"
                >
                  {translations.whatsapp.sessions.connect}
                </button>
              )}
            </div>
            
            {whatsappSession?.lastActivity && (
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Clock className="w-4 h-4" />
                {translations.whatsapp.sessions.lastActivity}: {new Date(whatsappSession.lastActivity).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* QR Control Panel */}
        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">🎛️ QR Control Panel</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={async () => {
                try {
                  const timestamp = Date.now();
                  const res = await fetch(`/api/whatsapp?action=qr&t=${timestamp}`);
                  const data = await res.json();
                  if (data.qr) {
                    setQrCode(data.qr);
                    setShowQR(true);
                    toast.success('🔄 تم تحديث QR Code يدوياً');
                  } else {
                    toast.error('❌ فشل في الحصول على QR Code');
                  }
                } catch (err) {
                  console.error('Manual QR refresh error:', err);
                  toast.error('❌ خطأ في تحديث QR Code');
                }
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              🔄 تحديث QR يدوياً
            </button>
            
            <button
              onClick={() => {
                // Clear the auto-refresh interval
                if ((window as any).qrRefreshInterval) {
                  clearInterval((window as any).qrRefreshInterval);
                  (window as any).qrRefreshInterval = null;
                  toast.success('⏹️ تم إيقاف التحديث التلقائي');
                                 } else {
                   toast.success('⚠️ التحديث التلقائي غير نشط');
                 }
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              ⏹️ إيقاف التحديث التلقائي
            </button>
            
            <button
              onClick={() => {
                setShowQR(!showQR);
                console.log('Toggle showQR to:', !showQR);
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg text-sm"
            >
              👁️ إظهار/إخفاء QR
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-700 p-3 rounded">
              <strong>حالة العرض:</strong> {showQR ? '✅ مُفعل' : '❌ مُعطل'}
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <strong>QR Code:</strong> {qrCode ? `✅ متوفر (${Math.round(qrCode.length/1000)}KB)` : '❌ غير متوفر'}
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <strong>التحديث التلقائي:</strong> {(window as any)?.qrRefreshInterval ? '🔄 نشط' : '⏹️ متوقف'}
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <strong>آخر تحديث:</strong> {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        {(() => {
          console.log('🎯 UI Render - showQR:', showQR, 'qrCode length:', qrCode?.length || 0);
          return null;
        })()}
        {showQR && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">رمز QR للاتصال</h3>
            <div className="bg-[#444444] rounded-lg p-6 text-center">
              {qrCode ? (
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-lg inline-block shadow-lg">
                    <img 
                      src={qrCode} 
                      alt="WhatsApp QR Code" 
                      className="w-64 h-64 mx-auto"
                      onLoad={() => console.log('🖼️ QR Image loaded successfully')}
                      onError={() => console.log('❌ QR Image failed to load')}
                    />
                  </div>
                  <div className="bg-green-500/20 text-green-400 p-3 rounded-lg mb-2">
                    ✅ رمز QR جاهز للمسح - يتم التحديث كل 10 ثوانٍ تلقائياً
                  </div>
                  <div className="bg-blue-500/20 text-blue-400 p-2 rounded text-sm mb-3">
                    📅 آخر تحديث: {new Date().toLocaleString('ar-EG')}
                  </div>
                  <p className="text-white/70">{translations.whatsapp.qrScanner.subtitle}</p>
                  <div className="text-sm text-white/60 space-y-1">
                    <p>{translations.whatsapp.qrScanner.step1}</p>
                    <p>{translations.whatsapp.qrScanner.step2}</p>
                    <p>{translations.whatsapp.qrScanner.step3}</p>
                  </div>
                  <button
                    onClick={connectWhatsApp}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
                  >
                    {translations.whatsapp.qrScanner.simulateScan}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#53B4AB] mx-auto"></div>
                  <p className="text-white/70">{translations.whatsapp.qrScanner.generating}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Message History */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#53B4AB]" />
                         سجل الرسائل المرسلة
          </h3>
          
          <div className="bg-[#444444] rounded-lg">
            {messages.length > 0 ? (
              <div className="space-y-1">
                {messages.map((message) => (
                  <div key={message.id} className="p-4 border-b border-white/10 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#53B4AB]" />
                        <span className="font-medium">{message.recipient}</span>
                      </div>
                      <div className="flex items-center gap-2">
                                                 <span className={`px-2 py-1 rounded-full text-xs ${
                           message.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                           message.status === 'read' ? 'bg-blue-500/20 text-blue-400' :
                           message.status === 'sent' ? 'bg-yellow-500/20 text-yellow-400' :
                           'bg-red-500/20 text-red-400'
                         }`}>
                           {message.status === 'delivered' ? 'تم التسليم' :
                            message.status === 'read' ? 'تم القراءة' :
                            message.status === 'sent' ? 'تم الإرسال' : 'فشل الإرسال'}
                         </span>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm mb-2 line-clamp-2">{message.message}</p>
                    <div className="flex items-center gap-2 text-white/60 text-xs">
                      <Calendar className="w-3 h-3" />
                      {new Date(message.sentAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-white/60">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                 <p>لا توجد رسائل مرسلة</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}