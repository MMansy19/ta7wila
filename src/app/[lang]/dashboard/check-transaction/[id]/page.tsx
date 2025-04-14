"use client";

import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../../Shared/getAuth";
import { PaymentOption } from "../../userpermisions/types";

interface Store {
  id: string;
  name: string;
}

export interface Params {
  id: string;
  lang: string;
}

export default function CheckTransaction({ params }: { params: Promise<Params> }) {
  const [submitting, setSubmitting] = useState(false);
  const translations = useTranslation();
  const [selectedPaymentOption, setSelectedPaymentOption] =
    useState<string>("");
  const [selectedApplicationId, setSelectedApplicationId] =
    useState<string>("");
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [paymentId, setPaymentId] = useState<string>("");

  const defaultPaymentOptions = [
    { name: "VF- CASH", key: "vcash", img: "/vcash.svg" },
    { name: "Et- CASH", key: "ecash", img: "/ecash.svg" },
    { name: "WE- CASH", key: "wecash", img: "/wecash.svg" },
    { name: "OR- CASH", key: "ocash", img: "/ocash.svg" },
    { name: "INSTAPAY", key: "instapay", img: "/instapay.svg" },
  ];

  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [hoveredMethod, setHoveredMethod] = useState<string>("");
  const [errors, setErrors] = useState<{ mobile?: string; amount?: string }>({});

  const validateFields = () => {
    let newErrors: { mobile?: string; amount?: string } = {};

    if (selectedMethod === "instapay") {
      if (!mobile.trim()) {
        newErrors.mobile = translations.paymentVerification.modal.transactionDetails.instapayIdRequired;
      } else if (mobile.length < 6) {
        newErrors.mobile = translations.paymentVerification.modal.transactionDetails.instapayIdTooShort;
      }
    } else {
      const egyptianPhoneRegex = /^(010|011|012|015)\d{8}$/;
      if (!mobile.trim()) {
        newErrors.mobile = translations.auth.validation.mobileRequired;
      } else if (!egyptianPhoneRegex.test(mobile)) {
        newErrors.mobile = translations.auth.validation.mobileInvalid;
      }
    }

    if (!amount.trim()) {
      newErrors.amount = translations.paymentVerification.modal.transactionDetails.amountRequired;
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = translations.paymentVerification.modal.transactionDetails.invalidAmount;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleCheckTransaction = async (e: React.FormEvent) => {


    e.preventDefault();

    const { id } = await params;

    if (!validateFields()) {
      toast.error("Please correct the errors before submitting.");
      return;
    }

    setSubmitting(true);

    const values = {
      payment_option: selectedMethod,
      application_id: id,
      amount: amount,
      value: mobile,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/transactions/manual-check`,
        values,
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
        const response = await axios.get(
          `${apiUrl}/applications/${id}`,
          { headers: getAuthHeaders() }
        );
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
        }
      } catch (err) {
        toast.error("Failed to fetch payment options");
      }
    };

    fetchPaymentOptions();
  }, [ apiUrl]);

  return (
    <div className="bg-neutral-900 rounded-[18px] p-6 shadow-lg w-full text-[#FFFFFF] min-h-[calc(100vh-73px)]">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-3xl font-bold mb-6 text-center">
        {translations.paymentVerification.title}
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="col-md-6">
          <div className="my-6">
            <h3 className="font-semibold text-center mb-4">
              {translations.storepayment.modal.add.paymentOption}
            </h3>

            <div className="flex flex-wrap justify-center gap-4 py-4">
              {paymentOptions.map((method) => (
                <div
                  key={method.key}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl w-24 cursor-pointer transition-colors duration-200 ${selectedMethod === method.key
                      ? "bg-[#53B4AB] text-black"
                      : hoveredMethod === method.key
                        ? "bg-gray-700"
                        : "bg-[#7E7E7E] bg-opacity-35"
                    }`}
                  onClick={() => setSelectedMethod(method.key)}
                >
                  <Image
                    src={method.img}
                    alt={method.name}
                    width={40}
                    height={40}
                    className="mb-2"
                  />
                  <span className="text-sm">{method.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="my-4 text-sm text-center text-[#53B4AB]">
            <p>{translations.storepayment.modal.add.noCommission}</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between w-full">
              <p>{translations.storepayment.modal.add.vodafoneCashNumber}</p>
              <span className="text-sm font-semibold bg-[#7E7E7E] bg-opacity-35 p-2 rounded-lg text-[#53B4AB] inline-flex items-center gap-2">
                01030000000
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block align-middle"
                >
                  <path
                    d="M17 6L17 14C17 16.2091 15.2091 18 13 18H7M17 6C17 3.79086 15.2091 2 13 2L10.6569 2C9.59599 2 8.57857 2.42143 7.82843 3.17157L4.17157 6.82843C3.42143 7.57857 3 8.59599 3 9.65685L3 14C3 16.2091 4.79086 18 7 18M17 6C19.2091 6 21 7.79086 21 10V18C21 20.2091 19.2091 22 17 22H11C8.79086 22 7 20.2091 7 18M9 2L9 4C9 6.20914 7.20914 8 5 8L3 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <div className="flex justify-between w-full">
              <p>{translations.storepayment.modal.add.customerServiceNumber}</p>
              <span className="text-sm font-semibold bg-[#7E7E7E] bg-opacity-35 p-2 rounded-lg text-[#53B4AB] inline-flex items-center gap-2">
                01030000000
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block align-middle"
                >
                  <path
                    d="M17 6L17 14C17 16.2091 15.2091 18 13 18H7M17 6C17 3.79086 15.2091 2 13 2L10.6569 2C9.59599 2 8.57857 2.42143 7.82843 3.17157L4.17157 6.82843C3.42143 7.57857 3 8.59599 3 9.65685L3 14C3 16.2091 4.79086 18 7 18M17 6C19.2091 6 21 7.79086 21 10V18C21 20.2091 19.2091 22 17 22H11C8.79086 22 7 20.2091 7 18M9 2L9 4C9 6.20914 7.20914 8 5 8L3 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="space-y-4 text-sm">
            <p className="text-center px-4">
              {translations.storepayment.modal.add.transferInstructions}
            </p>

            <div className="mt-6 text-sm text-center text-gray-400">
              <p>
                {translations.storepayment.modal.add.waitingInstructions}
              </p>
            </div>
            <form onSubmit={handleCheckTransaction}>
              <div className="mb-4">
                <h3 className="font-semibold mb-1">
                  {selectedMethod === "instapay" ? translations.storepayment.modal.add.instapayId : translations.auth.mobile}
                  <span className="text-red-500"> *</span>
                </h3>

                <input
                  className={`bg-[#7E7E7E] bg-opacity-35 p-3 rounded-lg w-full ${errors.mobile ? "border-red-500 border-2" : ""}`}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder={selectedMethod === "instapay" ? translations.storepayment.modal.add.instapayPlaceholder : translations.storepayment.modal.add.mobilePlaceholder}
                  required
                />
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
              </div>

              <div className="mb-4 relative">
                <h3 className="font-semibold mb-1">
                  {translations.storepayment.modal.add.amount} <span className="text-red-500">*</span>
                </h3>
                <input
                  className={`bg-[#7E7E7E] bg-opacity-35 p-3 rounded-lg w-full ${errors.amount ? "border-red-500 border-2" : ""}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0 EGP"
                  required
                />
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              </div>

              <button
                type="submit"
                className="w-full p-3 bg-[#53B4AB] hover:bg-[#347871] text-black rounded-lg mt-3"
                disabled={submitting}
              >
                {submitting ? translations.auth.submitting : `${translations.paymentVerification.action.check} ${amount}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
