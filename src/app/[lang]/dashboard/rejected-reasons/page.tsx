"use client";
import { useTranslation } from "@/context/translation-context";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";

type Rejectedreasons = {
  id: number;
  value: string;
  status: string;
  rejected_reason_type: string;
  created_at: string | null;
  updated_at: string | null;
};

export default function Rejectedreasons() {
  const translations = useTranslation();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReasonId, setSelectedReasonId] = useState<number | null>(null);
  const [editingReason, setEditingReason] = useState<Rejectedreasons | null>(
    null
  );
  const [formData, setFormData] = useState({
    id: 0,
    value: "",
    status: "active",
    rejected_reason_type: "",
  });

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.errorMessage) {
        toast.error(error.response.data.errorMessage);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error("Unauthorized access");
      } else {
        toast.error(translations.common.errorOccurred);
      }
    } else {
      toast.error(translations.common.errorOccurred);
    }
  };

  const StatusToggle = ({
    status,
    onClick,
  }: {
    status: string;
    onClick: () => void;
  }) => (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={status === "active"}
        onChange={onClick}
        required
        aria-label={
          status === "active"
            ? translations.common.active
            : translations.common.inactive
        }
      />
      <div className="relative w-11 h-6 bg-red-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full" />
    </label>
  );

  const toggleStatus = async (id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await axios.post(
        `${apiUrl}/rejected-reasons/update-status/${id}`,
        { status: newStatus },
        { headers: getAuthHeaders() }
      );
      toast.success(translations.common.statusUpdated);
      refetch();
    } catch (error) {
      handleError(error);
    }
  };

  const fetchrejectedreasons = async (
    currentPage: number
  ): Promise<Rejectedreasons[]> => {
    const response = await axios.get(`${apiUrl}/rejected-reasons`, {
      headers: getAuthHeaders(),
    });
    return response.data.result.data.reverse() || [];
  };

  const {
    data: Rejectedreasons,
    error,
    refetch,
  } = useQuery<Rejectedreasons[], Error>({
    queryKey: ["Rejectedreasons", currentPage],
    queryFn: ({ queryKey }) => fetchrejectedreasons(queryKey[1] as number),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/rejected-reasons/create`, formData, {
        headers: getAuthHeaders(),
      });
      toast.success(translations.common.createdSuccessfully);
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      handleError(error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReason) return;
    try {
      await axios.post(`${apiUrl}/rejected-reasons/update`, formData, {
        headers: getAuthHeaders(),
      });
      toast.success(translations.common.updatedSuccessfully);
      setIsModalOpen(false);
      setEditingReason(null);
      refetch();
    } catch (error) {
      handleError(error);
    }
  };

  const handleDelete = (id: number) => {
    setSelectedReasonId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedReasonId) return;
    try {
      await axios.post(
        `${apiUrl}/rejected-reasons/delete/${selectedReasonId}`,
        {},
        { headers: getAuthHeaders() }
      );
      toast.success(translations.common.deletedSuccessfully);
      refetch();
    } catch (error) {
      handleError(error);
    } finally {
      setDeleteModalOpen(false);
      setSelectedReasonId(null);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <div className="text-center p-8 rounded-lg bg-neutral-800">
          <div className="text-red-500 text-xl mb-4">
            {translations.common.errorOccurred}
          </div>
          <div className="text-white/70 mb-4">
            {error instanceof Error ? error.message : translations.invoice.errorLoading}
          </div>
          <button
            onClick={() => refetch()}
            className="bg-[#53B4AB] hover:bg-[#347871] text-black px-6 py-2 rounded-lg"
          >
            {translations.common.save}
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(Rejectedreasons)) {
    return <div>{translations.invoice.unexpectedFormat}</div>;
  }
  return (
    <div className="grid">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col overflow-hidden px-8 py-6 w-full bg-neutral-900 rounded-lg max-md:max-w-full text-white min-h-[calc(100vh-73px)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {translations.sidebar.Rejectedreasons}
          </h2>
          <button
            onClick={() => {
              setFormData({
                value: "",
                status: "active",
                rejected_reason_type: "",
                id: 0,
              });
              setEditingReason(null);
              setIsModalOpen(true);
            }}
            className="bg-[#53B4AB] hover:bg-[#1c8176] text-black px-3 text-sm py-2 rounded-lg"
          >
            {translations.common.addNew}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table
            className="table-auto w-full text-left"
            aria-label="Rejected Reasons Table"
          >
            <thead>
              <tr className="text-white text-start">
                <th className="p-2">{translations.table.id}</th>
                <th className="p-2">
                  {translations.subscription.modal.rejectedreasontype}
                </th>
                <th className="p-2">
                  {translations.subscription.modal.rejectedreasonValue}
                </th>
                <th className="p-2">
                  {translations.subscription.modal.status}
                </th>
                <th className="p-2">
                  {translations.subscription.table.createdAt}
                </th>
                <th className="p-2">
                  {translations.subscription.table.updatedAt}
                </th>
                <th className="p-2">
                  {translations.storepayment.table.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {Rejectedreasons.length > 0 ? (
                Rejectedreasons.map((rejectedreason) => (
                  <tr
                    key={rejectedreason.id}
                    className="text-start border-b border-neutral-700"
                  >
                    <td className="p-2">{rejectedreason.id}</td>
                    <td className="p-2">
                      {rejectedreason.rejected_reason_type}
                    </td>
                    <td className="p-2">{rejectedreason.value}</td>
                    <td className="p-2">
                      <StatusToggle
                        status={rejectedreason.status}
                        onClick={() =>
                          toggleStatus(rejectedreason.id, rejectedreason.status)
                        }
                      />
                    </td>
                    <td className="p-2">
                      {new Date(
                        rejectedreason.created_at || "N/A"
                      ).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      {new Date(
                        rejectedreason.updated_at || "N/A"
                      ).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1 items-center">
                        {/* Edit Button */}
                        <button
                          onClick={() => {
                            setFormData({
                              id: rejectedreason.id,
                              value: rejectedreason.value,
                              status: rejectedreason.status,
                              rejected_reason_type:
                                rejectedreason.rejected_reason_type,
                            });
                            setEditingReason(rejectedreason);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-[#53B4AB] hover:bg-[#53B4AB]/10 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#53B4AB]/50"
                        >
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          >
                            <path d="M22 12V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18V6C2 3.79086 3.79086 2 6 2H12M15.6864 4.02275C15.6864 4.02275 15.6864 5.45305 17.1167 6.88334C18.547 8.31364 19.9773 8.31364 19.9773 8.31364M9.15467 15.9896L12.1583 15.5605C12.5916 15.4986 12.9931 15.2978 13.3025 14.9884L21.4076 6.88334C22.1975 6.09341 22.1975 4.81268 21.4076 4.02275L19.9773 2.59245C19.1873 1.80252 17.9066 1.80252 17.1167 2.59245L9.01164 10.6975C8.70217 11.0069 8.50142 11.4084 8.43952 11.8417L8.01044 14.8453C7.91508 15.5128 8.4872 16.0849 9.15467 15.9896Z" />
                          </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(rejectedreason.id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        >
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 8V18C5 20.2091 6.79086 22 9 22H15C17.2091 22 19 20.2091 19 18V8M14 11V17M10 11L10 17M16 5L14.5937 2.8906C14.2228 2.3342 13.5983 2 12.9296 2H11.0704C10.4017 2 9.7772 2.3342 9.40627 2.8906L8 5M16 5H8M16 5H21M8 5H3" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    {translations.storepayment.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-neutral-800 p-5 rounded-xl w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl mb-4">
                  {editingReason
                    ? translations.common.edit
                    : translations.common.create}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className=" text-white  rounded-lg text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9.586l4.95-4.95a1 1 0 011.415 1.415L11.414 11l4.95 4.95a1 1 0 01-1.415 1.415L10 12.414l-4.95 4.95a1 1 0 01-1.415-1.415L8.586 11 3.636 6.05a1 1 0 011.415-1.415L10 9.586z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={editingReason ? handleUpdate : handleCreate}>
                <div className="mb-4">
                  <label className="block mb-2">
                    {translations.common.value}
                  </label>
                  <input
                    type="text"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                    className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10 "
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">
                    {translations.common.type}
                  </label>
                  <select
                    value={formData.rejected_reason_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rejected_reason_type: e.target.value,
                      })
                    }
                    className="custom-select px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10 "
                    required
                  >
                    <option value="">{translations.common.selectType}</option>
                    <option value="identity-verification">
                      Identity Verification
                    </option>
                    <option value="payment-verification">
                      Payment Verification
                    </option>
                  </select>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    className="bg-[#53B4AB] hover:bg-[#51c1b5] text-black px-4 py-2 rounded-lg text-sm"
                  >
                    {translations.common.save}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-neutral-800 text-white p-5 rounded-xl w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl mb-4">
                {translations.common.confirmDelete}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setSelectedReasonId(null);
                }}
                className="text-white rounded-lg text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9.586l4.95-4.95a1 1 0 011.415 1.415L11.414 11l4.95 4.95a1 1 0 01-1.415 1.415L10 12.414l-4.95 4.95a1 1 0 01-1.415-1.415L8.586 11 3.636 6.05a1 1 0 011.415-1.415L10 9.586z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <p>{translations.common.confirmDeleteMessage}</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setSelectedReasonId(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                {translations.common.cancel}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                {translations.common.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
