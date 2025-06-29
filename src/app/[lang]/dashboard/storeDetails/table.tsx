"use client";
import Pagination from "@/components/Shared/Pagination";
import { useTranslation } from '@/hooks/useTranslation';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import getAuthHeaders from "../Shared/getAuth";
import { Params } from "./types";
import useCurrency from "../Shared/useCurrency";

export interface Transactions {
  id: number;
  store: string;
  from: string;
  provider: string;
  amount: number;
  state: string;
  transaction: string;
  simNumber: string;
  userName: string;
  date: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Table({ params }: { params: Params }) {
  const translations = useTranslation();
  const formatCurrency = useCurrency();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterState, setFilterState] = useState<string>("All");

  const fetchTransactions = async (): Promise<Transactions[]> => {
    const response = await axios.get(`${apiUrl}/transactions?application_id=24?page=${currentPage}`, {
      headers: getAuthHeaders(),
    });

    if (response.data.success && response.data.result && response.data.result.data) {
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

  const { data: transactions = [], isLoading, error } = useQuery<Transactions[]>({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });

  const filteredTransactions =
    filterState === "All"
      ? transactions
      : transactions.filter((t: Transactions) => t.state === filterState);

  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const displayedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid">
      <div className="flex overflow-hidden flex-col px-8 py-6 w-full bg-neutral-900 rounded-[18px] max-md:max-w-full text-white min-h-[calc(100vh-73px)]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">{translations.storeDetails.title}</h1>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead className="text-white text-sm">
              <tr>
                <th className="p-2">{translations.storeDetails.table.id}</th>
                <th className="p-2">{translations.storeDetails.table.from}</th>
                <th className="p-2">{translations.storeDetails.table.provider}</th>
                <th className="p-2">{translations.storeDetails.table.amount}</th>
                <th className="p-2">{translations.storeDetails.table.state}</th>
                <th className="p-2">{translations.storeDetails.table.userName}</th>
                <th className="p-2">{translations.storeDetails.table.date}</th>
              </tr>
            </thead>
            <tbody>
              {displayedTransactions.length > 0 ? (
                displayedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="transition text-start border-b border-white/10 py-2">
                    <td className="p-2">{transaction.id}</td>
                    <td className="p-2 text-[#F58C7B]">{transaction.from}</td>
                    <td className="p-2">{transaction.provider}</td>
                    <td className="p-2 font-bold text-[#53B4AB]">{formatCurrency(transaction.amount)}</td>
                    <td className="p-2">
                      {transaction.state === "pending" ? (
                        <span className="text-[#F58C7B]">{translations.transactions.status.pending}</span>
                      ) : (
                        <span className="text-[#53B4AB]">{translations.transactions.status.completed}</span>
                      )}
                    </td>
                    <td className="p-2">{transaction.userName}</td>
                    <td className="p-2">{transaction.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-4 text-center" colSpan={8}>
                    {translations.transactions.noTransactions}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-auto flex">
       <Pagination 
       currentPage={currentPage}
       totalPages={totalPages}
       onPageChange={handlePageChange}  
       lang={params.lang}
       />
        </div>
      </div>
    </div>
  );
}