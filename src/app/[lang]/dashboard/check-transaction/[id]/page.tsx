"use client";

import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import getAuthHeaders from "../../Shared/getAuth";
import { PaymentOption } from "../../paymentVerification/types";
export const dynamic = 'force-dynamic';

interface Store {
  id: string;
  name: string;
}

export interface Params {
  id: string;
  lang: string;
}

export default function CheckTransaction({
  params,
}: {
  params: Promise<Params>;
}) {
  const translations = useTranslation();
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const defaultPaymentOptions = [
    { name: "VF- CASH", key: "vcash", img: "/vcash.svg" },
    { name: "Et- CASH", key: "ecash", img: "/ecash.svg" },
    { name: "WE- CASH", key: "wecash", img: "/wecash.svg" },
    { name: "OR- CASH", key: "ocash", img: "/ocash.svg" },
    { name: "INSTAPAY", key: "instapay", img: "/instapay.svg" },
  ];
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [hoveredMethod, setHoveredMethod] = useState<string>("");
  const [selectedPaymentValues, setSelectedPaymentValues] = useState<
    Array<{ value: string; id: number }>
  >([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(
    null
  );

  const validationSchema = Yup.object().shape({
    mobile: Yup.string().when("payment_option", {
      is: "instapay",
      then: (schema) =>
        schema
          .required(
            translations.paymentVerification.modal.transactionDetails
              .instapayIdRequired
          )
          .min(
            6,
            translations.paymentVerification.modal.transactionDetails
              .instapayIdTooShort
          ),
      otherwise: (schema) =>
        schema
          .required(translations.auth.validation.mobileRequired)
          .matches(
            /^(010|011|012|015)\d{8}$/,
            translations.auth.validation.mobileInvalid
          ),
    }),
    amount: Yup.string()
      .required(
        translations.paymentVerification.modal.transactionDetails.amountRequired
      )
      .test(
        "is-positive",
        translations.paymentVerification.modal.transactionDetails.invalidAmount,
        (value) => !isNaN(Number(value)) && Number(value) > 0
      ),
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleCheckTransaction = async (
    values: { mobile: string; amount: string; payment_option: string },
    { setSubmitting }: any
  ) => {
    console.log("Form submission - selectedPaymentId:", selectedPaymentId);
    console.log("Form submission - selectedPaymentValues:", selectedPaymentValues);
    
    if (!selectedPaymentId) {
      toast.error("Please select a payment value");
      return;
    }

    try {
      const { id } = await params;
      console.log("Submitting with payment_id:", selectedPaymentId);
      const response = await axios.post(
        `${apiUrl}/transactions/manual-check`,
        {
          payment_option: values.payment_option,
          application_id: id,
          amount: values.amount,
          value: values.mobile,
          payment_id: selectedPaymentId,
        },
        { headers: getAuthHeaders() }
      );

      toast.success("Transaction checked successfully");
    } catch (err: any) {
      let errorMessage = "Failed to check transaction";

      if (err.response) {
        console.error("API Response Error:", err.response);

        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else if (err.response.data?.errorMessage) {
          errorMessage = err.response.data.errorMessage;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data?.result) {
          errorMessage = Object.values(err.response.data.result).join(", ");
        } else {
          errorMessage = "An unknown error occurred.";
        }
      } else if (err.request) {
        errorMessage = "No response received from the server.";
      } else {
        errorMessage = err.message || "An unexpected error occurred.";
      }

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchPaymentOptions = async () => {
      try {
        const { id } = await params;
        const response = await axios.get(`${apiUrl}/applications/${id}`, {
          headers: getAuthHeaders(),
        });
        if (response?.data.success && response?.data.result?.payment_options) {
          const formattedOptions: PaymentOption[] =
            response.data.result.payment_options.map((optionKey: string) => {
              const staticOption = defaultPaymentOptions.find(
                (o) => o.key === optionKey
              );
              return {
                id: optionKey,
                value: optionKey,
                key: optionKey,
                img: staticOption?.img || "",
                name: staticOption?.name || optionKey,
              };
            });
          setPaymentOptions(formattedOptions);
          setPayments(response.data.result.payments || []);
          console.log("Payment options fetched:", formattedOptions);
          console.log("Payments fetched:", response.data.result.payments || []);
        }
      } catch (err) {
        toast.error("Failed to fetch payment options");
      }
    };

    fetchPaymentOptions();
  }, [apiUrl]);

  const handlePaymentMethodSelect = (methodKey: string) => {
    setSelectedMethod(methodKey);
    const activePayments = payments.filter(
      (p) => p.payment_option === methodKey 
    );
    const paymentValues = activePayments.map((p) => ({ value: p.value, id: p.id }));
    setSelectedPaymentValues(paymentValues);
    
    // Auto-select the first payment if there's only one, or reset selection
    if (paymentValues.length === 1) {
      setSelectedPaymentId(paymentValues[0].id);
      console.log("Auto-selected payment ID:", paymentValues[0].id);
    } else {
      setSelectedPaymentId(null);
    }
    
    console.log("Method selected:", methodKey);
    console.log("Available payments:", paymentValues);
  };

  const handlePaymentValueSelect = (paymentId: number) => {
    setSelectedPaymentId(paymentId);
    console.log("Payment value selected, ID:", paymentId);
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-4 lg:p-8">
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            color: '#f1f5f9',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      
      {/* Header with Enhanced Design */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-block">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            {translations.paymentVerification.title}
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mx-auto animate-pulse"></div>
        </div>
        <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
          التحقق من المعاملات المالية بسهولة وأمان
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Methods Section */}
          <div className="space-y-8">
            {/* Payment Options Card */}
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6 lg:p-8 shadow-2xl animate-slide-up">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/20">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {translations.storepayment.modal.add.paymentOption}
                  </h3>
                  <p className="text-gray-400">اختر طريقة الدفع المناسبة</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {paymentOptions.map((method, index) => (
                  <div
                    key={method.key}
                    className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      selectedMethod === method.key
                        ? "bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400/50 shadow-lg shadow-cyan-400/20"
                        : "bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600/30 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-400/10"
                    }`}
                    onClick={() => handlePaymentMethodSelect(method.key)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative mb-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        selectedMethod === method.key
                          ? "bg-gradient-to-br from-cyan-400/20 to-purple-400/20"
                          : "bg-gray-700/50 group-hover:bg-cyan-400/10"
                      }`}>
                        <Image
                          src={method.img}
                          alt={method.name}
                          width={40}
                          height={40}
                          className="transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      {selectedMethod === method.key && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className={`text-sm font-semibold text-center transition-colors duration-300 ${
                      selectedMethod === method.key ? "text-cyan-400" : "text-gray-300 group-hover:text-white"
                    }`}>
                      {method.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Values Card */}
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6 lg:p-8 shadow-2xl animate-slide-up">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center border border-emerald-500/20">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    القيم المتاحة
                  </h3>
                  <p className="text-gray-400">اختر القيمة المناسبة للتحقق</p>
                </div>
              </div>

              {selectedPaymentId && (
                <div className="mb-6 p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl">
                  <p className="text-emerald-400 text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {translations.paymentVerification.modal.transactionDetails.selectedPaymentId}: {selectedPaymentId}
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                {selectedPaymentValues.length > 0 ? (
                  selectedPaymentValues.map((payment, index) => (
                    <div
                      key={payment.id}
                      className={`group flex justify-between items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                        selectedPaymentId === payment.id
                          ? "bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/50 shadow-lg shadow-emerald-400/20"
                          : "bg-gradient-to-r from-gray-700/30 to-gray-800/30 border border-gray-600/30 hover:border-emerald-400/30 hover:shadow-lg hover:shadow-emerald-400/10"
                      }`}
                      onClick={() => handlePaymentValueSelect(payment.id)}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          selectedPaymentId === payment.id
                            ? "bg-emerald-400/20"
                            : "bg-gray-700/50 group-hover:bg-emerald-400/10"
                        }`}>
                          <svg className={`w-5 h-5 transition-colors duration-300 ${
                            selectedPaymentId === payment.id ? "text-emerald-400" : "text-gray-400 group-hover:text-emerald-400"
                          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-semibold text-white">القيمة</span>
                          <span className="text-xs text-gray-400 block">ID: {payment.id}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold px-4 py-2 rounded-xl transition-all duration-300 ${
                          selectedPaymentId === payment.id
                            ? "bg-emerald-400/20 text-emerald-400"
                            : "bg-gray-700/50 text-gray-300 group-hover:bg-emerald-400/10 group-hover:text-emerald-400"
                        }`}>
                          {payment.value}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(payment.value);
                          }}
                          className="p-2 rounded-xl hover:bg-emerald-400/20 transition-all duration-300 group/btn"
                          title="Copy to clipboard"
                        >
                          <svg className="w-5 h-5 text-gray-400 group-hover/btn:text-emerald-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center p-12 rounded-2xl bg-gradient-to-r from-gray-700/30 to-gray-800/30 border border-gray-600/30">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <p className="text-gray-400 font-medium">اختر طريقة دفع أولاً</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Transaction Form Section */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6 lg:p-8 shadow-2xl animate-slide-up">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-blue-500/20">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    تفاصيل المعاملة
                  </h3>
                  <p className="text-gray-400">أدخل بيانات المعاملة للتحقق</p>
                </div>
              </div>

              <Formik
                initialValues={{
                  mobile: "",
                  amount: "",
                  payment_option: selectedMethod,
                }}
                validationSchema={validationSchema}
                onSubmit={handleCheckTransaction}
                enableReinitialize
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {selectedMethod === "instapay"
                          ? translations.paymentVerification.modal
                              .transactionDetails.instapayIdRequired
                          : translations.auth.mobile}
                        <span className="text-red-400">*</span>
                      </label>

                      <Field
                        name="mobile"
                        className="w-full px-5 py-4 bg-gradient-to-r from-gray-700/30 to-gray-800/30 border border-gray-600/30 rounded-2xl text-white text-lg placeholder-gray-400 focus:border-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-400/20 transition-all duration-300"
                        placeholder={
                          selectedMethod === "instapay"
                            ? "أدخل InstaPay ID"
                            : "01xxxxxxxxx"
                        }
                      />
                      <ErrorMessage
                        name="mobile"
                        component="p"
                        className="text-red-400 text-sm mt-2 flex items-center gap-1"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        {translations.paymentVerification.modal.transactionDetails.totalAmount}
                        <span className="text-red-400">*</span>
                      </label>
                      <Field
                        name="amount"
                        className="w-full px-5 py-4 bg-gradient-to-r from-gray-700/30 to-gray-800/30 border border-gray-600/30 rounded-2xl text-white text-lg placeholder-gray-400 focus:border-green-400/50 focus:outline-none focus:ring-4 focus:ring-green-400/20 transition-all duration-300"
                        placeholder="0.00 جنيه مصري"
                      />
                      <ErrorMessage
                        name="amount"
                        component="p"
                        className="text-red-400 text-sm mt-2 flex items-center gap-1"
                      />
                    </div>

                    <Field
                      type="hidden"
                      name="payment_option"
                      value={selectedMethod}
                    />

                    <button
                      type="submit"
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      disabled={isSubmitting || !selectedMethod}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            جاري التحقق...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {translations.paymentVerification.action.check}
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
