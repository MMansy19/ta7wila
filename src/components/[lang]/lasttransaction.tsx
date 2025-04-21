import { useTranslation } from "@/context/translation-context";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import getAuthHeaders from "../../app/[lang]/dashboard/Shared/getAuth";
import Table, { TableColumn } from "../Shared/Table";
import Image from "next/image";
import useCurrency from "@/app/[lang]/dashboard/Shared/useCurrency";

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

// Payment options configuration moved to component scope
const paymentOptions = [
  { name: "VF- CASH", key: "vcash", img: "/vcash.svg" },
  { name: "Et- CASH", key: "ecash", img: "/ecash.svg" },
  { name: "WE- CASH", key: "wecash", img: "/wecash.svg" },
  { name: "OR- CASH", key: "ocash", img: "/ocash.svg" },
  { name: "INSTAPAY", key: "instapay", img: "/instapay.svg" },
];

export default function LastTranaction() {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const translations = useTranslation();
  const formatCurrency = useCurrency();

  async function getTransaction() {
    const response = await fetch(`${apiUrl}/transactions?page=1`, {
      headers: getAuthHeaders(),
    });
    const data: Transactions = await response.json();
    return data.result.data;
  }

  const {
    data: transactions = [],
    isError,
    error,
  } = useQuery({
    queryKey: ["transaction"],
    queryFn: getTransaction,
  });

  if (isError) {
    return (
      <div className="text-red-500 text-center">Error: {error?.message}</div>
    );
  }

  const displayedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: TableColumn<Transactions>[] = [
    { header: translations.transactions.table.id, accessor: "id" },
    {
      header: translations.transactions.table.store,
      accessor: "transaction_id",
    },
    {
      header: translations.transactions.table.from,
      accessor: (item: Transactions) => (
        <span style={{
          direction: 'ltr',
          textAlign: 'left',
          display: 'inline-block'
        }}>
          {item.mobile}
        </span>
      ),
      className: "text-[#F58C7B]",
    },
    {
      header: translations.transactions.table.provider,
      accessor: (item: Transactions) => {
        const option = paymentOptions.find(
          (opt) => opt.key === item.payment_option
        );
        return option ? (
          <div className="flex items-center gap-2">
            <Image
              width={20}
              height={20}
              src={option.img}
              alt={option.name}
              className="w-8 h-8 object-contain"
            />
            <span>{option.name}</span>
          </div>
        ) : (
          item.payment_option
        );
      },
    },
    {
      header: translations.transactions.table.amount,
      accessor: (item: Transactions) =>
        ` ${formatCurrency(item.amount)}`,
      className: "font-bold",
    },
    {
      header: translations.transactions.table.state,
      accessor: (item: Transactions) => (
        <span className="text-xs">
          {item.status === "pending" ? (
            <span className="text-[#F58C7B] bg-[#F58C7B] bg-opacity-20 px-3 py-1 rounded-full">
              {translations.transactions.status.pending}
            </span>
          ) : (
            <span className="text-[#53B4AB] bg-[#53B4AB] bg-opacity-20 px-3 py-1 rounded-full">
              {translations.transactions.status.completed}
            </span>
          )} 
        </span>
      ),
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
