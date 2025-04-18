import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import { format } from "date-fns";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import getAuthHeaders from "../Shared/getAuth";
import { PaymentData, PaymentOption, TransactionData } from "./types";

const CheckTransactionSchema = Yup.object().shape({
  applicationId: Yup.string().required("Please select an application"),
  paymentOption: Yup.string().required("Please select a payment option"),
});

const UpdateStatusSchema = Yup.object().shape({
  status: Yup.string().required("Please select a status"),
});

export default function TransactionModal({
  isOpen,
  onClose,
  paymentData,
  stores,
  refreshData,
  currentPage,
}: {
  isOpen: boolean;
  onClose: () => void;
  paymentData: PaymentData | null;
  stores: any[];
  refreshData: () => void;
  currentPage: number;
}) {
  const [showSecondForm, setShowSecondForm] = useState(false);
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("");
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const translations = useTranslation();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "EEE dd MMM h:mm a");
  };

  const fetchPaymentOptions = async (applicationId: string) => {
    try {
      const response = await axios.get(
        `${apiUrl}/payments?application_id=${applicationId}`,
        { headers: getAuthHeaders() }
      );
      if (response?.data.success && response?.data.result?.data) {
        setPayments(response.data.result.data|| []);
        const formattedOptions: PaymentOption[] = response.data.result.data.map(
          (payment: any) => ({
            id: payment.id,
            value: `${payment.value} (${payment.payment_option})`,
            key: payment.payment_option,
            name: payment.payment_option,
            img: "", 
          })
        );
        setPaymentOptions(formattedOptions);
      }
    } catch (err) {
      toast.error("Failed to fetch payment options");
      setPaymentOptions([]);
      setPayments([]);
    }
  };

  const handleCheckTransaction = async (values: { applicationId: string; paymentOption: string }) => {
    try {
      const selectedPayment = payments.find(p => p.id === Number(values.paymentOption));
      if (!selectedPayment) {
        toast.error("Please select a valid payment option");
        return;
      }

      const response = await axios.post(
        `${apiUrl}/verifications/check-transaction`,
        {
          payment_id: selectedPayment.id,
          id: paymentData?.id,
          
        },
        { headers: getAuthHeaders() }
      );

      if (response?.data?.success) {
        setShowSecondForm(true);
        toast.success("Transaction verified successfully!");
        setTransactionData(response.data.result.data);
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.errorMessage || "Failed to verify transaction"
      );
    }
  };

  const handleUpdateStatus = async (values: { status: string }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/verifications/check-transaction`,
        {
          payment_id: selectedPaymentId,
          id: paymentData?.id,
          status: values.status,
        },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        toast.success("Status updated successfully!");
        onClose();
        refreshData();
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.errorMessage || "Failed to update status"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed w-full z-20 inset-0 bg-black bg-opacity-70 flex justify-center items-center">
      <div className="bg-neutral-900 rounded-lg p-5 shadow-lg mx-4 w-full max-w-[600px]">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            {translations.paymentVerification.modal.checkTransaction}
          </h2>
          <button onClick={onClose} className="text-lg text-white">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.2431 7.75738L7.75781 16.2427M16.2431 16.2426L7.75781 7.75732"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        {!showSecondForm ? (
          <Formik
            initialValues={{
              applicationId: "",
              paymentOption: "",
            }}
            validationSchema={CheckTransactionSchema}
            onSubmit={handleCheckTransaction}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form>
                <input
                  type="hidden"
                  value={paymentData?.id || ""}
                  name="paymentDataId"
                />
                <div className="mb-4">
                  <label className="block text-sm text-white mb-2">
                    {translations.paymentVerification.modal.application} <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="applicationId"
                    className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setFieldValue("applicationId", e.target.value);
                      setFieldValue("paymentOption", ""); // Reset payment option when application changes
                      if (e.target.value) {
                        fetchPaymentOptions(e.target.value);
                      } else {
                        setPaymentOptions([]);
                      }
                    }}
                  >
                    <option value="">{translations.paymentVerification.modal.selectApplication}</option>
                    {stores.length > 0 ? (
                      stores.map((store) => (
                        <option key={store.id} value={store.id}>
                          {store.name}
                        </option>
                      ))
                    ) : (
                      <option value="">{translations.paymentVerification.modal.noApplications}</option>
                    )}
                  </Field>
                  {errors.applicationId && touched.applicationId && (
                    <div className="text-red-500 text-sm mt-1">{errors.applicationId}</div>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-white mb-2">
                    {translations.paymentVerification.modal.paymentOption} <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="paymentOption"
                    className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                    disabled={!paymentOptions.length}
                  >
                    <option value="">{translations.paymentVerification.modal.selectPaymentOption}</option>
                    {paymentOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.value}
                      </option>
                    ))}
                  </Field>
                  {errors.paymentOption && touched.paymentOption && (
                    <div className="text-red-500 text-sm mt-1">{errors.paymentOption}</div>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#53B4AB] hover:bg-[#347871] text-black rounded-lg"
                >
                  {translations.paymentVerification.modal.checkButton}
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{
              status: "",
            }}
            validationSchema={UpdateStatusSchema}
            onSubmit={handleUpdateStatus}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="space-y-4 text-white mb-4">
                  {transactionData && (
                    <div className="row flex justify-between">
                      <div className="col-span-6">
                        <div className="mb-2">
                          <label className="block text-sm text-gray-400 mb-1">
                            {translations.paymentVerification.modal.transactionDetails.transactionId}
                          </label>
                          <div className="text-base">
                            #{transactionData.ref_id || "N/A"}
                          </div>
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm text-gray-400 mb-1">
                            {translations.paymentVerification.modal.transactionDetails.senderName}
                          </label>
                          <div className="text-base">
                            {transactionData.sender_name || transactionData.mobile}
                          </div>
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm text-gray-400 mb-1">
                            {translations.paymentVerification.modal.transactionDetails.totalAmount}
                          </label>
                          <div className="text-base">
                            {transactionData.amount} EGP
                          </div>
                        </div>
                      </div>
                      <div className="col-span-6">
                        <div className="mb-2">
                          <label className="block text-sm text-gray-400 mb-1">
                            {translations.paymentVerification.modal.transactionDetails.transactionDate}
                          </label>
                          <div className="text-base">
                            {transactionData?.transaction_date
                              ? formatDate(transactionData.transaction_date)
                              : formatDate(transactionData.created_at)}
                          </div>
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm text-gray-400 mb-1">
                            {translations.paymentVerification.modal.transactionDetails.currentStatus}
                          </label>
                          <div className="text-base">
                            {transactionData.status || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-white mb-1">
                    {translations.paymentVerification.modal.transactionDetails.verificationStatus}
                  </label>
                  <Field
                    as="select"
                    name="status"
                    className="w-full px-3 py-2 bg-[#444444] text-white rounded-lg appearance-none"
                  >
                    <option value="">Select Status</option>
                    <option value="verified">{translations.paymentVerification.modal.transactionDetails.approved}</option>
                    <option value="rejected">{translations.paymentVerification.modal.transactionDetails.rejected}</option>
                  </Field>
                  {errors.status && touched.status && (
                    <div className="text-red-500 text-sm mt-1">{errors.status}</div>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#53B4AB] hover:bg-[#347871] text-black rounded-lg"
                >
                  {translations.paymentVerification.modal.transactionDetails.updateStatus}
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}