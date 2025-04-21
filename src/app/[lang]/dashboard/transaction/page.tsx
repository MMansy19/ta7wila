"use client";
import Pagination from "@/components/Shared/Pagination";
import { useTranslation } from "@/context/translation-context";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";
import { Transactions } from "./types";
import { useParams } from "next/navigation";
import useCurrency from "../Shared/useCurrency";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Transaction() {
  const params = useParams();
  const lang = params.lang as string;
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
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
                    className="transition  border-b border-white/10"
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
                      <span
                        className={`px-3 py-1  rounded-full text-xs
                          ${
                            transaction.state === "pending"
                              ? "text-[#c25443] bg-[#F58C7B] bg-opacity-20 cursor-pointer"
                              : ""
                          }`}
                        onClick={() => {
                          if (transaction.state === "pending") {
                            setSelectedTransactionId(transaction.id);
                            setShowModal(true);
                          }
                        }}
                      >
                        {transaction.state === "pending"
                          ? translations.transactions.action.markAsCompleted
                          : "-"}
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

        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            lang={lang}
          />
        </div>

        {/* Modal */}
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
      </div>
    </div>
  );
}
