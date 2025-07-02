"use client";
import Pagination from "@/components/Shared/Pagination";
import { useTranslation } from '@/hooks/useTranslation';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search, X, Eye } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";
import useCurrency from "../Shared/useCurrency";
import { Transactions, DetailedTransaction } from "./types";
export const dynamic = 'force-dynamic';

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Transaction() {
  const params = useParams();
  const lang = params.lang as string;
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);
  const [selectedTransactionDetails, setSelectedTransactionDetails] = useState<
    DetailedTransaction | null
  >(null);
  const [filterState, setFilterState] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const translations = useTranslation();
  const formatCurrency = useCurrency();

  const defaultPaymentOptions = [
    { name: "VF- CASH", key: "vcash", img: "/vcash.svg" },
    { name: "Et- CASH", key: "ecash", img: "/ecash.svg" },
    { name: "WE- CASH", key: "wecash", img: "/wecash.svg" },
    { name: "OR- CASH", key: "ocash", img: "/ocash.svg" },
    { name: "INSTAPAY", key: "instapay", img: "/instapay.svg" },
  ];

  const fetchTransactions = async (): Promise<Transactions[]> => {
    const response = await axios.get(
      `${apiUrl}/transactions?page=${currentPage}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (
      response.data.success &&
      response.data.result &&
      response.data.result.data
    ) {
      console.log("Transactions fetched successfully:", response.data.result.data);
      return response.data.result.data.map((item: any) => ({
        id: item.id,
        store: item.transaction_id || "-",
        from: item.mobile || "-",
        provider: item.payment_option || "-",
        amount: item.amount || 0,
        state: item.status || "-",
        transaction: item.transaction_id || "-",
        simNumber: "-",
        userName: item.sender_name || "-",
        date: new Date(item.transaction_date).toLocaleDateString(),
      }));
    }

    throw new Error("Error fetching transactions");
  };

  const fetchTransactionDetails = async (transactionId: number): Promise<DetailedTransaction> => {
    const response = await axios.get(
      `${apiUrl}/transactions/${transactionId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (response.data.success && response.data.result) {
      return response.data.result;
    }

    throw new Error("Error fetching transaction details");
  };

  const {
    data: transactions = [],
    isLoading,
    error,
  } = useQuery<Transactions[]>({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });

  const filteredTransactions = transactions
    .filter(
      (t: Transactions) => filterState === "All" || t.state === filterState
    )
    .filter(
      (t: Transactions) =>
        searchQuery === "" ||
        t.id.toString().includes(searchQuery) ||
        t.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.amount.toString().includes(searchQuery)
    );
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const displayedTransactions = filteredTransactions
    .slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleMarkAsCompleted = async () => {
    if (selectedTransactionId) {
      try {
        await axios.post(
          `${apiUrl}/transactions/mark-as-completed/${selectedTransactionId}`,
          {},
          { headers: getAuthHeaders() }
        );

        toast.success("Transaction marked as completed!");      } catch (error: unknown) {
        let errorMessage = translations.errors?.developerMode || "Error updating transaction";
        
        if (error && typeof error === 'object' && 'response' in error) {
          const err = error as { 
            response: { 
              data?: { 
                errorMessage?: string;
                message?: string;
                result?: Record<string, string>;
              } | string;
            }
          };

          if (typeof err.response.data === "string") {
            errorMessage = err.response.data;
          } else if (err.response.data?.errorMessage) {
            errorMessage = err.response.data.errorMessage;
          } else if (err.response.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.data?.result) {
            errorMessage = Object.values(err.response.data.result).join(", ");
          }
        }

        toast.error(errorMessage);
      } finally {
        setShowModal(false);
        setSelectedTransactionId(null);
      }
    }
  };

  const handleViewDetails = async (transactionId: number) => {
    try {
      const details = await fetchTransactionDetails(transactionId);
      setSelectedTransactionDetails(details);
      setShowDetailsModal(true);
    } catch (error) {
      let errorMessage = translations.errors?.developerMode || "Error loading transaction details";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { 
          response: { 
            data?: { 
              errorMessage?: string;
              message?: string;
              result?: Record<string, string>;
            } | string;
          }
        };

        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else if (err.response.data?.errorMessage) {
          errorMessage = err.response.data.errorMessage;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data?.result) {
          errorMessage = Object.values(err.response.data.result).join(", ");
        }
      }
      
      toast.error(errorMessage);
    }
  };

  if (error) {
    let errorMessage = translations.errors?.developerMode || "Error loading transactions";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && 'response' in error) {
      const err = error as { 
        response: { 
          data?: { 
            errorMessage?: string;
            message?: string;
            result?: Record<string, string>;
          } | string;
        }
      };

      if (typeof err.response.data === "string") {
        errorMessage = err.response.data;
      } else if (err.response.data?.errorMessage) {
        errorMessage = err.response.data.errorMessage;
      } else if (err.response.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response.data?.result) {
        errorMessage = Object.values(err.response.data.result).join(", ");
      }
    }
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 bg-red-100/10 p-4 rounded-lg">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="grid">
      <div className="flex overflow-hidden flex-col px-8 py-6 w-full bg-neutral-900 rounded-[18px] max-md:max-w-full text-white min-h-[calc(100vh-73px)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {translations.transactions.title}
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder={translations.transactions.search.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-neutral-800 rounded-lg text-sm text-white placeholder:text-white/50 !outline-none focus:outline-none focus:ring-0 border-0 focus:border-0 w-[300px]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-white">
              <tr className="text-start">
                <th className="p-2">{translations.transactions.table.id}</th>
                <th className="p-2">{translations.transactions.table.from}</th>
                <th className="p-2">
                  {translations.transactions.table.provider}
                </th>
                <th className="p-2">
                  {translations.transactions.table.amount}
                </th>
                <th className="p-2">{translations.transactions.table.state}</th>
                <th className="p-2">
                  {translations.transactions.table.userName}
                </th>
                <th className="p-2">{translations.transactions.table.date}</th>
                <th className="p-2">
                  {translations.transactions.table.action}
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedTransactions.length > 0 ? (
                displayedTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition border-b border-white/10 hover:bg-neutral-800/50 cursor-pointer"
                    onClick={() => handleViewDetails(transaction.id)}
                  >
                    <td className="p-2">{transaction.id}</td>
                    <td className="p-2">
                      <span
                        style={{
                          direction: "ltr",
                          textAlign: "left",
                          display: "inline-block",
                        }}
                      >
                        {transaction.from}
                      </span>
                    </td>
                    {/* <td className="p-2" >{transaction.from}</td> */}
                    <td className="p-2">
                      {defaultPaymentOptions.find(
                        (option) => option.key === transaction.provider
                      )?.img ? (
                        <Image
                          width={24}
                          height={24}
                          src={
                            defaultPaymentOptions.find(
                              (option) => option.key === transaction.provider
                            )?.img || ""
                          }
                          alt={transaction.provider}
                          className="w-8 h-8"
                        />
                      ) : (
                        <span className="text-sm">{transaction.provider}</span>
                      )}
                    </td>
                    <td className="p-2 font-bold text-white/70">
                   {formatCurrency(transaction.amount)}
                  
                    </td>
                    <td className="p-2 text-xs">
                      {transaction.state === "pending" ? (
                        <span className="text-[#F58C7B] bg-[#F58C7B] bg-opacity-20 px-3 py-1 rounded-full">
                          {translations.transactions.status.pending}
                        </span>
                      ) : (
                        <span className="text-[#53B4AB] bg-[#53B4AB] bg-opacity-20 px-3 py-1 rounded-full">
                          {translations.transactions.status.completed}
                        </span>
                      )}
                    </td>
                    <td className="p-2">{transaction.userName}</td>
                    <td className="p-2">{transaction.date}</td>
                    <td className="p-2">
                      <div className="flex gap-2 items-center">
                        <button
                          className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(transaction.id);
                          }}
                          title={(translations.transactions as any)?.action?.viewDetails || "View Details"}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {transaction.state === "pending" && (
                          <span
                            className="text-[#c25443] bg-[#F58C7B] bg-opacity-20 cursor-pointer px-3 py-1 rounded-full text-xs hover:bg-opacity-30 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTransactionId(transaction.id);
                              setShowModal(true);
                            }}
                          >
                            {translations.transactions.action.markAsCompleted}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-4 text-center" colSpan={8}>
                    {translations.transactions.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            lang={lang}
          />
        </div>

        {/* Confirmation Modal */}
        {showModal && (
          <div className="fixed w-full z-20 inset-0 bg-black bg-opacity-70 flex justify-center items-center">
            <div className="bg-neutral-800 p-4 rounded-lg text-white">
              <h2 className="text-lg font-semibold">
                {translations.transactions.confirmModal.title}
              </h2>
              <p className="mt-2">
                {translations.transactions.confirmModal.message}
              </p>
              <div className="mt-4 flex justify-end space-x-2 gap-2">
                <button
                  className="px-4 py-2 bg-gray-500 text-white  rounded-lg text-xs"
                  onClick={() => setShowModal(false)}
                >
                  {translations.transactions.confirmModal.cancel}
                </button>
                <button
                  className="px-4 py-2 bg-[#53B4AB] text-black rounded-lg text-xs"
                  onClick={handleMarkAsCompleted}
                >
                  {translations.transactions.confirmModal.confirm}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Details Modal */}
        {showDetailsModal && selectedTransactionDetails && (
          <div className="fixed w-full z-20 inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4">
            <div className="bg-neutral-800 p-6 rounded-lg text-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {(translations.transactions as any)?.details?.title || "Transaction Details"}
                </h2>
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedTransactionDetails(null);
                  }}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[#53B4AB] border-b border-white/10 pb-2">
                    {(translations.transactions as any)?.details?.sections?.basicInfo || "Basic Information"}
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm block">
                        {(translations.transactions as any)?.details?.fields?.transactionId || "Transaction ID"}
                      </span>
                      <span className="text-white font-mono">
                        {selectedTransactionDetails.transaction_id || "-"}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm block">
                        {(translations.transactions as any)?.details?.fields?.refId || "Reference ID"}
                      </span>
                      <span className="text-white font-mono">
                        {selectedTransactionDetails.ref_id || "-"}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm block">
                        {(translations.transactions as any)?.details?.fields?.mobile || "Mobile Number"}
                      </span>
                      <span className="text-white" style={{ direction: "ltr", textAlign: "left" }}>
                        {selectedTransactionDetails.mobile || "-"}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm block">
                        {(translations.transactions as any)?.details?.fields?.senderName || "Sender Name"}
                      </span>
                      <span className="text-white">
                        {selectedTransactionDetails.sender_name || "-"}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm block">
                        {(translations.transactions as any)?.details?.fields?.paymentOption || "Payment Option"}
                      </span>
                      <div className="flex items-center gap-2">
                        {defaultPaymentOptions.find(
                          (option) => option.key === selectedTransactionDetails.payment_option
                        )?.img ? (
                          <Image
                            width={24}
                            height={24}
                            src={
                              defaultPaymentOptions.find(
                                (option) => option.key === selectedTransactionDetails.payment_option
                              )?.img || ""
                            }
                            alt={selectedTransactionDetails.payment_option || "payment"}
                            className="w-6 h-6"
                          />
                        ) : null}
                        <span className="text-white">
                          {defaultPaymentOptions.find(
                            (option) => option.key === selectedTransactionDetails.payment_option
                          )?.name || selectedTransactionDetails.payment_option || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[#53B4AB] border-b border-white/10 pb-2">
                    {(translations.transactions as any)?.details?.sections?.financialInfo || "Financial Information"}
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm block">
                        {(translations.transactions as any)?.details?.fields?.amount || "Amount"}
                      </span>
                      <span className="text-white font-bold text-lg">
                        {formatCurrency(selectedTransactionDetails.amount)}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm block">
                        {(translations.transactions as any)?.details?.fields?.amountExcludeFees || "Amount (Excluding Fees)"}
                      </span>
                      <span className="text-white">
                        {formatCurrency(selectedTransactionDetails.amount_exclude_fees)}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm block">
                        {(translations.transactions as any)?.details?.fields?.platformFees || "Platform Fees"}
                      </span>
                      <span className="text-white">
                        {formatCurrency(selectedTransactionDetails.platform_fees)}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm block">
                        {(translations.transactions as any)?.details?.fields?.developerFees || "Developer Fees"}
                      </span>
                      <span className="text-white">
                        {formatCurrency(selectedTransactionDetails.developer_fees)}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm block">
                        {(translations.transactions as any)?.details?.fields?.totalFees || "Total Fees"}
                      </span>
                      <span className="text-white">
                        {formatCurrency(selectedTransactionDetails.total_fees)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[#53B4AB] border-b border-white/10 pb-2">
                    {(translations.transactions as any)?.details?.sections?.statusInfo || "Status Information"}
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm block">
                        {(translations.transactions as any)?.details?.status || "Status"}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        selectedTransactionDetails.status === "pending" 
                          ? "text-[#F58C7B] bg-[#F58C7B] bg-opacity-20" 
                          : "text-[#53B4AB] bg-[#53B4AB] bg-opacity-20"
                      }`}>
                        {selectedTransactionDetails.status === "pending" 
                          ? translations.transactions.status.pending 
                          : translations.transactions.status.completed}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm block">
                        {(translations.transactions as any)?.details?.fields?.developerWithdrawalStatus || "Developer Withdrawal Status"}
                      </span>
                      <span className="text-white capitalize">
                        {selectedTransactionDetails.developer_withdrawal_status || "-"}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm block">
                        {(translations.transactions as any)?.details?.fields?.platformWithdrawalStatus || "Platform Withdrawal Status"}
                      </span>
                      <span className="text-white capitalize">
                        {selectedTransactionDetails.platform_withdrawal_status || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User & Application Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[#53B4AB] border-b border-white/10 pb-2">
                    {(translations.transactions as any)?.details?.sections?.userApp || "User & Application"}
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm block">
                        {(translations.transactions as any)?.details?.fields?.userName || "User Name"}
                      </span>
                      <span className="text-white">
                        {selectedTransactionDetails.user?.name || "-"}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm block">
                        {(translations.transactions as any)?.details?.fields?.application || "Application"}
                      </span>
                      <span className="text-white">
                        {selectedTransactionDetails.application?.name || "-"}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm block">
                        {(translations.transactions as any)?.details?.fields?.applicationEmail || "Application Email"}
                      </span>
                      <span className="text-white">
                        {selectedTransactionDetails.application?.email || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="col-span-1 md:col-span-2 space-y-4">
                  <h3 className="text-lg font-medium text-[#53B4AB] border-b border-white/10 pb-2">
                    {(translations.transactions as any)?.details?.sections?.timestamps || "Timestamps"}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-gray-400 text-sm block">
                        {(translations.transactions as any)?.details?.fields?.transactionDate || "Transaction Date"}
                      </span>
                      <span className="text-white">
                        {new Date(selectedTransactionDetails.transaction_date).toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm block">
                        {(translations.transactions as any)?.details?.fields?.createdAt || "Created At"}
                      </span>
                      <span className="text-white">
                        {new Date(selectedTransactionDetails.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm block">
                        {(translations.transactions as any)?.details?.fields?.updatedAt || "Updated At"}
                      </span>
                      <span className="text-white">
                        {new Date(selectedTransactionDetails.updated_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedTransactionDetails(null);
                  }}
                >
                  {(translations.transactions as any)?.details?.close || "Close"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
