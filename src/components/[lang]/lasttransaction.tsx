import { useTranslation } from '@/hooks/useTranslation';
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import getAuthHeaders from "../../app/[lang]/dashboard/Shared/getAuth";
import Table, { TableColumn } from "../Shared/Table";
import Image from "next/image";
import useCurrency from "@/app/[lang]/dashboard/Shared/useCurrency";
import { formatDateTime } from "@/lib/utils";

export interface Transactions {
  id: number;
  transaction_id: string;
  mobile: string;
  payment_option: string;
  amount: number;
  status: string;
  success: boolean;
  result: any;
  created_at?: string;
  date?: string;
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
    return data.result.data.reverse();
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
      <div className="flex items-center justify-center p-6 bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-2xl border border-red-500/20">
        <div className="text-red-400 text-center flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          خطأ: {error?.message}
        </div>
      </div>
    );
  }

  const displayedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: TableColumn<Transactions>[] = [
    { 
      header: translations.transactions.table.id, 
      accessor: "id",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      )
    },
    {
      header: translations.transactions.table.store,
      accessor: "transaction_id",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      header: translations.transactions.table.from,
      accessor: (item: Transactions) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#F58C7B]/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#F58C7B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <span className="text-[#F58C7B] font-medium" style={{
          direction: 'ltr',
          textAlign: 'left',
          display: 'inline-block'
        }}>
          {item.mobile}
        </span>
        </div>
      ),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    {
      header: translations.transactions.table.provider,
      accessor: (item: Transactions) => {
        const option = paymentOptions.find(
          (opt) => opt.key === item.payment_option
        );
        return option ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 p-1.5 flex items-center justify-center border border-white/10">
            <Image
                width={24}
                height={24}
              src={option.img}
              alt={option.name}
                className="w-full h-full object-contain"
            />
            </div>
            <span className="font-medium text-white/90">{option.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <span className="font-medium text-white/60">{item.payment_option}</span>
          </div>
        );
      },
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      header: translations.transactions.table.amount,
      accessor: (item: Transactions) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <span className="font-bold text-green-400 text-lg">
            {formatCurrency(item.amount)}
          </span>
        </div>
      ),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      header: translations.transactions.table.state,
      accessor: (item: Transactions) => (
        <div className="flex justify-end">
          {item.status === "pending" ? (
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
      ),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      header: translations.transactions.table.date,
      accessor: (item: Transactions) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col text-right">
            <span className="font-medium text-white text-sm">
              {formatDateTime(item.date || item.created_at).date}
            </span>
            <span className="text-xs text-amber-400 font-medium">
              {formatDateTime(item.date || item.created_at).time}
        </span>
          </div>
        </div>
      ),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
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
