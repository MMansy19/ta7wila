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
        toast.success("Copied to clipboard!");
    };

    if (isLoading) {
        return (
            <Loading />
        );
    }

    if (!storeInfo) {
        return (
            <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
                <div className="text-white text-xl">Store not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-900 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <Toaster position="top-right" reverseOrder={false} />
                
                {/* Store Header */}
                <div className="bg-[#1E1E1E] rounded-xl p-6 mb-8 text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        {storeInfo.name || translations.common.storePayment || "Store Payment"}
                    </h1>
                    <p className="text-gray-300">
                        {translations.paymentVerification.instructions || "Complete your payment using one of the available payment methods"}
                    </p>
                </div>

                <div className="bg-neutral-800 rounded-[18px] p-6 shadow-lg text-[#FFFFFF]">
                    <h2 className="text-3xl font-bold mb-8 text-center">
                        {translations.paymentVerification.title}
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Payment Methods Section */}
                        <div className="col-md-6">
                            <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-md">
                                <h3 className="font-semibold text-xl mb-6 text-center">
                                    {translations.storepayment.modal.add.paymentOption}
                                </h3>
                                <div className="flex flex-wrap justify-center gap-4 py-4">
                                    {paymentOptions.map((method) => (
                                        <div
                                            key={method.key}
                                            className={`flex flex-col items-center justify-center p-4 rounded-xl w-28 cursor-pointer transition-all duration-200 ${
                                                selectedMethod === method.key
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
                                                width={48}
                                                height={48}
                                                className="mb-3"
                                            />
                                            <span className="text-sm font-medium">{method.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Values Section */}
                            <div className="mt-8 bg-[#1E1E1E] rounded-xl p-6 shadow-md">
                                <div className="mb-4 text-center">
                                    <h3 className="font-semibold text-xl mb-2">
                                        {translations.paymentVerification.modal.transactionDetails.title}
                                    </h3>
                                    <p className="text-sm text-[#53B4AB]">
                                        {translations.paymentVerification.modal.transactionDetails.pleaseSelectPaymentValue}
                                    </p>
                                    {selectedPaymentId && (
                                        <p className="text-xs text-green-400 mt-1">
                                            {translations.paymentVerification.modal.transactionDetails.selectedPaymentId}: {selectedPaymentId}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    {selectedPaymentValues.length > 0 ? (
                                        selectedPaymentValues.map((payment) => (
                                            <div
                                                key={payment.id}
                                                className={`flex justify-between items-center w-full cursor-pointer transition-all duration-200 p-3 rounded-lg ${
                                                    selectedPaymentId === payment.id
                                                        ? "bg-[#53B4AB] bg-opacity-20 border border-[#53B4AB]"
                                                        : "bg-[#2A2A2A] hover:bg-gray-700"
                                                }`}
                                                onClick={() => handlePaymentValueSelect(payment.id)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">
                                                        {translations.paymentVerification.modal.transactionDetails.value}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        ({translations.paymentVerification.modal.transactionDetails.selectedPaymentId}: {payment.id})
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold bg-[#3A3A3A] p-2 rounded-lg text-[#53B4AB]">
                                                        {payment.value}
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCopy(payment.value);
                                                        }}
                                                        className="p-2 rounded-lg hover:bg-[#3A3A3A] transition-colors duration-200"
                                                        title={translations.common.copyToClipboard || "Copy to clipboard"}
                                                    >
                                                        <svg
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="text-[#53B4AB]"
                                                        >
                                                            <path
                                                                d="M17 6L17 14C17 16.2091 15.2091 18 13 18H7M17 6C17 3.79086 15.2091 2 13 2L10.6569 2C9.59599 2 8.57857 2.42143 7.82843 3.17157L4.17157 6.82843C3.42143 7.57857 3 8.59599 3 9.65685L3 14C3 16.2091 4.79086 18 7 18M17 6C19.2091 6 21 7.79086 21 10V18C21 20.2091 19.2091 22 17 22H11C8.79086 22 7 20.2091 7 18M9 2L9 4C9 6.20914 7.20914 8 5 8L3 8"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex justify-between items-center w-full p-4 rounded-lg bg-[#2A2A2A]">
                                            <p className="font-medium">
                                                {translations.paymentVerification.modal.selectPaymentMethodFirst || "Select a payment method first"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Payment Form Section */}
                        <div className="col-md-6">
                            <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-md">
                                <div className="mb-6 text-center">
                                    <h3 className="font-semibold text-xl mb-2">
                                        {translations.paymentVerification.modal.transactionDetails.title}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {translations.paymentVerification.modal.fillPaymentInfo || "Please fill in your payment information"}
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
                                            <div className="mb-4">
                                                <h4 className="font-semibold mb-2 text-lg">
                                                    {selectedMethod === "instapay" ? 
                                                        "InstaPay ID" : 
                                                        translations.auth.mobile || "Mobile Number"}
                                                </h4>
                                                <Field
                                                    name="mobile"
                                                    className="px-4 py-3 rounded-lg w-full bg-[#2A2A2A] text-white text-base h-12 border border-gray-700 focus:border-[#53B4AB] focus:outline-none transition-colors duration-200"
                                                    placeholder={
                                                        selectedMethod === "instapay"
                                                            ? translations.storepayment.modal.add.valuePlaceholder
                                                            : translations.storepayment.modal.add.valuePlaceholder
                                                    }
                                                />
                                                <ErrorMessage
                                                    name="mobile"
                                                    component="p"
                                                    className="text-red-500 text-sm mt-1"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <h4 className="font-semibold mb-2 text-lg">
                                                    {translations.paymentVerification.modal.transactionDetails.totalAmount || "Amount (EGP)"}
                                                </h4>
                                                <Field
                                                    name="amount"
                                                    className="px-4 py-3 rounded-lg w-full bg-[#2A2A2A] text-white text-base h-12 border border-gray-700 focus:border-[#53B4AB] focus:outline-none transition-colors duration-200"
                                                    placeholder="0 EGP"
                                                />
                                                <ErrorMessage
                                                    name="amount"
                                                    component="p"
                                                    className="text-red-500 text-sm mt-1"
                                                />
                                            </div>

                                            <Field
                                                type="hidden"
                                                name="payment_option"
                                                value={selectedMethod}
                                            />

                                            <button
                                                type="submit"
                                                className="w-full p-3 bg-[#53B4AB] hover:bg-[#347871] text-black rounded-lg mt-6 font-semibold text-sm transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={isSubmitting || !selectedMethod || !selectedPaymentId}
                                            >
                                                {isSubmitting
                                                    ? translations.auth.submitting
                                                    : translations.paymentVerification.submitPayment || "Submit Payment Information"}
                                            </button>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
