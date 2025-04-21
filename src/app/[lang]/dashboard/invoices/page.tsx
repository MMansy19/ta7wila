"use client"
import { useTranslation } from "@/context/translation-context";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";
import { Invoice } from "./types";
import useCurrency from "../Shared/useCurrency";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Invoices() {
  const translations = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const formatCurrency = useCurrency();

  const fetchInvoices = async (): Promise<Invoice[]> => {
    const response = await axios.get(`${apiUrl}/invoices?page=${currentPage}`, { headers: getAuthHeaders() });
    return response.data.result.data || [];
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const {
    data: invoices,
    error,
    isLoading,
  } = useQuery<Invoice[], Error>({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div>{translations.price.loading}</div>;

  if (error) {
    toast.error(translations.invoice.errorLoading);
    return <div>{translations.invoice.errorLoading}</div>;
  }
  if (!Array.isArray(invoices)) {
    toast.error(translations.invoice.invalidFormat);
    return <div>{translations.invoice.unexpectedFormat}</div>;
  }

  return (
    <div className="grid">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col overflow-hidden px-8 py-6 w-full bg-neutral-900 rounded-lg max-md:max-w-full text-white min-h-[calc(100vh-73px)]">
        <h1 className="text-2xl font-semibold mb-4">{translations.sidebar.invoices}</h1>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left">
            <thead>
              <tr className="bg-gray-800 text-gray-200 text-start">
                <th className="p-2">{translations.table.id}</th>
                <th className="p-2">{translations.invoice.totalAmount}</th>
                <th className="p-2">{translations.invoice.totalFees}</th>
                <th className="p-2">{translations.invoice.lateFees}</th>
                <th className="p-2">{translations.invoice.developerFees}</th>
                <th className="p-2">{translations.invoice.paidAt}</th>
                <th className="p-2">{translations.stores.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="text-start border-b border-white/10 px-2 py-4">
                    <td className="p-2">{invoice.id}</td>
                    <td className="p-2">{formatCurrency(invoice.total_amount)}</td>
                    <td className="p-2">{formatCurrency(invoice.total_fees)} </td>
                    <td className="p-2">{formatCurrency(invoice.late_fees )} </td>
                    <td className="p-2">{formatCurrency(invoice.developer_fees)}</td>
                    <td className="p-2">{new Date(invoice.paid_at).toLocaleDateString()}</td>
                    <td className="p-2">
                      <Link href={`/dashboard/invoicesDetails/${invoice.id}`}>
                        <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-[12px]">
                          {translations.invoice.preview}
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-9">
                    {translations.invoice.noInvoices}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
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
              style={{ transform: translations.dir === 'rtl' ? 'rotate(180deg)' : 'none' }}
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
            <svg 
              width="24" 
              height="25" 
              viewBox="0 0 24 25" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ transform: translations.dir === 'rtl' ? 'rotate(180deg)' : 'none' }}
            >
              <path
                d="M10 17.772L15 12.772L10 7.77197"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};



