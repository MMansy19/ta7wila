"use client";
import { useEffect, useState } from "react";
import Pagination from "@/components/Shared/Pagination";
import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../../Shared/getAuth";
import { Log, Params } from "../types";

export default function Logs({ params }: { params: Promise<Params> }) {
  const translations = useTranslation();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [resolvedParams, setResolvedParams] = useState<Params | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Resolve the params Promise
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolved = await params;
        setResolvedParams(resolved);
      } catch (err) {
        toast.error("Error resolving parameters");
      }
    };

    resolveParams();
  }, [params]);

  const fetchLogs = async (currentPage: number): Promise<void> => {
    if (!resolvedParams) return;

    setLoading(true);
    try {
      const { id } = resolvedParams;
      const response = await fetch(
        `${apiUrl}/logs?application_id=${id}?page=${page}`,
        { headers: getAuthHeaders() }
      );
      const data = await response.json();
      if (data.success) {
        setLogs(data.result.data || []);
        setTotalPages(data.result.total_pages || 1);
      } else {
        console.error("Failed to fetch logs:", data.message);
        setLogs([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  const clearLogs = async (): Promise<void> => {
    if (!resolvedParams) return;

    try {
      const { id } = resolvedParams;
      const response = await axios.post(
        `${apiUrl}/logs/clear?application_id=${id}`,
        {},
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success(translations.logs.clearSuccess);
        setLogs([]);
      } else {
        toast.error(data.message || translations.logs.noDataToClear);
      }
    } catch (error) {
      toast.error(translations.logs.noDataToClear);
      console.error("Error clearing logs:", error);
    }
  };

  useEffect(() => {
    if (resolvedParams) {
      fetchLogs(page);
    }
  }, [page, resolvedParams]);

  return (
    <div className="mt-2 grid">
      <div className="flex overflow-hidden flex-col  px-8 py-6 w-full bg-neutral-900 rounded-[18px] max-md:max-w-full text-white min-h-[calc(100vh-77px)]">
        <Toaster position="top-right" reverseOrder={false} />

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {translations.sidebar.logs}
          </h2>
          <button
            className="bg-[#53B4AB] hover:bg-[#48a097] text-black px-4 py-2 rounded-lg text-sm"
            onClick={clearLogs}
          >
            {translations.logs.clearLogs}
          </button>
        </div>

        <div className="overflow-x-auto ">
          {loading ? (
            <div className="text-center">{translations.price.loading}</div>
          ) : logs.length > 0 ? (
            <table className="table-auto w-full text-start">
              <thead>
                <tr>
                  <th className="p-2">{translations.table.id}</th>
                  <th className="p-2">{translations.logs.vendorName}</th>
                  <th className="p-2">{translations.auth.mobile}</th>
                  <th className="p-2">{translations.users.table.status}</th>
                  <th className="p-2">{translations.users.table.createdAt}</th>
                  <th className="p-2">{translations.stores.table.updatedAt}</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="transition-all border-b border-white/10 p-2"
                  >
                    <td className="p-2">{log.id}</td>
                    <td className="p-2">{log.vendor?.name || "N/A"}</td>
                    <td className="p-2">{log.vendor?.mobile || "N/A"}</td>
                    <td className="p-2">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs ${
                          log.status === "active"
                            ? "text-[#53B4AB] bg-[#0FDBC8] bg-opacity-20"
                            : "text-[#F58C7B] bg-[#F58C7B] bg-opacity-20"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="p-2">
                      {new Date(log.created_at).toLocaleString(
                        resolvedParams?.lang === "ar" ? "ar-AE" : "en-US"
                      )}
                    </td>
                    <td className="p-2">
                      {new Date(log.updated_at).toLocaleString(
                        resolvedParams?.lang === "ar" ? "ar-AE" : "en-US"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center">{translations.logs.noLogs}</div>
          )}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          lang={resolvedParams?.lang}
        />
      </div>
    </div>
  );
}
