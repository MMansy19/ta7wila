"use client";

import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import getAuthHeaders from "../../Shared/getAuth";
import { PaymentOption } from "../../paymentVerification/types";

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
    if (!selectedPaymentId) {
      toast.error("Please select a payment value");
      return;
    }

    try {
      const { id } = await params;
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
    setSelectedPaymentValues(
      activePayments.map((p) => ({ value: p.value, id: p.id }))
    );
    setSelectedPaymentId(null);
  };

  const handlePaymentValueSelect = (paymentId: number) => {
    setSelectedPaymentId(paymentId);
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="bg-neutral-900 rounded-[18px] p-6 shadow-lg w-full text-[#FFFFFF] min-h-[calc(100vh-73px)]">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-3xl font-bold mb-8 text-center">
        {translations.paymentVerification.title}
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
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
          
          <div className="mt-8 bg-[#1E1E1E] rounded-xl p-6 shadow-md">
            <div className="mb-4 text-center">
              <h3 className="font-semibold text-xl mb-2">
                {translations.paymentVerification.modal.transactionDetails.title}
              </h3>
              <p className="text-sm text-[#53B4AB]">
                {translations.paymentVerification.modal.transactionDetails.pleaseSelectPaymentValue}
              </p>
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
                        title="Copy to clipboard"
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
                    {translations.paymentVerification.modal.transactionDetails.value}
                  </p>
                  <span className="text-sm font-semibold bg-[#3A3A3A] p-2 rounded-lg text-[#53B4AB] inline-flex items-center gap-2">
                    {translations.paymentVerification.modal.transactionDetails.value}
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
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-md">
            <div className="mb-6 text-center">
              <h3 className="font-semibold text-xl mb-2">
                {translations.paymentVerification.modal.transactionDetails.title}
              </h3>
            
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
                <Form className="space-y-5">
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 text-lg">
                      {selectedMethod === "instapay"
                        ? translations.paymentVerification.modal
                            .transactionDetails.instapayIdRequired
                        : translations.auth.mobile}
                      <span className="text-red-500"> *</span>
                    </h3>

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
                    <h3 className="font-semibold mb-2 text-lg">
                      {translations.paymentVerification.modal.transactionDetails.totalAmount}{" "}
                      <span className="text-red-500">*</span>
                    </h3>
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
                    className="w-full p-3 bg-[#53B4AB] hover:bg-[#347871] text-black rounded-lg mt-6 font-semibold text-sm transition-colors duration-200 shadow-md"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? translations.auth.submitting
                      : `${translations.paymentVerification.action.check}`}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
