"use client";

import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { Field, Form, Formik } from 'formik';
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from 'yup';
import getAuthHeaders from "../Shared/getAuth";
import { ApiResponse } from "./types";
export const dynamic = 'force-dynamic';

export default function PaymentConfirmation() {
  const translations = useTranslation();
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount');
  const ref_id = searchParams.get('ref_id');
  const name = searchParams.get('name');
  const [checkoutData, setCheckoutData] = useState<ApiResponse['result'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchApplications = async () => {
      if (!ref_id) {
        setLoading(false);
        return; 
      }
      try {
        const response = await axios.get(        
          `${apiUrl}/checkouts/check-checkout?ref_id=${ref_id}`,
          {  
            headers: {
              ...getAuthHeaders(),  
              ...(name && { 'subdomain': name })
            } 
          }
        );
        if (response.data.success) {
          setCheckoutData(response.data.result);
        }
      } catch (err) {
        toast.error("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [apiUrl, ref_id, name]);

  const validationSchema = Yup.object().shape({
    mobile: Yup.string()
      .required(translations.auth.validation.mobileRequired)
      .matches(/^[0-9]+$/, translations.auth.validation.mobileInvalid)
      .min(10, translations.auth.validation.mobileRequired)
      .max(15, translations.auth.validation.mobileRequired),
    amount: Yup.number()
      .required(translations.paymentVerification.modal.transactionDetails.amountRequired)
      .min(1, translations.paymentVerification.modal.transactionDetails.invalidAmount)
  });

  const handleSubmit = async (values: { mobile: string; amount: string }, { setSubmitting }: any) => {
    if (!checkoutData) {
      toast.error("Checkout data not loaded");
      setSubmitting(false);
      return;
    }

    const selectedPayment = checkoutData.payments.find(
      (p) => p.payment_option === selectedMethod
    );

    if (!selectedPayment) {
      toast.error("Please select a payment method");
      setSubmitting(false);
      return;
    }

    const submitValues = {
      ref_id: ref_id,
      name: name,
      payment_id: selectedPayment.id,
      payment_option: selectedMethod,
      amount: values.amount,
      value: values.mobile,
      application_id: checkoutData.application.id
    };

    try {
      const response = await axios.post(
        `${apiUrl}/transactions/check-subscription`,
        submitValues,
        { headers: getAuthHeaders() }
      );
      toast.success("Transaction checked successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.errorMessage || "Failed to check transaction");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-neutral-900 rounded-[18px] p-6 shadow-lg w-full text-[#FFFFFF] min-h-[calc(100vh-73px)]">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-2xl font-bold mb-8 text-center">
        {translations.subscription.title}
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="col-md-6">
          <div className="my-6 min-h-[220px]">
            {checkoutData ? (
              <>
                <h3 className="font-semibold text-center mb-4">
                  {translations.paymentVerification.modal.paymentOption}
                </h3>
                <div className="flex flex-wrap justify-center gap-4 py-4">
                  {checkoutData.application.payment_options.map((paymentOption) => {
                    const paymentDetail = checkoutData.payments.find(
                      (p) => p.payment_option === paymentOption
                    );
                    
                    if (!paymentDetail) return null;

                    return (
                      <div
                        key={paymentOption}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl w-24 cursor-pointer transition-colors duration-200 ${
                          selectedMethod === paymentOption
                            ? "bg-[#53B4AB] text-black"
                            : "bg-[#7E7E7E] bg-opacity-35"
                        }`}
                        onClick={() => setSelectedMethod(paymentOption)}
                      >
                        <Image
                          src={`/${paymentOption}.svg`}
                          alt={paymentOption}
                          width={40}
                          height={40}
                          className="mb-2"
                        />
                        <span className="text-sm capitalize">{paymentOption}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            ):(
              <div className="my-4 text-sm text-center text-[#53B4AB]">
              <p>{translations.storepayment.noData}</p>
            </div>
            )
            }
          </div>
        
          <div className="space-y-2">
            <div className="flex justify-between w-full">
              <p>{translations.vendors.validation.mobile}</p>
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
           

            <div className="mt-6 text-sm text-center text-gray-400">
              <p>{translations.paymentVerification.modal.checkTransaction}</p>
            </div>
            
            <Formik
              initialValues={{
                mobile: '',
                amount: amount || ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <h3 className="font-semibold mb-1">
                      {selectedMethod === "instapay" ? "Instapay ID" : translations.auth.mobile}
                      <span className="text-red-500"> *</span>
                    </h3>
                    <Field
                      name="mobile"
                      className={`px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10 mt-2 ${
                        errors.mobile && touched.mobile ? "border-red-500 border-2" : ""
                      }`}
                      placeholder={translations.auth.mobile}
                    />
                    {errors.mobile && touched.mobile && (
                      <div className="text-red-500 text-sm mt-1">{errors.mobile}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold mb-1">
                      {translations.subscription.modal.subscriptionAmount} <span className="text-red-500">*</span>
                    </h3>
                    <Field
                      name="amount"
                      type="number"
                      className={`px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10  mt-2${
                        errors.amount && touched.amount ? "border-red-500 border-2" : ""
                      }`}
                      placeholder="0 EGP"
                    />
                    {errors.amount && touched.amount && (
                      <div className="text-red-500 text-sm mt-1">{errors.amount}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full p-3 bg-[#53B4AB] hover:bg-[#347871] text-black font-semibold rounded-lg mt-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? translations.auth.submitting : `${translations.transactionModal.form.check} ${amount}`}
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











