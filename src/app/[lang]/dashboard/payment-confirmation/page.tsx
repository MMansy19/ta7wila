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
  const title = searchParams.get('title');
  const subtitle = searchParams.get('subtitle');
  const subscription_type = searchParams.get('subscription_type');
  const max_applications_count = searchParams.get('max_applications_count');
  const max_employees_count = searchParams.get('max_employees_count');
  const max_vendors_count = searchParams.get('max_vendors_count');
  const plan_id = searchParams.get('plan_id');
  
  const [checkoutData, setCheckoutData] = useState<ApiResponse['result'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Helper function to get payment method number
  const getPaymentMethodNumber = () => {
    const paymentNumbers = translations.paymentConfirmation.paymentNumbers;
    
    // Map different payment method variations to our keys
    const methodMap: { [key: string]: keyof typeof paymentNumbers } = {
      'vcash': 'vcash',
      'vodafonecash': 'vcash',
      'vodafone-cash': 'vcash',
      'ecash': 'ecash',
      'etisalatcash': 'ecash',
      'etisalat-cash': 'ecash',
      'wecash': 'wecash',
      'wecash-cash': 'wecash',
      'instapay': 'instapay',
      'ocash': 'ocash',
      'orangecash': 'ocash',
      'orange-cash': 'ocash'
    };

    const mappedMethod = methodMap[selectedMethod?.toLowerCase()] || selectedMethod as keyof typeof paymentNumbers;
    
    if (mappedMethod && mappedMethod in paymentNumbers) {
      return paymentNumbers[mappedMethod];
    }
    return paymentNumbers.vcash; // Default fallback
  };

  // Copy payment number to clipboard
  const copyPaymentNumber = async () => {
    try {
      await navigator.clipboard.writeText(getPaymentMethodNumber());
      toast.success(translations.publicPayment?.copied || "Copied!");
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      if (!ref_id) {
        setLoading(false);
        return; 
      }

      // For subscription payments, we'll fetch payment options from the subscription API
      if (name === "subscriptions") {
        console.log("This is a subscription payment, fetching subscription payment options");
        try {
          // Try to fetch subscription payment options
          const subscriptionResponse = await axios.get(
            `${apiUrl}/subscriptions/payment-options`,
            { headers: getAuthHeaders() }
          );
          
          console.log("Subscription payment options response:", subscriptionResponse.data);
          
          if (subscriptionResponse.data.success && subscriptionResponse.data.result) {
            setCheckoutData(subscriptionResponse.data.result);
            setLoading(false);
            return;
          }
        } catch (subscriptionError) {
          console.warn("Failed to fetch subscription payment options, using fallback:", subscriptionError);
        }
        
        // Fallback to mock data if API fails
        console.log("Using fallback payment options for subscription");
        const defaultSubscriptionPaymentOptions: ('instapay' | 'ecash' | 'wecash')[] = ["ecash", "instapay", "wecash"];
        const mockCheckoutData = {
          application: {
            id: 0,
            name: translations.paymentConfirmation.subscriptionPayment,
            mobile: "",
            email: "",
            logo: null,
            payment_options: defaultSubscriptionPaymentOptions
          },
          payments: defaultSubscriptionPaymentOptions.map((option, index) => ({
            id: index + 1,
            payment_option: option,
            value: `${translations.paymentConfirmation.defaultPaymentOption} ${option} ${translations.paymentConfirmation.forSubscriptions}`
          })),
          result: {
            amount: Number(amount) || 0,
            ref_id: ref_id || "",
            status: "not-paid"
          }
        };
        setCheckoutData(mockCheckoutData);
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching checkout data for ref_id:", ref_id);
        console.log("Using name subdomain:", name);
        
        const response = await axios.get(        
          `${apiUrl}/checkouts/check-checkout?ref_id=${ref_id}`,
          {  
            headers: {
              ...getAuthHeaders(),  
              ...(name && { 'subdomain': name })
            } 
          }
        );
        
        console.log("Checkout response:", response.data);
        
        if (response.data.success) {
          setCheckoutData(response.data.result);
          console.log("Checkout data set:", response.data.result);
        } else {
          console.error("Checkout request unsuccessful:", response.data);
          toast.error(response.data.message || translations.paymentConfirmation.failedToCheckTransaction);
        }
      } catch (err: any) {
        console.error("Error fetching checkout data:", err);
        console.error("Error response:", err.response?.data);
        toast.error(err.response?.data?.message || translations.paymentConfirmation.failedToCheckTransaction);
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
      toast.error(translations.paymentConfirmation.checkoutDataNotLoaded);
      setSubmitting(false);
      return;
    }

    const selectedPayment = checkoutData.payments.find(
      (p) => p.payment_option === selectedMethod
    );

    if (!selectedPayment) {
      toast.error(translations.paymentConfirmation.selectPaymentMethod);
      setSubmitting(false);
      return;
    }

    const submitValues = {
      ref_id: ref_id,
      payment_option: selectedMethod,
      amount: values.amount,
      value: values.mobile,
      ...(plan_id && { plan_id: plan_id }),
      ...(subscription_type && { subscription_type: subscription_type })
    };

    try {
      // Use different endpoint for subscription vs regular checkout
      const endpoint = name === "subscriptions" 
        ? `${apiUrl}/subscriptions/check-payment`
        : `${apiUrl}/transactions/check-subscription`;
      
      console.log("Submitting to endpoint:", endpoint);
      console.log("Submit values:", submitValues);
      
      const response = await axios.post(
        endpoint,
        submitValues,
        { headers: getAuthHeaders() }
      );
      
      console.log("Submit response:", response.data);
      toast.success(translations.paymentConfirmation.transactionCheckedSuccessfully);
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error(err.response?.data?.errorMessage || translations.paymentConfirmation.failedToCheckTransaction);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-neutral-900 rounded-[18px] p-6 shadow-lg w-full text-[#FFFFFF] min-h-[calc(100vh-73px)]">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-2xl font-bold mb-8 text-center">
        {translations.paymentConfirmation.title}
      </h2>

      {/* Subscription Details Section */}
      {title && (
        <div className="bg-[#2A2A2A] rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-[#53B4AB] mb-4">
            {translations.paymentConfirmation.subscriptionDetails}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                {translations.paymentConfirmation.planName}
              </label>
              <div className="text-lg font-semibold text-white">
                {title}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                {translations.subscription?.modal?.subscriptionAmount || translations.paymentConfirmation.amount}
              </label>
              <div className="text-lg font-semibold text-[#53B4AB]">
                {amount} {translations.paymentConfirmation.currency}
              </div>
            </div>
            {subtitle && (
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">
                  {translations.paymentConfirmation.description}
                </label>
                <div className="text-base text-gray-300">
                  {subtitle}
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                {translations.subscription?.modal?.subscriptionType || translations.paymentConfirmation.subscriptionType}
              </label>
              <div className="text-base text-white capitalize">
                {subscription_type || translations.paymentConfirmation.notAvailable}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                {translations.subscription?.table?.applications || translations.paymentConfirmation.maxApplications}
              </label>
              <div className="text-base text-white">
                {max_applications_count || translations.paymentConfirmation.notAvailable}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                {translations.subscription?.table?.employees || translations.paymentConfirmation.maxEmployees}
              </label>
              <div className="text-base text-white">
                {max_employees_count || translations.paymentConfirmation.notAvailable}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                {translations.subscription?.table?.vendors || translations.paymentConfirmation.maxVendors}
              </label>
              <div className="text-base text-white">
                {max_vendors_count || translations.paymentConfirmation.notAvailable}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="col-md-6">
          <div className="my-6 min-h-[220px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#53B4AB] mx-auto mb-4"></div>
                  <p className="text-gray-400">{translations.paymentConfirmation.loadingPaymentMethods}</p>
                </div>
              </div>
            ) : checkoutData ? (
              <>
                <h3 className="font-semibold text-center mb-4">
                  {translations.paymentVerification.modal.paymentOption}
                </h3>
                {checkoutData.application?.payment_options?.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-4 py-4">
                    {checkoutData.application.payment_options.map((paymentOption) => {
                      const paymentDetail = checkoutData.payments.find(
                        (p) => p.payment_option === paymentOption
                      );
                      
                      if (!paymentDetail) {
                        console.warn(`No payment detail found for option: ${paymentOption}`);
                        return null;
                      }

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
                            onError={(e) => {
                              console.warn(`Failed to load icon for ${paymentOption}`);
                              // Set a fallback or handle the error
                              (e.target as HTMLImageElement).src = '/default-payment.svg';
                            }}
                          />
                          <span className="text-sm capitalize">{paymentOption}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="my-4 text-sm text-center text-red-400">
                    <p>{translations.paymentConfirmation.noPaymentOptions}</p>
                    <p className="text-gray-400 mt-2">
                      {name === "subscriptions" 
                        ? translations.paymentConfirmation.contactSupportSubscription
                        : translations.paymentConfirmation.contactStoreOwner
                      }
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="my-4 text-sm text-center text-[#53B4AB]">
                <p>{translations.paymentConfirmation.noCheckoutData}</p>
                <p className="text-gray-400 mt-2">
                  ref_id: {ref_id || translations.paymentConfirmation.notProvided}<br/>
                  name: {name || translations.paymentConfirmation.notProvided}
                </p>
                <p className="text-red-400 mt-2">
                  {name === "subscriptions" 
                    ? translations.paymentConfirmation.unableToLoadSubscription
                    : translations.paymentConfirmation.checkRefId
                  }
                </p>
              </div>
            )}
          </div>
        
          <div className="space-y-2">
            <div className="flex justify-between w-full">
              <p>{translations.paymentConfirmation.paymentNumbers.ourNumber}</p>
              {selectedMethod ? (
                <span 
                  className="text-sm font-semibold bg-[#7E7E7E] bg-opacity-35 p-2 rounded-lg text-[#53B4AB] inline-flex items-center gap-2 cursor-pointer hover:bg-opacity-50 transition-all"
                  onClick={copyPaymentNumber}
                  title={translations.publicPayment?.copy || "Copy"}
                >
                  {getPaymentMethodNumber()}
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
              ) : (
                <span className="text-sm text-gray-400 bg-[#7E7E7E] bg-opacity-20 p-2 rounded-lg">
                  {translations.paymentConfirmation.paymentNumbers.selectMethodFirst}
                </span>
              )}
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
                      {selectedMethod === "instapay" ? translations.paymentConfirmation.instapayId : translations.auth.mobile}
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
                      placeholder={translations.paymentConfirmation.amountPlaceholder}
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











