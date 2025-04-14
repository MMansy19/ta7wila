"use client"
import { useTranslation } from "@/context/translation-context";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import getAuthHeaders from "../../app/[lang]/dashboard/Shared/getAuth";

export interface Transactions {
  id: number;
  transaction_id: string;
  mobile: string;
  payment_option: string;
  amount: number;
  status: string;
  success: boolean;
  result: any;
}

export default function LastTranaction() {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const translations = useTranslation();

  async function getTransaction() {
    const response = await fetch(`${apiUrl}/transactions?page=1`, {
      headers: getAuthHeaders(),
    });
    const data: Transactions = await response.json();
    return data.result.data;
  }
  const { data: transactions = [], isError, error } = useQuery({
    queryKey: ["transaction"],
    queryFn: getTransaction,
  });
  if (isError) {
    return <div className="text-red-500 text-center">Error: {error?.message}</div>;
  }
  const displayedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className="grid">
      <div className="flex overflow-hidden flex-col px-4 py-3 w-full bg-[#1F1F1F] rounded-[18px] max-md:max-w-full min-h-80">
        <h2 className="text-2xl px-2 py-2 font-bold mb-2">{translations.transactions.lastTransactions}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="text-white bg-[#161616]">
                <th className="p-2">{translations.transactions.table.id}</th>
                <th className="p-2">{translations.transactions.table.store}</th>
                <th className="p-2">{translations.transactions.table.from}</th>
                <th className="p-2">{translations.transactions.table.provider}</th>
                <th className="p-2">{translations.transactions.table.amount}</th>
                <th className="p-2">{translations.transactions.table.state}</th>
              </tr>
            </thead>
            <tbody>
              {displayedTransactions.length > 0 ? (
                displayedTransactions.map((transaction: Transactions, index: number) => (
                  <tr key={transaction.id} className="transition rounded-lg">
                    <td className="p-2">{transaction.id}</td>
                    <td className="p-2">{transaction.transaction_id || "-"}</td>
                    <td className="p-2 text-[#F58C7B]">{transaction.mobile || "-"}</td>
                    <td className="p-2">{transaction.payment_option || "-"}</td>
                    <td className="p-2 font-bold">{transaction.amount || "-"}</td>
                    <td className="p-2">
                      <span
                        className={`px-3 py-2 min-h-[30px] rounded-[16px] w-[62px] text-sm ${transaction.status === "pending"
                          ? "text-[#F58C7B] bg-[#F58C7B] bg-opacity-50"
                          : "text-[#53B4AB] bg-[#0FDBC8] bg-opacity-30"
                          }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-2">{translations.transactions.noTransactions}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}