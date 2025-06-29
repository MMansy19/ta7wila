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
        customer_name: Yup.string().required(translations.auth.validation.nameRequired || "Customer name is required"),
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleSubmitPayment = async (
        values: { mobile: string; amount: string; payment_option: string; customer_name: string },
        { setSubmitting, resetForm }: any
    ) => {
        if (!selectedPaymentId) {
            toast.error(translations.paymentVerification.modal.transactionDetails.pleaseSelectPaymentValue);
            return;
        }

        try {
            const { id } = await params;
            const response = await axios.post(
                `${apiUrl}/transactions/public-payment`,
                {
                    payment_option: values.payment_option,
                    application_id: id,
                    amount: values.amount,
                    value: values.mobile,
                    payment_id: selectedPaymentId,
                    customer_name: values.customer_name,
                }
            );

            toast.success(translations.paymentVerification.successMessage || "Payment submitted successfully! Please complete the payment using the provided information.");
            resetForm();
            setSelectedMethod("");
            setSelectedPaymentId(null);
            setSelectedPaymentValues([]);
        } catch (err: any) {
            let errorMessage = translations.common.errorOccurred || "Failed to submit payment";

            if (err.response) {
                if (typeof err.response.data === "string") {
                    errorMessage = err.response.data;
                } else if (err.response.data?.errorMessage) {
                    errorMessage = err.response.data.errorMessage;
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response.data?.result) {
                    errorMessage = Object.values(err.response.data.result).join(", ");
                } else {
                    errorMessage = translations.common.errorOccurred || "An unknown error occurred.";
                }
            } else if (err.request) {
                errorMessage = translations.common.noResponse || "No response received from the server.";
            } else {
                errorMessage = err.message || translations.common.unexpectedError || "An unexpected error occurred.";
            }

            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const { id } = await params;
                const response = await axios.get(`${apiUrl}/applications/${id}`, {
                    headers: getAuthHeaders(),
                });

                if (response?.data.success && response?.data.result) {
                    const storeData = response.data.result;
                    setStoreInfo(storeData);
                    if (storeData.payment_options) {
                        const formattedOptions: PaymentOption[] =
                            storeData.payment_options.map((optionKey: string) => {
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
                        setPayments(storeData.payments || []);
                    }
                } else {
                    toast.error(translations.common.errorOccurred || "Failed to fetch store information");
                }
            } catch (err) {
                toast.error(translations.common.errorOccurred || "Failed to fetch store information");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStoreData();
    }, [apiUrl]);

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
        alert("تم النسخ!");
    };

    if (isLoading) {
        return <Loading />;
    }

    if (!storeInfo) {
        return (
            <div className="min-h-screen bg-[#2A2A2A] flex items-center justify-center">
                <div className="text-white text-xl">Store not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#2A2A2A] py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <Toaster position="top-right" reverseOrder={false} />

                <div className="bg-[#1E1E1E] rounded-[18px] p-8 shadow-lg text-[#FFFFFF]">
                    <div className="flex items-center justify-center mb-8">
                        <Image src="/Frame 1984078121.png" alt="Ta7wila Logo" width={160} height={50} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        
                        <div className="space-y-4">

                            <h1 className="text-2xl font-bold text-center mb-6 text-white">
                                أختر طريقة الدفع
                            </h1>

                            {/* Payment Methods */}
                            <div className="flex justify-center gap-4 mb-8">
                                {paymentOptions.map((method) => (
                                    <div
                                        key={method.key}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl w-24 h-24 cursor-pointer transition-all duration-200 ${selectedMethod === method.key
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
                                            width={32}
                                            height={32}
                                            className="mb-2"
                                        />
                                        <span className="text-xs font-medium text-center leading-tight">
                                            {method.name}
                                        </span>
                                        {method.key === "applepay" && (
                                            <span className="text-xs text-gray-400 mt-1">Coming Soon</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="text-center">
                                <h3 className="font-semibold text-lg mb-2 text-white">
                                لا يوجد عمولة علي الشحن                               
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {selectedPaymentValues.length > 0 ? (
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
                                                نسخ
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center bg-[#2A2A2A] p-4 rounded-lg">
                                            <span className="font-medium text-white">01030769583</span>
                                            <button
                                                onClick={() => handleCopy("01030769583")}
                                                className="text-[#53B4AB] hover:text-[#4a9e96]"
                                            >
                                                نسخ
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-center bg-[#2A2A2A] p-4 rounded-lg">
                                            <span className="font-medium text-white">01030769583</span>
                                            <button
                                                onClick={() => handleCopy("01030769583")}
                                                className="text-[#53B4AB] hover:text-[#4a9e96]"
                                            >
                                                نسخ
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <p className="text-sm text-gray-400 mt-2 text-center">
                                رقم متوظفون خاش الخاص بلا<br />
                                رقم خدمة العصك
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="text-center">
                                <h3 className="font-semibold text-lg mb-2 text-white">
                                    رقم فودافون كاش الخاص بنا
                                </h3>
                            </div>

                            {/* Instructions */}
                            <div className="bg-[#2A2A2A] p-4 rounded-lg mb-6">
                                <p className="text-sm text-gray-300 mb-3">
                                بعد التحويل قم بتأكيد التحويل من خلال كتابة رقم الهاتف الذي قم بالتحويل من خلالة في خانة رقم الهاتف و كتابه المبلغ الذي قمت بتحويله بالجنية المصري في خانه المبلغ                                 </p>

                                <p className="text-sm text-gray-300">
                                الرجاء الانتظار 5 دقائق في حالة فشل التأكيد و إعادة المحاولة                                
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
                                    <Form className="space-y-5">
                                        <div>
                                            <label className="block text-white font-medium mb-2">
                                                رقم الهاتف <span className="text-red-500">*</span>
                                            </label>
                                            <Field
                                                name="mobile"
                                                className="px-4 py-3 rounded-lg w-full bg-[#2A2A2A] text-white border border-gray-600 focus:border-[#53B4AB] focus:outline-none transition-colors duration-200"
                                                placeholder="01030600000"
                                            />
                                            <ErrorMessage
                                                name="mobile"
                                                component="p"
                                                className="text-red-500 text-sm mt-1"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-white font-medium mb-2">
                                                رقم الحساب <span className="text-red-500">*</span>
                                            </label>
                                            <Field
                                                name="customer_name"
                                                className="px-4 py-3 rounded-lg w-full bg-[#2A2A2A] text-white border border-gray-600 focus:border-[#53B4AB] focus:outline-none transition-colors duration-200"
                                                placeholder="رقم المعلومات"
                                            />
                                            <ErrorMessage
                                                name="customer_name"
                                                component="p"
                                                className="text-red-500 text-sm mt-1"
                                            />
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-white font-medium mb-2">
                                                    رقم <span className="text-red-500">*</span>
                                                </label>
                                                <Field
                                                    name="amount"
                                                    className="px-4 py-3 rounded-lg w-full bg-[#2A2A2A] text-white border border-gray-600 focus:border-[#53B4AB] focus:outline-none transition-colors duration-200"
                                                    placeholder="50"
                                                />
                                                <ErrorMessage
                                                    name="amount"
                                                    component="p"
                                                    className="text-red-500 text-sm mt-1"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <label className="block text-white font-medium mb-2">
                                                    رقم الآن
                                                </label>
                                                <input
                                                    type="text"
                                                    className="px-4 py-3 rounded-lg w-full bg-[#2A2A2A] text-white border border-gray-600 focus:border-[#53B4AB] focus:outline-none transition-colors duration-200"
                                                    placeholder="01030769583"
                                                    value="01030769583"
                                                    readOnly
                                                />
                                            </div>
                                        </div>

                                        <Field
                                            type="hidden"
                                            name="payment_option"
                                            value={selectedMethod}
                                        />

                                        <button
                                            type="submit"
                                            className="w-full p-3 bg-[#53B4AB] hover:bg-[#4a9e96] text-white rounded-lg font-semibold transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isSubmitting || !selectedMethod || !selectedPaymentId}
                                        >
                                            {isSubmitting ? "جاري الإرسال..." : "تأكيد الدفع"}
                                        </button>
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