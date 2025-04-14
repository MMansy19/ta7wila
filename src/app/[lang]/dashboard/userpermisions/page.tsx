"use client";

import Pagination from "@/components/[lang]/pagination";
import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";
import { PaymentData, PaymentOption, TransactionData } from "./types";

export default function UserPermissions() {
  const [PaymentDatas, setPaymentDatas] = useState<PaymentData[]>([]);
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stores, setStores] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [selectedPaymentData, setSelectedPaymentData] =
    useState<PaymentData | null>(null);
  const [isModalOpenadd, setIsModalOpenadd] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] =
    useState<string>("");
  const [paymentOption, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [selectedPaymentOption, setSelectedPaymentOption] =
    useState<string>("");
  const paymentOptions = [
    { name: "VF- CASH", key: "vcash", img: "/vcash.svg" },
    { name: "Et- CASH", key: "ecash", img: "/ecash.svg" },
    { name: "WE- CASH", key: "wecash", img: "/wecash.svg" },
    { name: "OR- CASH", key: "ocash", img: "/ocash.svg" },
    { name: "INSTAPAY", key: "instapay", img: "/instapay.svg" },
  ];

  const translations = useTranslation();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "EEE dd MMM h:mm a");
  };

  const itemsPerPage = 15;
  const displayedPaymentDatas = PaymentDatas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (page: number) => setCurrentPage(page);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = (id: number) => {
    setDropdownOpen((prev) => (prev === id ? null : id));
  };

  const openModal2 = () => {
    setIsModalOpenadd(true);
  };

  const closeModal2 = () => {
    setIsModalOpenadd(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(`${apiUrl}/applications`, {
          headers: getAuthHeaders(),
        });
        const data = response.data.result.data;
        const transformedStores = data.map((item: any) => ({
          id: item.id,
          name: item.name,
        }));

        setStores(transformedStores);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch stores");
        toast.error("Failed to fetch stores");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [apiUrl]);

  useEffect(() => {
    const fetchPaymentDatas = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/verifications?page=${currentPage}`,
          { headers: getAuthHeaders() }
        );
        const data = response.data.result.data;
        const transformedPaymentDatas: PaymentData[] = data.map(
          (item: any) => ({
            id: item.id,
            ref_id: item.ref_id,
            value: item.value,
            payment_option: item.payment_option,
            status: item.status,
            created_at: new Date(item.created_at).toLocaleDateString(),
            updated_at: new Date(item.updated_at).toLocaleDateString(),
            user_id: item.user_id,
            payment_id: item.payment_id,
            transaction_id: item.transaction_id,
            application_id: item.application_id,
            transaction: item.transaction,
            user: {
              name: item.user?.name || "Unknown",
              mobile: item.user?.mobile || "N/A",
              email: item.user?.email || "N/A",
            },
            application: {
              id: item.application?.id || 0,
              name: item.application?.name || "Unknown",
              logo: item.application?.logo || "",
              email: item.application?.email || "N/A",
            },
          })
        );
        setPaymentDatas(transformedPaymentDatas);
        setTotalPages(response.data.result.totalPages);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch PaymentDatas");
        toast.error("Failed to fetch PaymentDatas");
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentDatas();
  }, [currentPage, apiUrl]);

  const handleCheckTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedApplicationId || !selectedPaymentOption) {
      toast.error("Please select both application and payment option");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/verifications/check-transaction`,
        {
          payment_id: selectedPaymentOption,
          id: selectedPaymentData?.id,
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

  const [showSecondForm, setShowSecondForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${apiUrl}/verifications/check-transaction`,
        {
          payment_id: selectedPaymentOption,
          id: selectedPaymentData?.id,
          status: selectedStatus,
        },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        toast.success("Status updated successfully!");
        closeModal2();

        const refreshResponse = await axios.get(
          `${apiUrl}/verifications?page=${currentPage}`,
          { headers: getAuthHeaders() }
        );
        setPaymentDatas(refreshResponse.data.result.data);
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.errorMessage || "Failed to update status"
      );
    }
  };

  useEffect(() => {
    const fetchPaymentOptions = async () => {
      if (!selectedApplicationId) return;

      try {
        const response = await axios.get(
          `${apiUrl}/applications/${selectedApplicationId}`,
          { headers: getAuthHeaders() }
        );
        if (response?.data.success && response?.data.result?.payment_options) {
          const formattedOptions: PaymentOption[] = response.data.result.payment_options.map(
            (option: string, index: number) => ({
              id: String(index),
              value: option,
              key: option,
              img: "", 
            })
          );
          setPaymentOptions(formattedOptions);
        }
       
      } catch (err) {
        toast.error("Failed to fetch payment options");
      }
    };

    fetchPaymentOptions();
  }, [selectedApplicationId, apiUrl]);

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="grid">
      <div className="flex overflow-hidden flex-col  px-8 py-6 w-full bg-neutral-900 rounded-[18px] max-md:max-w-full text-white min-h-[calc(100vh-73px)]">
        <Toaster position="top-right" reverseOrder={false} />
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">{translations.paymentVerification.title}</h1>
        </div>
        <div className="overflow-x-auto ">
          <table className="table-auto w-full text-left">
            <thead>
              <tr className="text-center">
                <th className="p-2">ID</th>
                <th className="p-2">User name</th>
                <th className="p-2">Payment value</th>
                <th className="p-2">Payment option</th>
                <th className="p-2">Date</th>
                <th className="p-2">State</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedPaymentDatas.length > 0 ? (
                displayedPaymentDatas.map((PaymentData) => {
                  const paymentOption = paymentOptions.find(
                    (opt) => opt.key === PaymentData.payment_option
                  );
                  return (
                    <tr key={PaymentData.id} className="text-center">
                      <td className="p-2">{PaymentData.id}</td>
                      <td className="p-2">{PaymentData.user.name}</td>
                      <td className="p-2">{PaymentData.value}</td>
                      <td className="p-2 items-center flex justify-center">
                        {paymentOption ? (
                          <Image
                            width="34"
                            height="34"
                            loading="lazy"
                            src={paymentOption.img}
                            alt={paymentOption.name}
                            className="object-contain self-center aspect-square w-[34px]"
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="p-2">{PaymentData.created_at}</td>
                      <td className="p-2">
                        <span
                          className={`px-2.5 py-1.5 rounded-[1rem] text-sm ${
                            PaymentData.status === "verified"
                              ? "bg-[#53B4AB] bg-opacity-25 text-[#0FDBC8]"
                              : PaymentData.status === "pending"
                                ? "bg-[#F58C7B] bg-opacity-25 text-[#F58C7B]"
                                : "bg-red-500"
                          }`}
                        >
                          {PaymentData.status}
                        </span>
                      </td>
                      {PaymentData.status === "verified" ? (
                        <td className="p-2 text-center">-</td>
                      ) : (
                        <td className="p-2 text-center">
                          <div className="flex justify-center">
                            <button
                              onClick={() => {
                                setSelectedPaymentData(PaymentData);
                                toggleDropdown(PaymentData.id);
                                openModal2();
                              }}
                              className="flex bg-[#53B4AB] text-black text-sm rounded-xl px-4 py-2 hover:bg-[#53B4AB] items-center"
                            >
                              check
                              <svg
                                width="17"
                                height="17"
                                viewBox="0 0 17 17"
                                fill="none"
                                className="ml-2"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2.5 14.803H14.5M9.68961 4.34412C9.68961 4.34412 9.68961 5.43387 10.7794 6.52362C11.8691 7.61337 12.9589 7.61337 12.9589 7.61337M5.37975 12.795L7.66823 12.4681C7.99833 12.4209 8.30424 12.268 8.54003 12.0322L14.0486 6.52362C14.6505 5.92177 14.6505 4.94597 14.0486 4.34412L12.9589 3.25437C12.357 2.65252 11.3812 2.65252 10.7794 3.25437L5.27078 8.76295C5.03499 8.99874 4.88203 9.30465 4.83488 9.63475L4.50795 11.9232C4.4353 12.4318 4.8712 12.8677 5.37975 12.795Z"
                                  stroke="black"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="p-4 text-center" colSpan={7}>
                    No Payments Verifications available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isModalOpenadd && (
          <div className="fixed w-full z-20 inset-0 bg-black bg-opacity-70 flex justify-center items-center ">
            <div className="bg-neutral-900 rounded-[14px]   p-5 shadow-lg mx-4 w-full max-w-[600px]">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold  text-white">
                  {translations.paymentVerification.modal.checkTransaction}
                </h2>
                <button
                  onClick={() => closeModal2()}
                  className=" text-lg text-white  "
                >
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
                <form onSubmit={handleCheckTransaction}>
                  <input
                    type="hidden"
                    value={selectedPaymentData?.id || ""}
                    name="paymentDataId"
                  />
                  <div className="mb-4">
                    <label className="block text-sm  text-white mb-1">
                      Application <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 bg-[#444444] text-white rounded-[14px] appearance-none"
                      value={selectedApplicationId}
                      onChange={(e) => {
                        console.log("Selected Store ID:", e.target.value);
                        setSelectedApplicationId(e.target.value);
                      }}
                    >
                      <option value="">Select application</option>
                      {stores.length > 0 ? (
                        stores.map((store) => (
                          <option key={store.id} value={store.id}>
                            {store.name}
                          </option>
                        ))
                      ) : (
                        <option key="loading" value="">
                          no applications
                        </option>
                      )}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm  text-white mb-1">
                      Payment Option <span className="text-red-500">*</span>
                    </label>
                    <select
        required
        value={selectedPaymentOption}
        onChange={(e) => {
          setSelectedPaymentOption(e.target.value);
          console.log(e.target.value);
        }}
        className="w-full px-3 py-2 bg-[#444444] text-white rounded-[14px] appearance-none"
        disabled={!paymentOption.length}
      >
        <option value="">Select payment option</option>
        {paymentOption.map((option) => (
          <option key={option.key} value={option.id}>
            {option.value}
          </option>
        ))}
      </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2  bg-[#53B4AB] hover:bg-[#347871] text-black  rounded-[14px]"
                    onSubmit={handleCheckTransaction}
                  >
                    Check Transaction
                  </button>
                </form>
              ) : (
                <form onSubmit={handleUpdateStatus}>
                  <div className="space-y-4 text-white mb-4">
                    {transactionData && (
                      <div className="row flex justify-between">
                        <div className="col-span-6">
                          <div className="mb-2">
                            <label className="block text-sm text-gray-400 mb-1">
                              Transaction ID
                            </label>
                            <div className="text-base">
                              #{transactionData.ref_id || "N/A"}
                            </div>
                          </div>

                          <div className="mb-2">
                            <label className="block text-sm text-gray-400 mb-1">
                              Sender name
                            </label>
                            <div className="text-base">
                              {transactionData.sender_name ||
                                transactionData.mobile}
                            </div>
                          </div>

                          <div className="mb-2">
                            <label className="block text-sm text-gray-400 mb-1">
                              Total amount
                            </label>
                            <div className="text-base">
                              {transactionData.amount} EGP
                            </div>
                          </div>
                        </div>

                        <div className="col-span-6">
                          <div className="mb-2">
                            <label className="block text-sm text-gray-400 mb-1">
                              Transaction date
                            </label>
                            <div className="text-base">
                              {transactionData?.transaction_date
                                ? formatDate(transactionData.transaction_date)
                                : formatDate(transactionData.created_at)}
                            </div>
                          </div>

                          <div className="mb-2">
                            <label className="block text-sm text-gray-400 mb-1">
                              Current Status
                            </label>
                            <div className="text-base ">
                              {transactionData.status || "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-white mb-1">
                      Verification Request Status
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-[#444444] text-white rounded-[14px] appearance-none"
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="">Select status</option>
                      <option value="verified">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2  bg-[#53B4AB] hover:bg-[#347871] text-black  rounded-[14px]"
                    onSubmit={handleCheckTransaction}
                  >
                    update Verification status
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChangeClient={handlePageChange}
        />
      </div>
    </div>
  );
}
