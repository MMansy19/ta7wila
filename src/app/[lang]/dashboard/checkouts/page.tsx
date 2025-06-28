"use client";
import { useTranslation } from '@/hooks/useTranslation';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";
import useCurrency from "../Shared/useCurrency";

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
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left" aria-label="Checkout Details">
            <thead>
              <tr className="text-white text-start">
                <th className="p-2">{translations.table.id}</th>
                <th className="p-2">{translations.paymentVerification.modal.transactionDetails.transactionId}</th>
                <th className="p-2">{translations.transactions.table.amount}</th>
                <th className="p-2">{translations.subscription.modal.status}</th>
                <th className="p-2">{translations.invoice.paidAt}</th>
                <th className="p-2">{translations.storepayment.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {checkouts.length > 0 ? (
                checkouts.map((checkout) => (
                  <tr key={checkout.id} className="text-start">
                    <td className="p-2">{checkout.id}</td>
                    <td className="p-2">{checkout.ref_id}</td>
                    <td className="p-2">{formatCurrency(checkout.amount)}</td>
                    <td className="p-2">{checkout.status}</td>
                    <td className="p-2">{new Date(checkout.paid_at || "N/A").toLocaleDateString()}</td>
                    <td className="p-2">
                      <Link href={`/dashboard/checkoutDetails/${checkout.id}`}>
                        <button
                          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-[12px]"
                          aria-label={`${translations.subscription.table.view} ${translations.storepayment.table.id} ${checkout.id}`}
                        >
                          {translations.subscription.table.view}
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    {translations.storepayment.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

