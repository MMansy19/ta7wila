"use client";

import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import getAuthHeaders from "../../dashboard/Shared/getAuth";
import Loading from "../../dashboard/loading";

export const dynamic = 'force-dynamic';

interface PaymentOption {
    id: string;
    value: string;
    key: string;
    img: string;
    name: string;
}

export interface Params {
    id: string;
    lang: string;
}

export default function PublicPayment({
    params,
}: {
    params: Promise<Params>;
}) {
    const translations = useTranslation();
    const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [storeInfo, setStoreInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [resolvedParams, setResolvedParams] = useState<Params | null>(null);

    const defaultPaymentOptions = [
        { name: "VF- CASH", key: "vcash", img: "/vcash.svg" },
        { name: "orange cash", key: "ocash", img: "/ocash.svg" },
        { name: "etisalat cash", key: "ecash", img: "/ecash.svg" },
        { name: "INSTAPAY", key: "instapay", img: "/instapay.svg" },
        { name: "Apple Pay", key: "applepay", img: "/applepay.svg" },
    ];

    const [selectedMethod, setSelectedMethod] = useState<string>("");
    const [hoveredMethod, setHoveredMethod] = useState<string>("");
    const [selectedPaymentValues, setSelectedPaymentValues] = useState<
        Array<{ value: string; id: number }>
    >([]);
    const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
    const [submitError, setSubmitError] = useState<string>("");

    const validationSchema = Yup.object().shape({
        mobile: Yup.string().when("payment_option", {
            is: "instapay",
            then: (schema) =>
                schema
                    .required(
                        translations?.paymentVerification?.modal?.transactionDetails?.instapayIdRequired || "Instapay ID is required"
                    )
                    .min(
                        3,
                        translations?.paymentVerification?.modal?.transactionDetails?.instapayIdTooShort || "Instapay ID is too short"
                    )
                    .matches(
                        /^[a-zA-Z0-9@._-]+$/,
                        "Invalid InstaPay username format"
                    ),
            otherwise: (schema) =>
                schema
                    .required(translations?.auth?.validation?.mobileRequired || "Mobile number is required")
                    .matches(
                        /^(010|011|012|015)\d{8}$/,
                        translations?.auth?.validation?.mobileInvalid || "Invalid mobile number"
                    ),
        }),
        amount: Yup.string()
            .required(
                translations?.paymentVerification?.modal?.transactionDetails?.amountRequired || "Amount is required"
            )
            .test(
                "is-positive",
                translations?.paymentVerification?.modal?.transactionDetails?.invalidAmount || "Invalid amount",
                (value) => !isNaN(Number(value)) && Number(value) > 0
            ),
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const apiUrl2 = "https://api.ta7wila.com";


    const handleSubmitPayment = async (
        values: { mobile: string; amount: string; payment_option: string; customer_name: string },
        { setSubmitting, resetForm }: any
    ) => {
        // Clear previous errors
        setSubmitError("");
        
        if (!selectedPaymentId) {
            setSubmitError(translations?.paymentVerification?.modal?.transactionDetails?.pleaseSelectPaymentValue || "Please select a payment method");
            return;
        }

        if (!resolvedParams) {
            setSubmitError("Invalid request parameters");
            return;
        }

        try {
            console.log("Payment submission data:", {
                payment_option: values.payment_option,
                application_id: resolvedParams.id,
                amount: values.amount,
                value: values.mobile,
                payment_id: selectedPaymentId,
            });
            
            const response = await axios.post(
                // for new public endpoint
                // `${apiUrl2}/public/check-transaction`,
                `${apiUrl}/transactions/manual-check`,
                {
                    payment_option: values.payment_option,
                    application_id: resolvedParams.id,
                    amount: values.amount,
                    value: values.mobile,
                    payment_id: selectedPaymentId,
                },
                { headers: getAuthHeaders() }
            );
      
            // Success - redirect to success page with transaction details
            const referenceId = `TXN${Date.now()}`;
            const successParams = new URLSearchParams({
                amount: values.amount,
                mobile: values.mobile,
                payment_option: values.payment_option,
                payment_id: selectedPaymentId.toString(),
                application_id: resolvedParams.id,
                timestamp: new Date().toISOString(),
                reference_id: referenceId
            });
            
            // Redirect to success page with search parameters
            window.location.href = `/${resolvedParams.lang}/public-payment/success?${successParams.toString()}`;
            
        } catch (err: any) {
            let errorMessage = "Transaction failed. Please try manual check.";

            if (err.response) {
                if (typeof err.response.data === "string") {
                    errorMessage = err.response.data;
                } else if (err.response.data?.errorMessage) {
                    errorMessage = err.response.data.errorMessage;
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response.data?.result) {
                    errorMessage = Object.values(err.response.data.result).join(", ");
                }
            } else if (err.request) {
                errorMessage = "No response received. Please try manual check.";
            } else {
                errorMessage = err.message || "Transaction failed. Please try manual check.";
            }

            setSubmitError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };
    useEffect(() => {
        const resolveParams = async () => {
            const resolved = await params;
            setResolvedParams(resolved);
        };
        
        resolveParams();
    }, [params]);

    useEffect(() => {
        const fetchStoreData = async () => {
            if (!resolvedParams) return;
            console.log("Fetching store data for ID:", `${apiUrl2}/${resolvedParams.id}`);
            try {
                const response = await axios.get(`${apiUrl2}/${resolvedParams.id}`, {
                    headers: getAuthHeaders(),
                });

                if (response?.data.success && response?.data.result) {
                    const { application, payments } = response.data.result;
                    setStoreInfo(application);
                    console.log("Store Data:", { application, payments });
                    
                    if (application?.payment_options) {
                        const formattedOptions: PaymentOption[] =
                            application.payment_options.map((optionKey: string) => {
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
                        
                        // Add index as id since the API doesn't provide ids for payments
                        const paymentsWithIds = payments?.map((payment: any, index: number) => ({
                            ...payment,
                            id: index + 1
                        })) || [];
                        setPayments(paymentsWithIds);
                    }
                } else {
                    toast.error(translations?.common?.errorOccurred || "Failed to fetch store information");
                }
            } catch (err) {
                toast.error(translations?.common?.errorOccurred || "Failed to fetch store information");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStoreData();
    }, [apiUrl, resolvedParams]);

    const handlePaymentMethodSelect = (methodKey: string) => {
        setSelectedMethod(methodKey);
        const activePayments = payments.filter(
            (p) => p.payment_option === methodKey
        );
        const paymentValues = activePayments.map((p) => ({ value: p.value, id: p.id }));
        setSelectedPaymentValues(paymentValues);

        if (paymentValues.length === 1) {
            setSelectedPaymentId(paymentValues[0].id);
        } else {
            setSelectedPaymentId(null);
        }
    };

    const handlePaymentValueSelect = (paymentId: number) => {
        setSelectedPaymentId(paymentId);
    };

    const handleCopy = (value: string) => {
        navigator.clipboard.writeText(value);
        alert(translations.publicPayment?.copied || "تم النسخ!");
    };

    if (isLoading) {
        return <Loading />;
    }

    if (!storeInfo) {
        return (
            <div className="min-h-screen bg-[#2A2A2A] flex items-center justify-center">
                <div className="text-white text-xl">{translations.publicPayment?.storeNotFound || "Store not found"}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#2A2A2A] flex items-center justify-center py-8 px-4">
            <div className="max-w-6xl w-full mx-auto">
                <Toaster position="top-right" reverseOrder={false} />

                <div className="bg-[#1E1E1E] rounded-[18px] p-4 md:p-8 shadow-lg text-[#FFFFFF]">
                    <div className="flex items-center justify-center gap-4 mb-6 md:mb-8 flex-col md:flex-row">
                        <Image src="/Frame 1984078121.png" alt="Ta7wila Logo" width={160} height={50} />
                        {storeInfo?.logo && (
                            <>
                                <div className="flex items-center justify-center">
                                    <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                                    <div className="mx-3 w-2 h-2 rounded-full bg-[#53B4AB]"></div>
                                    <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                                </div>
                                <Image 
                                    src={`https://api.ta7wila.com/${storeInfo.logo}`} 
                                    alt="Store Logo" 
                                    width={60} 
                                    height={60}
                                    className="rounded-lg object-contain border border-gray-600 bg-white/5 p-1"
                                />
                            </>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                        
                        <div className="space-y-4">

                            <h1 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 text-white">
                                {translations.publicPayment?.title || "اختر طريقة الدفع"}
                            </h1>

                            {/* Payment Methods - Mobile Responsive with Horizontal Scroll */}
                            <div className="mb-6 md:mb-8">
                                <div className="flex justify-center gap-3 md:gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                    <div className="flex gap-3 md:gap-4 min-w-max md:min-w-0">
                                        {paymentOptions.map((method) => (
                                            <div
                                                key={method.key}
                                                className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-xl w-20 h-20 md:w-24 md:h-24 cursor-pointer transition-all duration-200 flex-shrink-0 ${selectedMethod === method.key
                                                    ? "bg-[#53B4AB] text-black shadow-lg scale-105"
                                                    : hoveredMethod === method.key
                                                        ? "bg-gray-700"
                                                        : "bg-[#2A2A2A] hover:bg-gray-700"
                                                    }`}
                                                onClick={() => handlePaymentMethodSelect(method.key)}
                                                onMouseEnter={() => setHoveredMethod(method.key)}
                                                onMouseLeave={() => setHoveredMethod("")}
                                            >
                                                <Image
                                                    src={method.img}
                                                    alt={method.name}
                                                    width={28}
                                                    height={28}
                                                    className="mb-1 md:mb-2 md:w-8 md:h-8"
                                                />
                                                <span className="text-[10px] md:text-xs font-medium text-center leading-tight px-1">
                                                    {method.name}
                                                </span>
                                                {method.key === "applepay" && (
                                                    <span className="text-[8px] md:text-xs text-gray-400 mt-1">Coming Soon</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="font-semibold text-lg mb-2 text-white">
                                    {translations.publicPayment?.noCommission || "لا يوجد عمولة على الشحن"}                               
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {selectedPaymentValues.length > 0 && (
                                    selectedPaymentValues.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className={`flex justify-between items-center w-full cursor-pointer transition-all duration-200 p-4 rounded-lg ${selectedPaymentId === payment.id
                                                ? "bg-[#53B4AB] bg-opacity-20 border border-[#53B4AB]"
                                                : "bg-[#2A2A2A] hover:bg-gray-700"
                                                }`}
                                            onClick={() => handlePaymentValueSelect(payment.id)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-white">
                                                    {payment.value}
                                                </span>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCopy(payment.value);
                                                }}
                                                className="text-[#53B4AB] hover:text-[#4a9e96]"
                                            >
                                                {translations.publicPayment?.copy || "نسخ"}
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <p className="text-sm text-gray-400 mt-2 text-center whitespace-pre-line">
                                {translations.publicPayment?.footerNote || "رقم محفوظ خاص بنا\nرقم خدمة العملاء"}
                            </p>
                        </div>

                        <div className="space-y-4">

                            {/* Instructions */}
                            <div className="bg-[#2A2A2A] p-3 md:p-4 rounded-lg mb-4 md:mb-6">
                                <p className="text-xs md:text-sm text-gray-300 mb-2 md:mb-3">
                                    {translations.publicPayment?.instructions || "بعد التحويل قم بتأكيد التحويل من خلال كتابة رقم الهاتف الذي قم بالتحويل من خلالة في خانة رقم الهاتف و كتابه المبلغ الذي قمت بتحويله بالجنية المصري في خانه المبلغ"}                                 </p>

                                <p className="text-xs md:text-sm text-gray-300">
                                    {translations.publicPayment?.waitInstructions || "الرجاء الانتظار 5 دقائق في حالة فشل التأكيد و إعادة المحاولة"}                                
                                </p>
                            </div>

                            <Formik
                                initialValues={{
                                    customer_name: "",
                                    mobile: "",
                                    amount: "",
                                    payment_option: selectedMethod,
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmitPayment}
                                enableReinitialize
                            >
                                {({ isSubmitting }) => (
                                    <Form className="space-y-4 md:space-y-5">
                                        {/* Hidden field to ensure payment_option is submitted */}
                                        <Field type="hidden" name="payment_option" value={selectedMethod} />
                                        
                                        <div className='flex md:flex-row flex-col gap-3 md:gap-4'>
                                            <div className='w-full md:max-w-[180px]'>
                                                <label className="block text-white font-medium mb-2 text-sm md:text-base">
                                                    {translations.publicPayment?.amount || "المبلغ"}
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="amount"
                                                    className="px-3 md:px-4 py-2 md:py-3 rounded-lg w-full bg-[#2A2A2A] text-white border border-gray-600 focus:border-[#53B4AB] focus:outline-none transition-colors duration-200 text-sm md:text-base"
                                                    placeholder={translations.publicPayment?.amountPlaceholder || "أدخل المبلغ بالجنيه"}
                                                />
                                                <ErrorMessage name="amount" component="div" className="text-red-500 text-xs md:text-sm mt-1" />
                                            </div>

                                            <div className='w-full'>
                                                <label className="block text-white font-medium mb-2 text-sm md:text-base">
                                                    {selectedMethod === "instapay" 
                                                        ? (translations.publicPayment?.instapayUsername || "اسم المستخدم على انستا باي")
                                                        : (translations.publicPayment?.phoneNumber || "رقم الهاتف")
                                                    }
                                                </label>
                                                <Field
                                                    type="tel"
                                                    name="mobile"
                                                    className="px-3 md:px-4 py-2 md:py-3 rounded-lg w-full bg-[#2A2A2A] text-white border border-gray-600 focus:border-[#53B4AB] focus:outline-none transition-colors duration-200 text-sm md:text-base"
                                                    placeholder={selectedMethod === "instapay" 
                                                        ? (translations.publicPayment?.instapayPlaceholder || "user@instapay")
                                                        : (translations.publicPayment?.phonePlaceholder || "01000000000")
                                                    }
                                                />
                                                <ErrorMessage name="mobile" component="div" className="text-red-500 text-xs md:text-sm mt-1" />
                                            </div>
                                    </div>

                                        <button
                                            type="submit"
                                            className="w-full p-2 md:p-3 bg-[#53B4AB] hover:bg-[#4a9e96] text-white rounded-lg font-semibold transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                                            disabled={isSubmitting || !selectedMethod || !selectedPaymentId}
                                        >
                                            {isSubmitting 
                                                ? (translations.publicPayment?.submitting || "جاري الإرسال...") 
                                                : (translations.publicPayment?.confirmPayment || "تأكيد الدفع")
                                            }
                                        </button>
                                        
                                        {/* Error message display */}
                                        {submitError && (
                                            <div className="mt-3 p-3 bg-red-50 bg-opacity-10 border border-red-500 rounded-lg">
                                                <p className="text-red-400 text-sm text-center">
                                                    {submitError}
                                                </p>
                                            </div>
                                        )}
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
        </div>
        </div>
    );
}