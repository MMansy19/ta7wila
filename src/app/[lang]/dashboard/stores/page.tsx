"use client";
import Pagination from "@/components/Shared/Pagination";
import { Button } from "@/components/[lang]/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/[lang]/ui/dropdown-menu";
import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { Ellipsis, Store as StoreIcon, Phone, Mail, Calendar, Clock, Settings, Eye, CreditCard, FileText, CheckCircle, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";
import { formatDateTime } from "@/lib/utils";
import { useParams } from "next/navigation";
export const dynamic = 'force-dynamic';

interface Store {
  id: number;
  name: string;
  webhook_url: string;
  mobile: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  paymentOptions: string[];
  totalPages: number;
}

export default function StoresTable() {
  const params = useParams();
  const lang = params.lang as string;
  const translations = useTranslation();
  const [stores, setStores] = useState<Store[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 12; // Changed to 12 for better grid layout

  // Filter stores based on search query
  const filteredStores = stores.filter((store) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      store.name?.toLowerCase().includes(searchLower) ||
      store.mobile?.toLowerCase().includes(searchLower) ||
      store.email?.toLowerCase().includes(searchLower) ||
      store.status?.toLowerCase().includes(searchLower)
    );
  });

  const displayedStores = filteredStores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalFilteredPages = Math.ceil(filteredStores.length / itemsPerPage);
  const handlePageChange = (page: number) => setCurrentPage(page);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = (id: number) => {
    setDropdownOpen((prev) => (prev === id ? null : id));
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/applications?page=${{ currentPage }}`,
          { headers: getAuthHeaders() }
        );
        const data = response.data.result.data;

        const transformedStores: Store[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          mobile: item.mobile,
          email: item.email,
          webhook_url: item.webhook_url,
          status: item.status,
                  createdAt: item.created_at,
        updatedAt: item.updated_at,
          paymentOptions: item.payment_options,
          totalPages: response.data.result.totalPages,
        }));

        setStores(transformedStores);
        setTotalPages(response.data.result.totalPages || 1);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch stores");
        toast.error("Failed to fetch stores");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [setStores, setError, setLoading]);

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="grid">
      <div className="flex overflow-hidden flex-col  px-8 py-6 w-full bg-neutral-900 rounded-lg max-md:max-w-full text-white min-h-[calc(100vh-73px)]">
        <Toaster position="top-right" reverseOrder={false} />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-white">
              {translations.stores.title}
            </h2>
            <p className="text-white/60 text-sm">
              إدارة وعرض جميع المتاجر المسجلة في النظام
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="البحث في المتاجر..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-neutral-800/50 backdrop-blur-sm rounded-xl text-sm text-white placeholder:text-white/50 border border-white/10 focus:border-[#53B4AB]/50 focus:outline-none focus:ring-2 focus:ring-[#53B4AB]/20 transition-all duration-200 w-full sm:w-[280px]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            </div>
            
            <Link href="/dashboard/addstore">
              <button className="bg-gradient-to-r from-[#53B4AB] to-[#4cb0a6] hover:from-[#4cb0a6] hover:to-[#53B4AB] text-black px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#53B4AB]/25 whitespace-nowrap">
                {translations.stores.addStore}
              </button>
            </Link>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#53B4AB]/20 to-[#53B4AB]/10 backdrop-blur-sm rounded-xl p-4 border border-[#53B4AB]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#53B4AB]/20 flex items-center justify-center">
                <StoreIcon className="w-5 h-5 text-[#53B4AB]" />
              </div>
              <div>
                <p className="text-white/60 text-xs">إجمالي المتاجر</p>
                <p className="text-white font-semibold text-lg">{stores.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 backdrop-blur-sm rounded-xl p-4 border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white/60 text-xs">المتاجر النشطة</p>
                <p className="text-white font-semibold text-lg">{stores.filter(s => s.status === 'active').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-500/10 backdrop-blur-sm rounded-xl p-4 border border-orange-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-white/60 text-xs">المتاجر غير النشطة</p>
                <p className="text-white font-semibold text-lg">{stores.filter(s => s.status !== 'active').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white/60 text-xs">نتائج البحث</p>
                <p className="text-white font-semibold text-lg">{filteredStores.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stores Grid */}
        {displayedStores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-6">
            {displayedStores.map((store) => (
              <div
                key={store.id}
                className="group relative bg-gradient-to-br from-neutral-800/40 to-neutral-900/60 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-[#53B4AB]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#53B4AB]/5 hover:-translate-y-1"
              >
                {/* Store Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#53B4AB]/20 to-[#53B4AB]/10 flex items-center justify-center border border-[#53B4AB]/20 group-hover:border-[#53B4AB]/40 transition-all duration-300">
                        <StoreIcon className="w-6 h-6 text-[#53B4AB] group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg leading-tight mb-1">{store.name}</h3>
                        <span className="text-white/40 text-xs font-medium">ID: {store.id}</span>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      {store.status === "active" ? (
                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-green-500/20 to-green-500/10 px-3 py-1.5 rounded-full border border-green-500/30">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                          <span className="text-green-400 font-medium text-xs">نشط</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500/20 to-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/30">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                          <span className="text-orange-400 font-medium text-xs">غير نشط</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-[#F58C7B]/20 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-[#F58C7B]" />
                      </div>
                      <span className="text-[#F58C7B] font-medium" style={{ direction: "ltr", textAlign: "left" }}>
                        {store.mobile}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-blue-400 font-medium truncate">{store.email}</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/60">تاريخ الإنشاء</span>
                        <div className="flex flex-col text-right">
                          <span className="text-white/90 font-medium">{formatDateTime(store.createdAt).date}</span>
                          <span className="text-emerald-400 font-medium">{formatDateTime(store.createdAt).time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/60">آخر تحديث</span>
                        <div className="flex flex-col text-right">
                          <span className="text-white/90 font-medium">{formatDateTime(store.updatedAt).date}</span>
                          <span className="text-amber-400 font-medium">{formatDateTime(store.updatedAt).time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="px-6 py-4 border-t border-white/10 bg-black/20 rounded-b-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/storeDetails/${store.id}`}>
                        <button className="group/btn flex items-center gap-2 px-3 py-2 bg-[#53B4AB]/20 hover:bg-[#53B4AB]/30 text-[#53B4AB] hover:text-white rounded-lg transition-all duration-200 text-xs font-medium border border-[#53B4AB]/20 hover:border-[#53B4AB]/40">
                          <Eye className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform duration-200" />
                          <span>عرض</span>
                        </button>
                      </Link>
                      
                      <Link href={`/dashboard/storeupdate/${store.id}`}>
                        <button className="group/btn flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-white rounded-lg transition-all duration-200 text-xs font-medium border border-blue-500/20 hover:border-blue-500/40">
                          <Settings className="w-3.5 h-3.5 group-hover/btn:rotate-90 transition-transform duration-300" />
                          <span>تعديل</span>
                        </button>
                      </Link>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-200"
                        >
                          <Ellipsis className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#1F1F1F] border-white/20 rounded-xl shadow-xl backdrop-blur-sm">
                        <DropdownMenuLabel className="text-white/90 font-semibold">
                          {translations.stores.actions.title}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/10" />

                        <div className="p-1 space-y-1">
                          <Link href={`/dashboard/storepayment/${store.id}`}>
                            <button className="w-full text-right p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white flex items-center gap-3">
                              <CreditCard className="w-4 h-4 text-green-400" />
                              <span className="text-sm">{translations.stores.actions.payment}</span>
                            </button>
                          </Link>
                          
                          <Link href={`/dashboard/logs/${store.id}`}>
                            <button className="w-full text-right p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white flex items-center gap-3">
                              <FileText className="w-4 h-4 text-blue-400" />
                              <span className="text-sm">{translations.stores.actions.logs}</span>
                            </button>
                          </Link>
                          
                          <Link href={`/dashboard/check-transaction/${store.id}`}>
                            <button className="w-full text-right p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white flex items-center gap-3">
                              <CheckCircle className="w-4 h-4 text-purple-400" />
                              <span className="text-sm">{translations.stores.actions.manualCheck}</span>
                            </button>
                          </Link>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-white/60">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10">
              <StoreIcon className="w-10 h-10 text-white/30" />
            </div>
            <h3 className="text-lg font-semibold text-white/70 mb-2">لا توجد متاجر</h3>
            <p className="text-sm text-white/50 text-center mb-6">
              {searchQuery ? "لم يتم العثور على متاجر تطابق البحث" : "لم يتم إضافة أي متاجر بعد"}
            </p>
            {!searchQuery && (
              <Link href="/dashboard/addstore">
                <button className="bg-gradient-to-r from-[#53B4AB] to-[#4cb0a6] hover:from-[#4cb0a6] hover:to-[#53B4AB] text-black px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#53B4AB]/25">
                  {translations.stores.addStore}
                </button>
              </Link>
            )}
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalFilteredPages}
          onPageChange={handlePageChange}
          lang={lang}
        />
      </div>
    </div>
  );
}
