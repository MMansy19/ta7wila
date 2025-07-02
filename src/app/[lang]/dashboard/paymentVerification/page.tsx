"use client";

import Pagination from "@/components/Shared/Pagination";
import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";
import PaymentsTable from "./PaymentsTable";
import TransactionModal from "./TransactionModal";
import { PaymentData, PaymentOption } from "./types";
export const dynamic = 'force-dynamic';

export default function UserPermissions() {
  const params = useParams();
  const lang = params.lang as string;
  const [PaymentDatas, setPaymentDatas] = useState<PaymentData[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stores, setStores] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [selectedPaymentData, setSelectedPaymentData] =
    useState<PaymentData | null>(null);
  const [isModalOpenadd, setIsModalOpenadd] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] =
    useState<string>("");
  const [paymentOption, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const translations = useTranslation();

  const paymentOptions: PaymentOption[] = [
    { id: "1", name: "VF- CASH", key: "vcash", value: "vcash", img: "/vcash.svg" },
    { id: "2", name: "Et- CASH", key: "ecash", value: "ecash", img: "/ecash.svg" },
    { id: "3", name: "WE- CASH", key: "wecash", value: "wecash", img: "/wecash.svg" },
    { id: "4", name: "OR- CASH", key: "ocash", value: "ocash", img: "/ocash.svg" },
    { id: "5", name: "INSTAPAY", key: "instapay", value: "instapay", img: "/instapay.svg" },
  ];



  const itemsPerPage = 10;
  
  // Filter payment data based on search query
  const filteredPaymentDatas = PaymentDatas.filter((payment) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      payment.ref_id?.toLowerCase().includes(searchLower) ||
      payment.user?.name?.toLowerCase().includes(searchLower) ||
      payment.user?.mobile?.toLowerCase().includes(searchLower) ||
      payment.user?.email?.toLowerCase().includes(searchLower) ||
      payment.application?.name?.toLowerCase().includes(searchLower) ||
      payment.status?.toLowerCase().includes(searchLower)||
      payment.payment_option?.toLowerCase().includes(searchLower)
    );
  });

  const displayedPaymentDatas = filteredPaymentDatas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (page: number) => setCurrentPage(page);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const dropdownRef = useRef<HTMLDivElement>(null);


  const openModal2 = () => {
    setIsModalOpenadd(true);
  };

  const closeModal2 = () => {
    setIsModalOpenadd(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPaymentDatas = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/verifications?page=${currentPage}`,
        { headers: getAuthHeaders() }
      );
      const data = response.data.result.data;
      const transformedPaymentDatas: PaymentData[] = data.map(
        (item: any) => ({
          id: item.id,
          ref_id: item.ref_id,
          value: item.value,
          payment_option: item.payment_option,
          status: item.status,
          created_at: item.created_at,
          updated_at: item.updated_at,
          user_id: item.user_id,
          payment_id: item.payment_id,
          transaction_id: item.transaction_id,
          application_id: item.application_id,
          transaction: item.transaction,
          user: {
            name: item.user?.name || "Unknown",
            mobile: item.user?.mobile || "N/A",
            email: item.user?.email || "N/A",
          },
          application: {
            id: item.application?.id || 0,
            name: item.application?.name || "Unknown",
            logo: item.application?.logo || "",
            email: item.application?.email || "N/A",
          },
        })
      );
      setPaymentDatas(transformedPaymentDatas.reverse());
      setTotalPages(response.data.result.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch PaymentDatas");
      toast.error("Failed to fetch PaymentDatas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(`${apiUrl}/applications`, {
          headers: getAuthHeaders(),
        });
        const data = response.data.result.data;
        const transformedStores = data.map((item: any) => ({
          id: item.id,
          name: item.name,
        }));

        setStores(transformedStores);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch stores");
        toast.error("Failed to fetch stores");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [apiUrl]);

  useEffect(() => {
    fetchPaymentDatas();
  }, [currentPage, apiUrl]);



  

  useEffect(() => {
    const fetchPaymentOptions = async () => {
      if (!selectedApplicationId) return;

      try {
        const response = await axios.get(
          `${apiUrl}/applications/${selectedApplicationId}`,
          { headers: getAuthHeaders() }
        );
        if (response?.data.success && response?.data.result?.payment_options) {
          const formattedOptions: PaymentOption[] = response.data.result.payment_options.map(
            (option: string, index: number) => ({
              id: String(index),
              value: option,
              key: option,
              name: option,
              img: "", 
            })
          );
          setPaymentOptions(formattedOptions);
        }
       
      } catch (err) {
        toast.error("Failed to fetch payment options");
      }
    };

    fetchPaymentOptions();
  }, [selectedApplicationId, apiUrl]);

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="grid">
      <div className="flex overflow-hidden flex-col  px-8 py-6 w-full bg-neutral-900 rounded-[18px] max-md:max-w-full text-white min-h-[calc(100vh-73px)]">
        <Toaster position="top-right" reverseOrder={false} />
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{translations.paymentVerification.title}</h2>
          <div className="relative">
            <input
              type="text"
              placeholder={translations.paymentVerification.search.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-neutral-800 rounded-lg text-sm text-white placeholder:text-white/50 !outline-none focus:outline-none focus:ring-0 border-0 focus:border-0 w-[300px]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          </div>
        </div>
        <PaymentsTable
          paymentDatas={displayedPaymentDatas}
          paymentOptions={paymentOptions}
          onRowAction={(paymentData) => {
            setSelectedPaymentData(paymentData);
            openModal2();
          }}
        />
        <TransactionModal
          isOpen={isModalOpenadd}
          onClose={closeModal2}
          paymentData={selectedPaymentData}
          stores={stores}
          refreshData={fetchPaymentDatas}
          currentPage={currentPage}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          lang={lang}
        />
      </div>
    </div>
  );
}
