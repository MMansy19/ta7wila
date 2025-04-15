"use client";

import Pagination from "@/components/[lang]/pagination";
import { Button } from "@/components/[lang]/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/[lang]/ui/dropdown-menu";
import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";

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
  const translations = useTranslation();
  const [stores, setStores] = useState<Store[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const paymentOptions = [
    { name: "VF- CASH", key: "vcash", img: "/vcash.svg" },
    { name: "Et- CASH", key: "ecash", img: "/ecash.svg" },
    { name: "WE- CASH", key: "wecash", img: "/wecash.svg" },
    { name: "OR- CASH", key: "ocash", img: "/ocash.svg" },
    { name: "INSTAPAY", key: "instapay", img: "/instapay.svg" },
  ];

  const itemsPerPage = 15;
  const displayedStores = stores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
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
          createdAt: new Date(item.created_at).toLocaleDateString(),
          updatedAt: new Date(item.updated_at).toLocaleDateString(),
          paymentOptions: item.payment_options,
          totalPages: response.data.result.totalPages,
        }));

        setStores(transformedStores);
        setTotalPages(response.data.result.totalPages);
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
      <div className="flex overflow-hidden flex-col  px-8 py-6 w-full bg-neutral-900 rounded-[18px] max-md:max-w-full text-white min-h-[calc(100vh-73px)]">
        <Toaster position="top-right" reverseOrder={false} />

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">{translations.stores.title}</h1>
          <button className="bg-[#53B4AB] hover:bg-[#4cb0a6] text-black px-4 py-2 rounded-[16px] text-sm">
            <Link href="/dashboard/addstore">{translations.stores.addStore}</Link>
          </button>
        </div>

        <div className="overflow-x-auto ">
          <table className="table-auto w-full text-left">
            <thead>
              <tr className="">
                <th className="p-2">{translations.stores.table.id}</th>
                <th className="p-2">{translations.stores.table.name}</th>
                <th className="p-2">{translations.stores.table.mobile}</th>
                <th className="p-2">{translations.stores.table.status}</th>
                <th className="p-2">{translations.stores.table.createdAt}</th>
                <th className="p-2">{translations.stores.table.updatedAt}</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedStores.length > 0 ? (
                displayedStores.map((store) => (
                  <tr key={store.id} className="transition rounded-lg border-b border-white/10">
                    <td className="p-2">{store.id}</td>
                    <td className="p-2">{store.name}</td>
                    <td className="p-2">{store.mobile}</td>
                    <td className="p-2">
                      <span
                        className={`px-3 py-.5 min-h-[30px] rounded-[12px] w-[62px]   ${
                          store.status === "active"
                            ? "text-[#53B4AB] bg-[#0FDBC8] bg-opacity-30 cursor-not-allowed"
                            : "text-[#F58C7B] bg-[#F58C7B] bg-opacity-50 cursor-pointer"
                        }`}
                      >
                        {store.status === "active" 
                          ? translations.stores.status.active 
                          : translations.stores.status.inactive}
                      </span>
                    </td>
                    <td className="p-2">{store.createdAt}</td>
                    <td className="p-2">{store.updatedAt}</td>
                    <td className="p-2">
                      {" "}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="relative h-8 w-8 rounded-full bg-neutral-900 "
                          >
                            <Ellipsis className="h-4 w-4" />
                            <span className="sr-only">View notifications</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rtl:text-right ltr:text-left">
                          <DropdownMenuLabel>{translations.stores.actions.title}</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          <DropdownMenuItem  className="rtl:text-right ltr:text-left">
                            <Link href={`/dashboard/storeupdate/${store.id}`}>
                              <button
                                className="block w-full"
                                onClick={() => setSelectedStore(store)}
                              >
                                {translations.stores.actions.update}
                              </button>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/dashboard/storepayment/${store.id}`}>
                              <button className="block w-full ">
                                {translations.stores.actions.payment}
                              </button>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {" "}
                            <Link href={`/dashboard/logs/${store.id}`}>
                              <button className="block w-full ">
                                {translations.stores.actions.logs}
                              </button>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {" "}
                            <Link href={`/dashboard/storeDetails/${store.id}`}>
                              <button className="block w-full ">
                                {translations.stores.actions.details}
                              </button>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {" "}
                            <Link href={`/dashboard/check-transaction/${store.id}`}>
                              <button className="block w-full ">
                                {translations.stores.actions.manualCheck}
                              </button>
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-4 text-center" colSpan={7}>
                    {translations.stores.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChangeClient={handlePageChange}
        />
      </div>
    </div>
  );
}
