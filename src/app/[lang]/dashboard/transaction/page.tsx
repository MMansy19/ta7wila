"use client";
import Pagination from "@/components/[lang]/pagination";
import { useTranslation } from "@/context/translation-context";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";
import { Transactions } from "./types";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Transaction() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
  const [filterState, setFilterState] = useState<string>("All");
  const translations = useTranslation();

  const fetchTransactions = async (): Promise<Transactions[]> => {
    const response = await axios.get(`${apiUrl}/transactions?page=${currentPage}`, {
      headers: getAuthHeaders(),
    });
  
    if (response.data.success && response.data.result && response.data.result.data) {
      return response.data.result.data.reverse().map((item: any) => ({
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

  const handleMarkAsCompleted = async () => {
    if (selectedTransactionId) {
      try {
        await axios.post(
          `${apiUrl}/transactions/mark-as-completed/${selectedTransactionId}`,
          {},
          { headers: getAuthHeaders() }
        );
        
        toast.success("Transaction marked as completed!");
      } catch (error) {
        toast.success("Already marked as completed.");
      } finally {
        setShowModal(false);
        setSelectedTransactionId(null);
      }
    }
  };

  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid">
      <div className="flex overflow-hidden flex-col px-8 py-6 w-full bg-neutral-900 rounded-[18px] max-md:max-w-full text-white min-h-[calc(100vh-73px)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{translations.transactions.title}</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead className="text-white">
              <tr>
                <th className="p-2">{translations.transactions.table.id}</th>
                <th className="p-2">{translations.transactions.table.from}</th>
                <th className="p-2">{translations.transactions.table.provider}</th>
                <th className="p-2">{translations.transactions.table.amount}</th>
                <th className="p-2">{translations.transactions.table.state}</th>
                <th className="p-2">{translations.transactions.table.userName}</th>
                <th className="p-2">{translations.transactions.table.date}</th>
                <th className="p-2">{translations.transactions.table.action}</th>
              </tr>
            </thead>
            <tbody>
              {displayedTransactions.length > 0 ? (
                displayedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="transition rounded-lg border-b border-white/10">
                    <td className="p-2">{transaction.id}</td>
                    <td className="p-2 text-[#F58C7B]">{transaction.from}</td>
                    <td className="p-2">{transaction.provider}</td>
                    <td className="p-2 font-bold text-[#53B4AB]">{transaction.amount}</td>
                    <td className="p-2">
                      {transaction.state === "pending" ? (
                        <span className="text-[#F58C7B]">{translations.transactions.status.pending}</span>
                      ) : (
                        <span className="text-[#53B4AB]">{translations.transactions.status.completed}</span>
                      )}
                    </td>
                    <td className="p-2">{transaction.userName}</td>
                    <td className="p-2">{transaction.date}</td>
                    <td className="p-2">
                      <span
                        className={`px-3 py-1 min-h-[30px] rounded-[12px] w-[62px] text-sm 
                          ${transaction.state === "pending"
                            ? "text-[#F58C7B] bg-[#F58C7B] bg-opacity-50 cursor-pointer"
                            : "text-[#53B4AB] bg-[#0FDBC8] bg-opacity-30 cursor-not-allowed"}`}
                        onClick={() => {
                          if (transaction.state === "pending") {
                            setSelectedTransactionId(transaction.id);
                            setShowModal(true);
                          }
                        }}
                      >
                        {transaction.state === "pending" 
                          ? translations.transactions.action.markAsCompleted 
                          : translations.transactions.action.completed}
                      </span>
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

        <div className="mt-auto flex">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChangeClient={handlePageChange}
          />
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed w-full z-20 inset-0 bg-black bg-opacity-70 flex justify-center items-center">
            <div className="bg-neutral-800 p-4 rounded-lg text-white">
              <h2 className="text-lg font-semibold">{translations.transactions.confirmModal.title}</h2>
              <p className="mt-2">{translations.transactions.confirmModal.message}</p>
              <div className="mt-4 flex justify-end space-x-2">
                <button 
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm" 
                  onClick={() => setShowModal(false)}
                >
                  {translations.transactions.confirmModal.cancel}
                </button>
                <button 
                  className="px-4 py-2 bg-[#53B4AB] text-black rounded-lg text-sm" 
                  onClick={handleMarkAsCompleted}
                >
                  {translations.transactions.confirmModal.confirm}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
