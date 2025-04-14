"use client"
import { useEffect, useState } from 'react';

import { useTranslation } from "@/context/translation-context";
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../../Shared/getAuth";
import { Log, Params } from '../types';


export default async function Logs({ params }: { params: Promise<Params> }) {
  const translations = useTranslation();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchLogs = async (currentPage: number): Promise<void> => {
    setLoading(true);
    try {
      const { id } = await params;
      const response = await fetch(`${apiUrl}/logs?application_id=${id}?page=${page}`, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success) {
        setLogs(data.result.data || []);
      } else {
        console.error('Failed to fetch logs:', data.message);
        setLogs([]);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLogs([]);
    }
    setLoading(false);
  };

  const clearLogs = async (): Promise<void> => {
    try {
      const { id } = await params;
      const response = await axios.post(`${apiUrl}/logs/clear?application_id=${id}`, {}, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });

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
    fetchLogs(page);
  }, [page]);



  return (
    <div className="mt-2 grid">
      <div className="flex overflow-hidden flex-col  px-8 py-6 w-full bg-neutral-900 rounded-[18px] max-md:max-w-full text-white min-h-[calc(100vh-77px)]">
        <Toaster position="top-right" reverseOrder={false} />

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">{translations.sidebar.logs}</h1>
          <button
            className="bg-[#53B4AB] hover:bg-[#48a097] text-black px-4 py-2 rounded-[16px] text-sm"
            onClick={clearLogs}
          >
            {translations.logs.clearLogs}
          </button>
        </div>

        <div className="overflow-x-auto ">
          {loading ? (
            <div className="text-center">{translations.price.loading}</div>
          ) : logs.length > 0 ? (
            <table className="table-auto w-full text-left">
              <thead>
                <tr >
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
                  <tr key={log.id} className="hover:bg-[#444444]">
                    <td className="p-2">{log.id}</td>
                    <td className="p-2">{log.vendor?.name || 'N/A'}</td>
                    <td className="p-2">{log.vendor?.mobile || 'N/A'}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-[1rem] ${log.status === 'active' ? 'bg-green-500' : 'bg-red-600 text-black'
                          }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="p-2">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="p-2">{new Date(log.updated_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center">{translations.logs.noLogs}</div>
          )}
        </div>

        <div className="flex justify-between items-center mt-auto">
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded-[2rem]"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            {translations.pagination.previous}
          </button>
          <span className="text-white">{translations.pagination.page} {page}</span>
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded-[2rem]"
            onClick={() => setPage((prev) => prev + 1)}
          >
            {translations.pagination.next}
          </button>
        </div>
      </div>
    </div>
  );
}
