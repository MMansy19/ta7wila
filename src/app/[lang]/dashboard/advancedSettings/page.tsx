"use client";
import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";
export const dynamic = 'force-dynamic';

interface Setting {
  id: number;
  key: string;
  label: string;
  value: string;
  field: "text" | "boolean";
}

export default function AdvancedSettings() {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const translations = useTranslation();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = () => {
    axios
      .get(`${apiUrl}/settings`, { headers: getAuthHeaders() })
      .then((response) => {
        setSettings(response.data.result);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching settings:", error);
        setIsLoading(false);
      });
  };

  const initialValues = settings.reduce(
    (acc, setting) => {
      acc[setting.key] =
        setting.field === "boolean"
          ? setting.value.toLowerCase() === "true"
            ? "true"
            : "false"
          : setting.value;
      return acc;
    },
    {} as Record<string, any>
  );

  const handleSubmit = (values: Record<string, any>) => {
    axios
      .post(`${apiUrl}/settings/update`, values, { headers: getAuthHeaders() })
      .then(() => {
        toast.success("Settings updated successfully");
        fetchSettings();
      })
      .catch((error) => {
        

        toast.error(
          error?.response?.data?.errorMessage ||
            "An error occurred while creating the store"
        );
      });
  };

  // Helper function to get setting icon
  const getSettingIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case 'notification':
      case 'notifications':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5h5a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v13a2 2 0 002 2z" />
          </svg>
        );
      case 'security':
      case 'password':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'email':
      case 'mail':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'theme':
      case 'appearance':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        );
      case 'backup':
      case 'storage':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
        );
      case 'api':
      case 'integration':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-blue-400 to-purple-500"></div>
            <p className="text-white text-lg font-medium">{translations.storeDetails.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <Toaster position="top-right" />
      
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {translations.sidebar.advancedSettings}
              </h1>
              <p className="text-gray-400 mt-1">قم بتخصيص إعدادات النظام المتقدمة</p>
            </div>
          </div>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, dirty }) => (
          <Form>
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {settings.map((setting, index) => (
                  <div
                    key={setting.id}
                    className="group bg-gradient-to-br from-slate-700/50 to-slate-800/50 hover:from-slate-600/50 hover:to-slate-700/50 border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideInUp 0.6s ease-out forwards'
                    }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                        {getSettingIcon(setting.key)}
                      </div>
                      <div className="flex-1">
                        <label className="block text-white font-semibold text-sm group-hover:text-blue-300 transition-colors duration-300">
                          {setting.label}
                        </label>
                        <span className="text-xs text-gray-400 font-mono">
                          {setting.key.replace(/_/g, ' ').replace(/-/g, ' ')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {setting.field === "boolean" ? (
                        <Field
                          as="select"
                          name={setting.key}
                          className="w-full px-4 py-3 bg-slate-800/80 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-slate-700/80"
                        >
                          <option value="true" className="bg-slate-800">
                            {translations.settings?.enabled || "مفعل"}
                          </option>
                          <option value="false" className="bg-slate-800">
                            {translations.settings?.disabled || "معطل"}
                          </option>
                        </Field>
                      ) : (
                        <Field
                          type="text"
                          name={setting.key}
                          className="w-full px-4 py-3 bg-slate-800/80 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-slate-700/80 placeholder-gray-400"
                          placeholder={`أدخل ${setting.label}...`}
                        />
                      )}
                      <ErrorMessage
                        name={setting.key}
                        component="div"
                        className="text-red-400 text-xs mt-2 flex items-center space-x-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Submit Button */}
              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={!dirty || isSubmitting}
                  className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {translations.storeUpdate?.form?.buttons?.saving || "جاري الحفظ..."}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {translations.storeUpdate?.form?.buttons?.saveSettings || "حفظ الإعدادات"}
                    </>
                  )}
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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
