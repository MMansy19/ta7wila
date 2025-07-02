"use client";
import Pagination from "@/components/Shared/Pagination";
import { useTranslation } from '@/hooks/useTranslation';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search, X, Eye, Activity, CheckCircle, Clock, Shield, AlertCircle, DollarSign, CreditCard, CircleDot, Info, User, Settings, BarChart3, Hash, Calendar, XCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";
import useCurrency from "../Shared/useCurrency";
import { formatDateTime } from "@/lib/utils";
import { Transactions, DetailedTransaction } from "../transaction/types";
import { Params } from "./types";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Table({ params }: { params: Params }) {
  const translations = useTranslation();
  const formatCurrency = useCurrency();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterState, setFilterState] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
  const [selectedTransactionDetails, setSelectedTransactionDetails] = useState<DetailedTransaction | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transactions | null>(null);

  const openTransactionModal = (transaction: Transactions) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setShowModal(false);
  };

  const defaultPaymentOptions = [
    { name: "VF- CASH", key: "vcash", img: "/vcash.svg" },
    { name: "Et- CASH", key: "ecash", img: "/ecash.svg" },
    { name: "WE- CASH", key: "wecash", img: "/wecash.svg" },
    { name: "OR- CASH", key: "ocash", img: "/ocash.svg" },
    { name: "INSTAPAY", key: "instapay", img: "/instapay.svg" },
  ];

  const fetchTransactions = async (): Promise<Transactions[]> => {
    const response = await axios.get(`${apiUrl}/transactions?page=${currentPage}`, {
      headers: getAuthHeaders(),
    });

    if (response.data.success && response.data.result && response.data.result.data) {
      // Filter transactions by application ID
      const filteredData = response.data.result.data.filter((item: any) => 
        item.application && item.application.id === parseInt(params.id)
      );

      return filteredData.map((item: any) => ({
        id: item.id,
        transaction_id: item.transaction_id || item.id,
        ref_id: item.ref_id || "-",
        store: item.transaction_id || "-",
        from: item.mobile || "-",
        mobile: item.mobile || "-",
        provider: item.payment_option || "-",
        payment_option: item.payment_option || "-",
        amount: item.amount || 0,
        amount_exclude_fees: item.amount_exclude_fees || 0,
        platform_fees: item.platform_fees || 0,
        developer_fees: item.developer_fees || 0,
        total_fees: item.total_fees || 0,
        state: item.status || "pending",
        status: item.status || "pending",
        transaction: item.transaction_id || "-",
        simNumber: "-",
        userName: item.sender_name || "-",
        sender_name: item.sender_name || "-",
        customer_name: item.sender_name || "-",
        customer_phone: item.mobile || "-",
        date: item.transaction_date || item.created_at,
        transaction_date: item.transaction_date || item.created_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
        application: item.application,
        user: item.user,
        developer_withdrawal_status: item.developer_withdrawal_status || "pending",
        platform_withdrawal_status: item.platform_withdrawal_status || "pending"
      }));
    }

    throw new Error("Error fetching transactions");
  };

  const fetchTransactionDetails = async (transactionId: number): Promise<DetailedTransaction> => {
    const response = await axios.get(
      `${apiUrl}/transactions/${transactionId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (response.data.success && response.data.result) {
      return response.data.result;
    }

    throw new Error("Error fetching transaction details");
  };

  const { data: transactions = [], isLoading, error } = useQuery<Transactions[]>({
    queryKey: ["store-transactions", params.id, currentPage],
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
      } catch (error: unknown) {
        let errorMessage = translations.errors?.developerMode || "Error updating transaction";
        
        if (error && typeof error === 'object' && 'response' in error) {
          const err = error as { 
            response: { 
              data?: { 
                errorMessage?: string;
                message?: string;
                result?: Record<string, string>;
              } | string;
            }
          };

          if (typeof err.response.data === "string") {
            errorMessage = err.response.data;
          } else if (err.response.data?.errorMessage) {
            errorMessage = err.response.data.errorMessage;
          } else if (err.response.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.data?.result) {
            errorMessage = Object.values(err.response.data.result).join(", ");
          }
        }

        toast.error(errorMessage);
      } finally {
        setShowModal(false);
        setSelectedTransactionId(null);
      }
    }
  };

  const handleViewDetails = async (transactionId: number) => {
    try {
      const details = await fetchTransactionDetails(transactionId);
      setSelectedTransactionDetails(details);
      setShowDetailsModal(true);
    } catch (error) {
      let errorMessage = translations.errors?.developerMode || "Error loading transaction details";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { 
          response: { 
            data?: { 
              errorMessage?: string;
              message?: string;
              result?: Record<string, string>;
            } | string;
          }
        };

        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else if (err.response.data?.errorMessage) {
          errorMessage = err.response.data.errorMessage;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data?.result) {
          errorMessage = Object.values(err.response.data.result).join(", ");
        }
      }
      
      toast.error(errorMessage);
    }
  };

  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-gradient-to-br from-neutral-800/40 to-neutral-900/60 backdrop-blur-sm rounded-2xl border border-white/10 p-4 lg:p-6">
      {/* Header with Icon and Description */}
      <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center border border-purple-500/20">
          <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-base lg:text-lg font-bold text-white">المعاملات</h2>
          <p className="text-white/60 text-xs lg:text-sm">تفاصيل جميع المعاملات للمتجر</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-4 lg:mb-6">
        <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-green-500/20">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-green-400" />
            </div>
            <div>
              <p className="text-white/60 text-xs">المكتملة</p>
              <p className="text-white font-semibold text-sm lg:text-lg">{transactions.filter(t => t.state === 'completed').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-yellow-500/20">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400" />
            </div>
            <div>
              <p className="text-white/60 text-xs">قيد الانتظار</p>
              <p className="text-white font-semibold text-sm lg:text-lg">{transactions.filter(t => t.state === 'pending').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-blue-500/20">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <BarChart3 className="w-3 h-3 lg:w-4 lg:h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-white/60 text-xs">الإجمالي</p>
              <p className="text-white font-semibold text-sm lg:text-lg">{transactions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 lg:py-16 text-white/50">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10">
            <Activity className="w-8 h-8 lg:w-10 lg:h-10 text-white/30" />
          </div>
          <h3 className="text-lg lg:text-xl font-semibold text-white/70 mb-2">لا توجد معاملات</h3>
          <p className="text-sm lg:text-base text-center">لم يتم العثور على أي معاملات لهذا المتجر بعد</p>
          </div>
        ) : (
        <div className="bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gradient-to-r from-neutral-800/60 to-neutral-900/60 backdrop-blur-sm border-b border-white/20">
                  <th className="text-right p-2 text-white font-semibold text-xs border-r border-white/10 last:border-r-0">
                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3 text-blue-400" />
                      <span className="hidden sm:inline">رقم المعاملة</span>
                      <span className="sm:hidden">رقم</span>
                    </div>
                  </th>
                  <th className="text-right p-2 text-white font-semibold text-xs border-r border-white/10 last:border-r-0">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-purple-400" />
                      <span className="hidden md:inline">معلومات العميل</span>
                      <span className="md:hidden">العميل</span>
                    </div>
                  </th>
                  <th className="text-right p-2 text-white font-semibold text-xs border-r border-white/10 last:border-r-0 hidden sm:table-cell">
                    <div className="flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-green-400" />
                      <span>طريقة الدفع</span>
                    </div>
                  </th>
                  <th className="text-right p-2 text-white font-semibold text-xs border-r border-white/10 last:border-r-0">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-400" />
                      <span>المبلغ</span>
                    </div>
                  </th>
                  <th className="text-right p-2 text-white font-semibold text-xs border-r border-white/10 last:border-r-0">
                    <div className="flex items-center gap-1">
                      <CircleDot className="w-3 h-3 text-orange-400" />
                      <span>الحالة</span>
                    </div>
                  </th>
                  <th className="text-right p-2 text-white font-semibold text-xs border-r border-white/10 last:border-r-0 hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>التاريخ</span>
                    </div>
                  </th>
                  <th className="text-center p-2 text-white font-semibold text-xs">
                    <div className="flex items-center justify-center gap-1">
                      <Settings className="w-3 h-3 text-cyan-400" />
                      <span className="hidden sm:inline">الإجراءات</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={`
                      ${index % 2 === 0 ? 'bg-black/30' : 'bg-black/20'}
                      hover:bg-black/50 transition-all duration-200 border-b border-white/5 last:border-b-0 group
                    `}
                  >
                    {/* Transaction ID & Reference */}
                    <td className="p-2 border-r border-white/5 last:border-r-0">
                      <div className="flex flex-col gap-1">
                        <span className="text-white font-mono text-xs font-medium">
                          #{transaction.transaction_id || transaction.id}
                        </span>
                        <span className="text-white/60 text-xs hidden sm:block">
                          {transaction.ref_id || "-"}
                        </span>
                      </div>
                    </td>

                    {/* Customer Information */}
                    <td className="p-2 border-r border-white/5 last:border-r-0">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center text-purple-400 text-xs font-bold">
                            {transaction.sender_name?.charAt(0)?.toUpperCase() || "ع"}
                          </div>
                          <span className="text-white font-medium text-xs truncate max-w-[80px]">
                            {transaction.sender_name || "عميل"}
                          </span>
                        </div>
                        <div className="text-xs text-white/60 hidden md:block" style={{ direction: "ltr" }}>
                          {transaction.mobile || "-"}
                        </div>
                      </div>
                    </td>

                    {/* Payment Method - Hidden on small screens */}
                    <td className="p-2 border-r border-white/5 last:border-r-0 hidden sm:table-cell">
                      <div className="flex items-center gap-1">
                        {defaultPaymentOptions.find(option => option.key === transaction.payment_option)?.img ? (
                          <div className="w-6 h-6 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center p-1">
                            <Image
                              width={16}
                              height={16}
                              src={defaultPaymentOptions.find(option => option.key === transaction.payment_option)?.img || ""}
                              alt={transaction.payment_option || "payment"}
                              className="object-contain w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <CreditCard className="w-3 h-3 text-green-400" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-white font-medium text-xs">
                            {defaultPaymentOptions.find(option => option.key === transaction.payment_option)?.name || "غير محدد"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Financial Details */}
                    <td className="p-2 border-r border-white/5 last:border-r-0">
                      <div className="flex flex-col gap-1">
                        <span className="text-emerald-400 font-bold text-xs">
                          {formatCurrency(transaction.amount)}
                        </span>
                        {transaction.total_fees && transaction.total_fees > 0 && (
                          <span className="text-orange-400 font-medium text-xs hidden lg:block">
                            رسوم: {formatCurrency(transaction.total_fees)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-2 border-r border-white/5 last:border-r-0">
                      <div className="flex flex-col gap-1">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border w-fit ${
                          transaction.status === "completed"
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : transaction.status === "pending"
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : transaction.status === "failed"
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }`}>
                          {transaction.status === "completed" && <CheckCircle className="w-2 h-2" />}
                          {transaction.status === "pending" && <Clock className="w-2 h-2" />}
                          {transaction.status === "failed" && <XCircle className="w-2 h-2" />}
                          <span className="hidden sm:inline">
                            {transaction.status === "completed" && "مكتملة"}
                            {transaction.status === "pending" && "انتظار"}
                            {transaction.status === "failed" && "فاشلة"}
                          </span>
                          <span className="sm:hidden">
                            {transaction.status === "completed" && "✓"}
                            {transaction.status === "pending" && "⏳"}
                            {transaction.status === "failed" && "✗"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time - Hidden on small screens */}
                    <td className="p-2 border-r border-white/5 last:border-r-0 hidden lg:table-cell">
                      <div className="flex flex-col gap-1 text-right">
                        <span className="text-white font-medium text-xs">
                          {formatDateTime(transaction.date).date}
                        </span>
                        <span className="text-amber-400 text-xs">
                          {formatDateTime(transaction.date).time}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-2 text-center">
                      <button
                        onClick={() => openTransactionModal(transaction)}
                        className="group/btn inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-white rounded-lg transition-all duration-200 border border-blue-500/20 hover:border-blue-500/40"
                      >
                        <Eye className="w-3 h-3 group-hover/btn:scale-110 transition-transform duration-200" />
                        <span className="text-xs hidden sm:inline">تفاصيل</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-neutral-800/90 to-neutral-900/90 backdrop-blur-xl rounded-2xl w-full max-w-4xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg lg:text-xl text-white">تفاصيل المعاملة</h3>
                  <p className="text-white/60 text-sm">معلومات شاملة عن المعاملة #{selectedTransaction.transaction_id || selectedTransaction.id}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors group"
              >
                <X className="w-4 h-4 text-white/60 group-hover:text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
              {/* Transaction Overview Card */}
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-blue-500/20">
                <h4 className="flex items-center gap-2 text-blue-400 font-semibold mb-3 lg:mb-4">
                  <Info className="w-4 h-4" />
                  نظرة عامة على المعاملة
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <span className="text-white/60 text-xs block mb-1">رقم المعاملة</span>
                    <span className="text-white font-mono font-medium text-sm">#{selectedTransaction.transaction_id || selectedTransaction.id}</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <span className="text-white/60 text-xs block mb-1">المرجع</span>
                    <span className="text-white font-medium text-sm">{selectedTransaction.ref_id || "-"}</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <span className="text-white/60 text-xs block mb-1">الحالة</span>
                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium border ${
                      selectedTransaction.status === "completed"
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : selectedTransaction.status === "pending"
                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {selectedTransaction.status === "completed" && <CheckCircle className="w-3 h-3" />}
                      {selectedTransaction.status === "pending" && <Clock className="w-3 h-3" />}
                      {selectedTransaction.status === "failed" && <XCircle className="w-3 h-3" />}
                      {selectedTransaction.status === "completed" && "مكتملة"}
                      {selectedTransaction.status === "pending" && "قيد الانتظار"}
                      {selectedTransaction.status === "failed" && "فاشلة"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Customer Information */}
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-purple-500/20">
                  <h4 className="flex items-center gap-2 text-purple-400 font-semibold mb-3 lg:mb-4">
                    <User className="w-4 h-4" />
                    معلومات العميل
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center text-purple-400 font-bold">
                        {selectedTransaction.sender_name?.charAt(0)?.toUpperCase() || "ع"}
                      </div>
                    <div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <span className="text-white/60 text-xs block">اسم العميل</span>
                          <span className="text-white font-medium text-sm">{selectedTransaction.sender_name || "غير محدد"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <span className="text-white/60 text-xs block mb-1">رقم الهاتف</span>
                      <span className="text-white font-medium text-sm" style={{ direction: "ltr" }}>
                        {selectedTransaction.mobile || selectedTransaction.customer_phone || "-"}
                      </span>
                    </div>
                    </div>
                  </div>

                {/* Payment Information */}
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-green-500/20">
                  <h4 className="flex items-center gap-2 text-green-400 font-semibold mb-3 lg:mb-4">
                    <CreditCard className="w-4 h-4" />
                    معلومات الدفع
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {defaultPaymentOptions.find(option => option.key === selectedTransaction.payment_option)?.img ? (
                        <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center p-2">
                          <Image
                            width={24}
                            height={24}
                            src={defaultPaymentOptions.find(option => option.key === selectedTransaction.payment_option)?.img || ""}
                            alt={selectedTransaction.payment_option || "payment"}
                            className="object-contain w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-green-400" />
                        </div>
                      )}
                      <div className="bg-white/5 rounded-lg p-2 flex-1">
                        <span className="text-white/60 text-xs block">طريقة الدفع</span>
                        <span className="text-white font-medium text-sm">
                          {defaultPaymentOptions.find(option => option.key === selectedTransaction.payment_option)?.name || selectedTransaction.payment_option || "غير محدد"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                    </div>

              {/* Financial Details */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-emerald-500/20">
                <h4 className="flex items-center gap-2 text-emerald-400 font-semibold mb-3 lg:mb-4">
                  <DollarSign className="w-4 h-4" />
                  التفاصيل المالية
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 lg:gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <span className="text-white/60 text-xs block mb-1">المبلغ الإجمالي</span>
                    <span className="text-emerald-400 font-bold text-lg">{formatCurrency(selectedTransaction.amount)}</span>
                  </div>
                  {selectedTransaction.total_fees && selectedTransaction.total_fees > 0 && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <span className="text-white/60 text-xs block mb-1">إجمالي الرسوم</span>
                      <span className="text-orange-400 font-bold text-sm">{formatCurrency(selectedTransaction.total_fees)}</span>
                    </div>
                  )}
                  {selectedTransaction.amount_exclude_fees && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <span className="text-white/60 text-xs block mb-1">المبلغ الصافي</span>
                      <span className="text-green-400 font-bold text-sm">{formatCurrency(selectedTransaction.amount_exclude_fees)}</span>
                    </div>
                  )}
                  {selectedTransaction.platform_fees && selectedTransaction.platform_fees > 0 && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <span className="text-white/60 text-xs block mb-1">رسوم المنصة</span>
                      <span className="text-amber-400 font-medium text-sm">{formatCurrency(selectedTransaction.platform_fees)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Withdrawal Information */}
              {selectedTransaction.status === "completed" && (
                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-orange-500/20">
                  <h4 className="flex items-center gap-2 text-orange-400 font-semibold mb-3 lg:mb-4">
                    <CircleDot className="w-4 h-4" />
                    حالة السحب
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                    <div className="bg-white/5 rounded-lg p-3">
                      <span className="text-white/60 text-xs block mb-2">حالة سحب المطور</span>
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                        selectedTransaction.developer_withdrawal_status === "completed"
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {selectedTransaction.developer_withdrawal_status === "completed" ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            تم السحب
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            معلق
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <span className="text-white/60 text-xs block mb-2">حالة سحب المنصة</span>
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                        selectedTransaction.platform_withdrawal_status === "completed"
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {selectedTransaction.platform_withdrawal_status === "completed" ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            تم السحب
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            معلق
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-amber-500/20">
                <h4 className="flex items-center gap-2 text-amber-400 font-semibold mb-3 lg:mb-4">
                  <Calendar className="w-4 h-4" />
                  التواريخ والأوقات
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <span className="text-white/60 text-xs block mb-1">تاريخ الإنشاء</span>
                    <div className="flex flex-col">
                      <span className="text-white font-medium text-sm">{formatDateTime(selectedTransaction.date).date}</span>
                      <span className="text-amber-400 text-xs">{formatDateTime(selectedTransaction.date).time}</span>
                    </div>
                  </div>
                                     {selectedTransaction.updated_at && selectedTransaction.updated_at !== selectedTransaction.created_at && (
                     <div className="bg-white/5 rounded-lg p-3">
                       <span className="text-white/60 text-xs block mb-1">آخر تحديث</span>
                       <div className="flex flex-col">
                         <span className="text-white font-medium text-sm">{formatDateTime(selectedTransaction.updated_at || selectedTransaction.date).date}</span>
                         <span className="text-amber-400 text-xs">{formatDateTime(selectedTransaction.updated_at || selectedTransaction.date).time}</span>
                    </div>
                     </div>
                   )}
                  </div>
                </div>
              </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 lg:p-6 border-t border-white/10">
                <button
                onClick={closeModal}
                className="px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-neutral-600 to-neutral-700 hover:from-neutral-700 hover:to-neutral-800 text-white rounded-xl font-medium transition-all duration-200"
              >
                إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}