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
import { formatDateTime } from "@/lib/utils";
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
        date: item.transaction_date,
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

        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-white/90 bg-gradient-to-r from-[#2A2A2A] to-[#1F1F1F] backdrop-blur-sm">
                  <th className="px-4 py-4 text-right font-semibold text-sm tracking-wide border-b border-white/10 first:rounded-tl-xl">
                    <div className="flex items-center justify-end gap-2 min-h-[24px]">
                      <svg className="w-4 h-4 text-[#53B4AB] opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      <span>{translations.transactions.table.id}</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-right font-semibold text-sm tracking-wide border-b border-white/10">
                    <div className="flex items-center justify-end gap-2 min-h-[24px]">
                      <svg className="w-4 h-4 text-[#53B4AB] opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{translations.transactions.table.from}</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-right font-semibold text-sm tracking-wide border-b border-white/10">
                    <div className="flex items-center justify-end gap-2 min-h-[24px]">
                      <svg className="w-4 h-4 text-[#53B4AB] opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span>{translations.transactions.table.provider}</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-right font-semibold text-sm tracking-wide border-b border-white/10">
                    <div className="flex items-center justify-end gap-2 min-h-[24px]">
                      <svg className="w-4 h-4 text-[#53B4AB] opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span>{translations.transactions.table.amount}</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-right font-semibold text-sm tracking-wide border-b border-white/10">
                    <div className="flex items-center justify-end gap-2 min-h-[24px]">
                      <svg className="w-4 h-4 text-[#53B4AB] opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{translations.transactions.table.state}</span>
                    </div>
                </th>
                  <th className="px-4 py-4 text-right font-semibold text-sm tracking-wide border-b border-white/10">
                    <div className="flex items-center justify-end gap-2 min-h-[24px]">
                      <svg className="w-4 h-4 text-[#53B4AB] opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{translations.transactions.table.userName}</span>
                    </div>
                </th>
                  <th className="px-4 py-4 text-right font-semibold text-sm tracking-wide border-b border-white/10">
                    <div className="flex items-center justify-end gap-2 min-h-[24px]">
                      <svg className="w-4 h-4 text-[#53B4AB] opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{translations.transactions.table.date}</span>
                    </div>
                </th>
                  <th className="px-4 py-4 text-right font-semibold text-sm tracking-wide border-b border-white/10 last:rounded-tr-xl">
                    <div className="flex items-center justify-end gap-2 min-h-[24px]">
                      <svg className="w-4 h-4 text-[#53B4AB] opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                      <span>{translations.transactions.table.action}</span>
                    </div>
                </th>
              </tr>
            </thead>
              <tbody className="divide-y divide-white/5">
              {displayedTransactions.length > 0 ? (
                  displayedTransactions.map((transaction, rowIndex) => (
                  <tr
                    key={transaction.id}
                      className={`group transition-all duration-200 hover:bg-gradient-to-r hover:from-[#2A2A2A] hover:to-[#1F1F1F] border-b border-white/5 hover:border-white/10 cursor-pointer ${rowIndex === displayedTransactions.length - 1 ? 'last:rounded-b-xl' : ''}`}
                    onClick={() => handleViewDetails(transaction.id)}
                  >
                      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
                        <div className="flex items-center justify-end">
                          {transaction.id}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#F58C7B]/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-[#F58C7B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <span className="text-[#F58C7B] font-medium" style={{
                          direction: "ltr",
                          textAlign: "left",
                            display: "inline-block"
                          }}>
                        {transaction.from}
                      </span>
                        </div>
                    </td>
                      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
                        <div className="flex items-center justify-end">
                      {defaultPaymentOptions.find(
                        (option) => option.key === transaction.provider
                      )?.img ? (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-white/5 p-1.5 flex items-center justify-center border border-white/10">
                        <Image
                          width={24}
                          height={24}
                          src={
                            defaultPaymentOptions.find(
                              (option) => option.key === transaction.provider
                            )?.img || ""
                          }
                          alt={transaction.provider}
                                  className="w-full h-full object-contain"
                        />
                              </div>
                              <span className="font-medium text-white/90">
                                {defaultPaymentOptions.find(
                                  (option) => option.key === transaction.provider
                                )?.name || transaction.provider}
                              </span>
                            </div>
                      ) : (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                              </div>
                              <span className="font-medium text-white/60">{transaction.provider}</span>
                            </div>
                      )}
                        </div>
                    </td>
                      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <span className="font-bold text-green-400 text-lg">
                   {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                    </td>
                      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
                        <div className="flex justify-end">
                      {transaction.state === "pending" ? (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-[#F58C7B]/20 to-[#F58C7B]/10 px-4 py-2 rounded-full border border-[#F58C7B]/30 backdrop-blur-sm">
                              <div className="w-2 h-2 rounded-full bg-[#F58C7B] animate-pulse"></div>
                              <span className="text-[#F58C7B] font-semibold text-xs">
                          {translations.transactions.status.pending}
                        </span>
                            </div>
                      ) : (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-[#53B4AB]/20 to-[#53B4AB]/10 px-4 py-2 rounded-full border border-[#53B4AB]/30 backdrop-blur-sm">
                              <div className="w-2 h-2 rounded-full bg-[#53B4AB]"></div>
                              <span className="text-[#53B4AB] font-semibold text-xs">
                          {translations.transactions.status.completed}
                        </span>
                            </div>
                      )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
                        <div className="flex items-center justify-end">
                          {transaction.userName}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="font-medium text-white">
                              {formatDateTime(transaction.date).date}
                            </span>
                            <span className="text-xs text-amber-400 font-medium">
                              {formatDateTime(transaction.date).time}
                            </span>
                          </div>
                        </div>
                    </td>
                      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
                        <div className="flex items-center justify-end gap-2">
                        <button
                            className="w-8 h-8 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-200 flex items-center justify-center border border-blue-500/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(transaction.id);
                          }}
                          title={(translations.transactions as any)?.action?.viewDetails || "View Details"}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {transaction.state === "pending" && (
                            <button
                              className="px-3 py-1 bg-gradient-to-r from-[#F58C7B]/20 to-[#F58C7B]/10 text-[#F58C7B] hover:from-[#F58C7B]/30 hover:to-[#F58C7B]/20 rounded-full text-xs font-semibold border border-[#F58C7B]/30 transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTransactionId(transaction.id);
                              setShowModal(true);
                            }}
                          >
                            {translations.transactions.action.markAsCompleted}
                            </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={8} className="text-center py-12 text-white/60">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H6a1 1 0 00-1 1v1m16 0H4"></path>
                          </svg>
                        </div>
                        <span className="text-sm font-medium">{translations.transactions.noData}</span>
                      </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
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
          <div className="fixed w-full z-50 inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
            <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1F1F1F] p-8 rounded-2xl text-white border border-white/10 shadow-2xl max-w-md w-full backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#F58C7B]/20 flex items-center justify-center border border-[#F58C7B]/30">
                  <svg className="w-6 h-6 text-[#F58C7B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                {translations.transactions.confirmModal.title}
              </h2>
                  <p className="text-white/60 text-sm mt-1">تأكيد العملية</p>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                <p className="text-white/80 leading-relaxed">
                {translations.transactions.confirmModal.message}
              </p>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-all duration-200 border border-white/20 hover:border-white/30"
                  onClick={() => setShowModal(false)}
                >
                  {translations.transactions.confirmModal.cancel}
                </button>
                <button
                  className="px-6 py-3 bg-gradient-to-r from-[#53B4AB] to-[#4A9B94] hover:from-[#4A9B94] hover:to-[#408A83] text-black rounded-xl text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                  onClick={handleMarkAsCompleted}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {translations.transactions.confirmModal.confirm}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Details Modal */}
        {showDetailsModal && selectedTransactionDetails && (
          <div className="fixed w-full z-50 inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center p-4 animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-black/95 backdrop-blur-xl rounded-3xl text-white max-w-6xl w-full max-h-[95vh] overflow-y-auto border border-white/20 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
              {/* Header with Gradient Background */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 backdrop-blur-xl border-b border-white/10 p-6 lg:p-8 rounded-t-3xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-cyan-500/30 flex items-center justify-center border border-white/20 shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-white bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        {(translations.transactions as any)?.details?.title || "تفاصيل المعاملة"}
                      </h2>
                      <p className="text-white/70 text-sm lg:text-base mt-1 font-medium">
                        معرف المعاملة: <span className="text-cyan-400 font-mono">{selectedTransactionDetails.transaction_id}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-12 h-12 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-300 flex items-center justify-center border border-red-500/30 hover:border-red-400/50 hover:shadow-lg hover:shadow-red-500/20 group"
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedTransactionDetails(null);
                    }}
                  >
                    <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
              </div>

              {/* Content with Enhanced Layout */}
              <div className="p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* Basic Information */}
                  <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl p-6 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-blue-500/30 shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {(translations.transactions as any)?.details?.sections?.basicInfo || "المعلومات الأساسية"}
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-2">
                          {(translations.transactions as any)?.details?.fields?.transactionId || "معرف المعاملة"}
                        </span>
                        <span className="text-blue-400 font-mono text-sm font-medium bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20 inline-block">
                          {selectedTransactionDetails.transaction_id || "-"}
                        </span>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-2">
                          {(translations.transactions as any)?.details?.fields?.refId || "المعرف المرجعي"}
                        </span>
                        <span className="text-purple-400 font-mono text-sm font-medium bg-purple-500/10 px-3 py-2 rounded-lg border border-purple-500/20 inline-block">
                          {selectedTransactionDetails.ref_id || "-"}
                        </span>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-2">
                          {(translations.transactions as any)?.details?.fields?.mobile || "رقم الهاتف"}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <span className="text-green-400 font-mono text-sm font-medium bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20" style={{ direction: "ltr", textAlign: "left" }}>
                            {selectedTransactionDetails.mobile || "-"}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-2">
                          {(translations.transactions as any)?.details?.fields?.senderName || "اسم المرسل"}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                            <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="text-white font-medium">
                            {selectedTransactionDetails.sender_name || "-"}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-2">
                          {(translations.transactions as any)?.details?.fields?.paymentOption || "طريقة الدفع"}
                        </span>
                        <div className="flex items-center gap-3">
                          {defaultPaymentOptions.find(
                            (option) => option.key === selectedTransactionDetails.payment_option
                          )?.img ? (
                            <div className="w-8 h-8 rounded-lg bg-white/5 p-1 flex items-center justify-center border border-white/10">
                              <Image
                                width={20}
                                height={20}
                                src={
                                  defaultPaymentOptions.find(
                                    (option) => option.key === selectedTransactionDetails.payment_option
                                  )?.img || ""
                                }
                                alt={selectedTransactionDetails.payment_option || "payment"}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                              <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                            </div>
                          )}
                          <span className="text-white font-medium">
                            {defaultPaymentOptions.find(
                              (option) => option.key === selectedTransactionDetails.payment_option
                            )?.name || selectedTransactionDetails.payment_option || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center border border-green-500/30 shadow-lg group-hover:shadow-green-500/20 transition-all duration-300">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        {(translations.transactions as any)?.details?.sections?.financialInfo || "المعلومات المالية"}
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30 shadow-lg">
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-3">
                          {(translations.transactions as any)?.details?.fields?.amount || "المبلغ الإجمالي"}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-green-500/30 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <span className="text-green-300 font-bold text-2xl">
                            {formatCurrency(selectedTransactionDetails.amount)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-2">
                          {(translations.transactions as any)?.details?.fields?.amountExcludeFees || "المبلغ بدون رسوم"}
                        </span>
                        <span className="text-green-300 font-semibold text-lg">
                          {formatCurrency(selectedTransactionDetails.amount_exclude_fees)}
                        </span>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-2">
                          {(translations.transactions as any)?.details?.fields?.platformFees || "رسوم المنصة"}
                        </span>
                        <span className="text-yellow-400 font-semibold">
                          {formatCurrency(selectedTransactionDetails.platform_fees)}
                        </span>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-2">
                          {(translations.transactions as any)?.details?.fields?.developerFees || "رسوم المطور"}
                        </span>
                        <span className="text-orange-400 font-semibold">
                          {formatCurrency(selectedTransactionDetails.developer_fees)}
                        </span>
                      </div>

                      <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-2">
                          {(translations.transactions as any)?.details?.fields?.totalFees || "إجمالي الرسوم"}
                        </span>
                        <span className="text-red-400 font-bold text-lg">
                          {formatCurrency(selectedTransactionDetails.total_fees)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Information */}
                  <div className="bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 rounded-2xl p-6 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/30 to-red-500/30 flex items-center justify-center border border-orange-500/30 shadow-lg group-hover:shadow-orange-500/20 transition-all duration-300">
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                        {(translations.transactions as any)?.details?.sections?.statusInfo || "معلومات الحالة"}
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-3">
                          {(translations.transactions as any)?.details?.status || "الحالة"}
                        </span>
                        <div className="flex items-center gap-2">
                          {selectedTransactionDetails.status === "pending" ? (
                            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 px-4 py-3 rounded-xl border border-orange-500/30 shadow-lg">
                              <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse shadow-lg shadow-orange-400/50"></div>
                              <span className="text-orange-400 font-semibold">
                                {translations.transactions.status.pending}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-4 py-3 rounded-xl border border-green-500/30 shadow-lg">
                              <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
                              <span className="text-green-400 font-semibold">
                                {translations.transactions.status.completed}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-2">
                          {(translations.transactions as any)?.details?.fields?.developerWithdrawalStatus || "حالة سحب المطور"}
                        </span>
                        <span className="text-white font-medium capitalize bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20 inline-block">
                          {selectedTransactionDetails.developer_withdrawal_status || "-"}
                        </span>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-2">
                          {(translations.transactions as any)?.details?.fields?.platformWithdrawalStatus || "حالة سحب المنصة"}
                        </span>
                        <span className="text-white font-medium capitalize bg-purple-500/10 px-3 py-2 rounded-lg border border-purple-500/20 inline-block">
                          {selectedTransactionDetails.platform_withdrawal_status || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* User & Application Information */}
                  <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 rounded-2xl p-6 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center border border-cyan-500/30 shadow-lg group-hover:shadow-cyan-500/20 transition-all duration-300">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        {(translations.transactions as any)?.details?.sections?.userApp || "المستخدم والتطبيق"}
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-2">
                          {(translations.transactions as any)?.details?.fields?.userName || "اسم المستخدم"}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30">
                            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="text-white font-medium">
                            {selectedTransactionDetails.user?.name || "-"}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-2">
                          {(translations.transactions as any)?.details?.fields?.application || "التطبيق"}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30">
                            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-white font-medium">
                            {selectedTransactionDetails.application?.name || "-"}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-2">
                          {(translations.transactions as any)?.details?.fields?.applicationEmail || "بريد التطبيق"}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500/20 to-rose-500/20 flex items-center justify-center border border-pink-500/30">
                            <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-white font-medium font-mono text-sm" style={{ direction: "ltr", textAlign: "left" }}>
                            {selectedTransactionDetails.application?.email || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center border border-amber-500/30 shadow-lg group-hover:shadow-amber-500/20 transition-all duration-300">
                        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                        {(translations.transactions as any)?.details?.sections?.timestamps || "الطوابع الزمنية"}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-3">
                          {(translations.transactions as any)?.details?.fields?.transactionDate || "تاريخ المعاملة"}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-medium text-sm">
                              {new Date(selectedTransactionDetails.transaction_date).toLocaleDateString('ar')}
                            </span>
                            <span className="text-blue-400 text-xs">
                              {new Date(selectedTransactionDetails.transaction_date).toLocaleTimeString('ar')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-3">
                          {(translations.transactions as any)?.details?.fields?.createdAt || "تاريخ الإنشاء"}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center border border-green-500/30">
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-medium text-sm">
                              {new Date(selectedTransactionDetails.created_at).toLocaleDateString('ar')}
                            </span>
                            <span className="text-green-400 text-xs">
                              {new Date(selectedTransactionDetails.created_at).toLocaleTimeString('ar')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-3">
                          {(translations.transactions as any)?.details?.fields?.updatedAt || "تاريخ التحديث"}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-medium text-sm">
                              {new Date(selectedTransactionDetails.updated_at).toLocaleDateString('ar')}
                            </span>
                            <span className="text-purple-400 text-xs">
                              {new Date(selectedTransactionDetails.updated_at).toLocaleTimeString('ar')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-center gap-4">
                  <button
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 flex items-center gap-3 group"
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedTransactionDetails(null);
                    }}
                  >
                    <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {(translations.transactions as any)?.details?.close || "إغلاق"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
