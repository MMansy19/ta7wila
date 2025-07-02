"use client";
import { useTranslation } from '@/hooks/useTranslation';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";
import useCurrency from "../Shared/useCurrency";
export const dynamic = 'force-dynamic';

type Checkout = {
  id: number;
  ref_id: string;
  amount: number;
  status: string;
  paid_at: string | null;
};

const Checkout: React.FC = () => {
  const translations = useTranslation();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const formatCurrency = useCurrency();

  const fetchCheckouts = async (currentPage: number): Promise<Checkout[]> => {
    const response = await axios.get(`${apiUrl}/checkouts?page=${currentPage}`, {
      headers: getAuthHeaders(),
    });
    return response.data.result.data || [];
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const {
    data: checkouts,
    error,
    refetch,
  } = useQuery<Checkout[], Error>({
    queryKey: ["checkouts", currentPage],
    queryFn: ({ queryKey }) => fetchCheckouts(queryKey[1] as number),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  if (error) {
    toast.error(translations.invoice.errorLoading);
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <p>{translations.invoice.errorLoading}</p>
        <button
          className="mt-4 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => refetch()}
        >
          {translations.price.loading}
        </button>
      </div>
    );
  }

  if (!Array.isArray(checkouts)) {
    return <div>{translations.invoice.unexpectedFormat}</div>;
  }

  return (
    <div className="grid">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col overflow-hidden px-8 py-6 w-full bg-neutral-900 rounded-lg max-md:max-w-full text-white min-h-[calc(100vh-73px)]">
        <h2 className="text-2xl font-semibold mb-4">{translations.sidebar.checkout}</h2>
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="overflow-x-auto">
            <table className="w-full" aria-label="Checkout Details">
            <thead>
                <tr className="text-white/90 bg-gradient-to-r from-[#2A2A2A] to-[#1F1F1F] backdrop-blur-sm">
                  <th className="px-4 py-4 text-right font-semibold text-sm tracking-wide border-b border-white/10 first:rounded-tl-xl">
                    <div className="flex items-center justify-end gap-2 min-h-[24px]">
                      <svg className="w-4 h-4 text-[#53B4AB] opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      <span>{translations.table.id}</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-right font-semibold text-sm tracking-wide border-b border-white/10">
                    <div className="flex items-center justify-end gap-2 min-h-[24px]">
                      <svg className="w-4 h-4 text-[#53B4AB] opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{translations.paymentVerification.modal.transactionDetails.transactionId}</span>
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
                      <span>{translations.subscription.modal.status}</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-right font-semibold text-sm tracking-wide border-b border-white/10">
                    <div className="flex items-center justify-end gap-2 min-h-[24px]">
                      <svg className="w-4 h-4 text-[#53B4AB] opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{translations.invoice.paidAt}</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-right font-semibold text-sm tracking-wide border-b border-white/10 last:rounded-tr-xl">
                    <div className="flex items-center justify-end gap-2 min-h-[24px]">
                      <svg className="w-4 h-4 text-[#53B4AB] opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                      <span>{translations.storepayment.table.actions}</span>
                    </div>
                  </th>
              </tr>
            </thead>
              <tbody className="divide-y divide-white/5">
              {checkouts.length > 0 ? (
                  checkouts.map((checkout, rowIndex) => (
                    <tr key={checkout.id} className={`group transition-all duration-200 hover:bg-gradient-to-r hover:from-[#2A2A2A] hover:to-[#1F1F1F] border-b border-white/5 hover:border-white/10 ${rowIndex === checkouts.length - 1 ? 'last:rounded-b-xl' : ''}`}>
                      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
                        <div className="flex items-center justify-end">
                          {checkout.id}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className="font-medium text-blue-400">{checkout.ref_id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <span className="font-bold text-green-400">
                            {formatCurrency(checkout.amount)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
                        <div className="flex justify-end">
                          {checkout.status === "completed" ? (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-[#53B4AB]/20 to-[#53B4AB]/10 px-4 py-2 rounded-full border border-[#53B4AB]/30 backdrop-blur-sm">
                              <div className="w-2 h-2 rounded-full bg-[#53B4AB]"></div>
                              <span className="text-[#53B4AB] font-semibold text-xs">
                                {checkout.status}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-[#F58C7B]/20 to-[#F58C7B]/10 px-4 py-2 rounded-full border border-[#F58C7B]/30 backdrop-blur-sm">
                              <div className="w-2 h-2 rounded-full bg-[#F58C7B]"></div>
                              <span className="text-[#F58C7B] font-semibold text-xs">
                                {checkout.status}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                                                      <div className="flex flex-col text-right">
                              <span className="font-medium text-white text-sm">
                                {checkout.paid_at ? new Date(checkout.paid_at).toLocaleDateString('ar-EG') : 'غير متاح'}
                              </span>
                              {checkout.paid_at && (
                                <span className="text-xs text-amber-400 font-medium">
                                  {new Date(checkout.paid_at).toLocaleTimeString('ar-EG', { 
                                    hour: '2-digit', 
                                    minute: '2-digit',
                                    hour12: true 
                                  })}
                                </span>
                              )}
                            </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
                        <div className="flex items-center justify-end">
                      <Link href={`/dashboard/checkoutDetails/${checkout.id}`}>
                        <button
                              className="px-4 py-2 bg-gradient-to-r from-[#53B4AB]/20 to-[#53B4AB]/10 text-[#53B4AB] hover:from-[#53B4AB]/30 hover:to-[#53B4AB]/20 rounded-lg text-xs font-semibold border border-[#53B4AB]/30 transition-all duration-200 flex items-center gap-2"
                          aria-label={`${translations.subscription.table.view} ${translations.storepayment.table.id} ${checkout.id}`}
                        >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                          {translations.subscription.table.view}
                        </button>
                      </Link>
                        </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={6} className="text-center py-12 text-white/60">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">{translations.storepayment.noData}</span>
                      </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>

        <div className="flex justify-end mt-auto">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label={translations.pagination.previous}
            className={`mx-1 rounded-full w-11 h-11 flex justify-center items-center ${
              currentPage === 1 ? "bg-[#53B4AB] cursor-not-allowed" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 17.772L9 12.772L14 7.77197"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <span className="px-2 py-3">{`${translations.pagination.page} ${currentPage} ${translations.pagination.of} ${totalPages}`}</span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`mx-1 rounded-full w-11 h-11 flex justify-center items-center ${
              currentPage === totalPages ? "bg-[#53B4AB] cursor-not-allowed" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 17.772L15 12.772L10 7.77197" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

