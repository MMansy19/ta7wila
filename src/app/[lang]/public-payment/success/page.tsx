"use client";

import { useTranslation } from '@/hooks/useTranslation';
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface TransactionData {
    amount: string;
    mobile: string;
    payment_option: string;
    payment_id: string;
    application_id: string;
    timestamp: string;
    reference_id: string;
}

export default function PaymentSuccess() {
    const translations = useTranslation();
    const searchParams = useSearchParams();
    const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
    const [currentDateTime, setCurrentDateTime] = useState<string>("");

    useEffect(() => {
        // Get transaction data from URL search parameters
        const amount = searchParams.get('amount');
        const mobile = searchParams.get('mobile');
        const payment_option = searchParams.get('payment_option');
        const payment_id = searchParams.get('payment_id');
        const application_id = searchParams.get('application_id');
        const timestamp = searchParams.get('timestamp');
        const reference_id = searchParams.get('reference_id');

        if (amount && mobile && payment_option && payment_id && application_id && timestamp && reference_id) {
            setTransactionData({
                amount,
                mobile,
                payment_option,
                payment_id,
                application_id,
                timestamp,
                reference_id
            });

            // Format the timestamp from the URL
            const transactionDate = new Date(timestamp);
            const formattedDateTime = transactionDate.toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            setCurrentDateTime(formattedDateTime);
        }
    }, [searchParams]);

    if (!transactionData) {
        return (
            <div className="min-h-screen bg-[#2A2A2A] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-white text-xl mb-4">No transaction data found</div>
                    <Link 
                        href="/"
                        className="inline-block py-2 px-4 bg-[#53B4AB] hover:bg-[#4a9e96] text-white rounded-lg font-semibold transition-colors duration-200"
                    >
                        العودة للرئيسية
                    </Link>
                </div>
            </div>
        );
    }

    const getPaymentMethodName = (key: string) => {
        const methods: { [key: string]: string } = {
            "vcash": "VF-CASH",
            "ocash": "Orange Cash",
            "ecash": "Etisalat Cash",
            "instapay": "InstaPay",
            "applepay": "Apple Pay"
        };
        return methods[key] || key;
    };

    return (
        <div className="min-h-screen bg-[#2A2A2A] flex items-center justify-center py-8 px-4">
            <div className="max-w-2xl w-full mx-auto">
                <div className="bg-[#1E1E1E] rounded-[18px] p-6 md:p-8 shadow-lg text-[#FFFFFF]">
                    
                    {/* Header with Logo */}
                    <div className="flex items-center justify-center mb-8">
                        <Image src="/Frame 1984078121.png" alt="Ta7wila Logo" width={160} height={50} />
                    </div>

                    {/* Success Icon and Message */}
                    <div className="text-center mb-8">
                        <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {"تم إرسال طلبك بنجاح!"}
                        </h1>
                        
                        <p className="text-gray-300 text-lg">
                            {"سيتم مراجعة طلبك والتأكيد خلال دقائق قليلة"}
                        </p>
                    </div>

                    {/* Transaction Details */}
                    <div className="bg-[#2A2A2A] rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-white mb-4 text-center">
                            {"تفاصيل المعاملة"}
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                                <span className="text-gray-400">{"المبلغ"}:</span>
                                <span className="text-white font-medium">{transactionData.amount} {"جنيه"}</span>
                            </div>
                            
                            <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                                <span className="text-gray-400">{"طريقة الدفع"}:</span>
                                <span className="text-white font-medium">{getPaymentMethodName(transactionData.payment_option)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                                <span className="text-gray-400">
                                    {transactionData.payment_option === "instapay" ? "اسم المستخدم" : "رقم الهاتف"}:
                                </span>
                                <span className="text-white font-medium">{transactionData.mobile}</span>
                            </div>
                            
                            <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                                <span className="text-gray-400">{"معرف الدفع"}:</span>
                                <span className="text-white font-medium">#{transactionData.payment_id}</span>
                            </div>
                            
                            <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                                <span className="text-gray-400">{"رقم المرجع"}:</span>
                                <span className="text-white font-medium">{transactionData.reference_id}</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">{"التاريخ والوقت"}:</span>
                                <span className="text-white font-medium">{currentDateTime}</span>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 bg-opacity-10 border border-blue-500 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="text-blue-400 font-medium mb-1">{"ملاحظة مهمة"}</h3>
                                <p className="text-gray-300 text-sm">
                                    {"سيتم مراجعة طلبك خلال 5-10 دقائق. في حالة عدم التأكيد، يرجى المحاولة مرة أخرى أو الاتصال بخدمة العملاء."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <Link 
                            href="/"
                            className="flex-1 py-3 px-6 bg-[#53B4AB] hover:bg-[#4a9e96] text-white rounded-lg font-semibold transition-colors duration-200 text-center"
                        >
                            {"العودة للرئيسية"}
                        </Link>
                        
                        {/* <button
                            onClick={() => window.print()}
                            className="flex-1 py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors duration-200"
                        >
                            {"طباعة الإيصال"}
                        </button> */}
                    </div>

                    {/* Contact Info */}
                    <div className="text-center mt-6 pt-6 border-t border-gray-600">
                        <p className="text-gray-400 text-sm">
                            {"في حالة وجود أي استفسار، يرجى الاتصال بخدمة العملاء"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
