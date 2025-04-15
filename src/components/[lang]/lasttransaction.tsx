"use client"
import { useTranslation } from "@/context/translation-context";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import getAuthHeaders from "../../app/[lang]/dashboard/Shared/getAuth";
import Table, { TableColumn } from "../Shared/Table";

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
  const itemsPerPage = 7;
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

  const columns: TableColumn<Transactions>[] = [
    { header: translations.transactions.table.id, accessor: "id" },
    { header: translations.transactions.table.store, accessor: "transaction_id" },
    { 
      header: translations.transactions.table.from, 
      accessor: "mobile",
      className: "text-[#F58C7B]"
    },
    { header: translations.transactions.table.provider, accessor: "payment_option" },
    { 
      header: translations.transactions.table.amount, 
      accessor: "amount",
      className: "font-bold"
    },
    { 
      header: translations.transactions.table.state, 
      accessor: (item: Transactions) => (
        <span
          className={`px-3 py-1.5 rounded-full text-xs ${
            item.status === "pending"
              ? "text-[#F58C7B] bg-[#F58C7B] bg-opacity-20"
              : "text-[#53B4AB] bg-[#0FDBC8] bg-opacity-20"
          }`}
        >
          {item.status}
        </span>
      )
    },
  ];

  return (
    <Table
      data={displayedTransactions}
      columns={columns}
      title={translations.transactions.lastTransactions}
      emptyMessage={translations.transactions.noTransactions}
    />
  );
}