"use client";
import {  useEffect, useState } from "react";
import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";
import { ActionButtonProps, DetailItemProps, PhotoPreviewProps, Rejectedreasons, Verifications } from "./types";
import { useQuery } from "@tanstack/react-query";



export default function Verification() {
  const translations = useTranslation();
  const [verifications, setVerifications] = useState<Verifications[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedVerification, setSelectedVerification] =
    useState<Verifications | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [selectedRejectReason, setSelectedRejectReason] = useState("");
  const [customRejectReason, setCustomRejectReason] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const DetailItem = ({ label, value, children }: DetailItemProps) => (
    <div className="flex items-center space-x-2">
      <span className="opacity-70">{label} :</span>
      {children || <span className="font-medium px-1">{value || "N/A"}</span>}
    </div>
  );

  const PhotoPreview = ({ label, src }: PhotoPreviewProps) => {
    const imageUrl = src.startsWith("http")
      ? src
      : `https://api.ta7wila.com/${src}`;

    return (
      <div
        className="group relative overflow-hidden rounded-lg aspect-video bg-neutral-700 cursor-pointer"
        onClick={() => setSelectedImage(imageUrl)}
      >
        <img
          src={imageUrl}
          alt={label}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute bottom-2 left-2 px-2 py-1 text-xs bg-black/50 rounded backdrop-blur-sm">
          {label}
        </span>
      </div>
    );
  };

  const ActionButton = ({ color, children, ...props }: ActionButtonProps) => (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm
        ${
          color === "green"
            ? "text-[#53B4AB] bg-[#0FDBC8] bg-opacity-20"
            : color === "red"
              ? "text-[#F58C7B] bg-[#F58C7B] bg-opacity-20"
              : ""
        }
        hover:scale-[1.02] hover:shadow-lg`}
    >
      {children}
    </button>
  );

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
    queryKey: ["Rejectedreasons"],
    queryFn: ({ queryKey }) => fetchrejectedreasons(queryKey[1] as number),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  const fetchVerifications = async (currentPage: number) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${apiUrl}/identity-verification`, {
        headers: getAuthHeaders(),
      });
      if (data.success) {
        setVerifications(data.result.data.reverse() || []);
      } else {
        toast.error(data.message || "Failed to fetch verifications.");
      }
    } catch (error) {
      toast.error("Error fetching verifications.");
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (
    id: number,
    newStatus: string,
    rejected_reason_id?: number,
    rejected_reason?: { value: string; rejected_reason_type: string }
  ) => {
    try {
      const payload: any = { status: newStatus, id: id };

      if (newStatus === "rejected") {
        if (rejected_reason_id) {
          payload.rejected_reason_id = rejected_reason_id;
        } else if (rejected_reason) {
          payload.rejected_reason = rejected_reason;
        }
      }

      const { data } = await axios.post(
        `${apiUrl}/identity-verification/update-status`,
        payload,
        { headers: getAuthHeaders() }
      );

      if (data.success) {
        toast.success("Status updated successfully.");
        setSelectedVerification(null);
        setShowRejectForm(false);
        fetchVerifications(page);
      }
    } catch (error) {
      toast.error("Error updating status.");
    }
  };

  useEffect(() => {
    fetchVerifications(page);
  }, [page]);

  return (
    <div className="mt-2 grid">
      <div className="flex overflow-hidden flex-col px-4 py-6 w-full bg-neutral-900 rounded-xl max-md:max-w-full text-white min-h-[calc(100vh-77px)]">
        <Toaster position="top-right" reverseOrder={false} />

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {translations.sidebar.identityVerification}
          </h2>
        </div>

        {loading ? (
          <div className="text-center">{translations.price.loading}</div>
        ) : verifications.length > 0 ? (
          <div className="overflow-auto rounded-lg">
            <table className="min-w-full text-left text-sm table-auto">
              <thead className="bg-white/5 sticky top-0 z-10">
                <tr>
                  <th className="p-3 font-semibold">{translations.table.id}</th>
                  <th className="p-3 font-semibold">
                    {translations.logs.vendorName}
                  </th>
                  <th className="p-3 font-semibold">
                    {translations.auth.mobile}
                  </th>
                  <th className="p-3 font-semibold">
                    {translations.users.table.status}
                  </th>
                  <th className="p-3 font-semibold">
                    {translations.users.table.createdAt}
                  </th>
                  <th className="p-3 font-semibold">
                    {translations.stores.table.updatedAt}
                  </th>
                  <th className="p-3 font-semibold">
                    {translations.stores.table.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {verifications.map((verification) => (
                  <tr
                    key={verification.id}
                    className="transition rounded-lg border-b border-white/10 text-start py-3"
                  >
                    <td className="p-3">{verification.id}</td>
                    <td className="p-3">{verification.user?.name || "N/A"}</td>
                    <td className="p-3">
                      <span
                        style={{
                          direction: "ltr",
                          textAlign: "left",
                          display: "inline-block",
                        }}
                      >
                        {verification.user?.mobile || "N/A"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          verification.status === "active"
                            ? "text-[#53B4AB] bg-[#0FDBC8] bg-opacity-20"
                            : "text-[#F58C7B] bg-[#F58C7B] bg-opacity-20"
                        }`}
                      >
                        {verification.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(verification.created_at).toLocaleString()}
                    </td>
                    <td className="p-3">
                      {new Date(verification.updated_at).toLocaleString()}
                    </td>
                    <td className="p-3 text-[#53B4AB] cursor-pointer">
                      <span
                        onClick={() => setSelectedVerification(verification)}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M21.1303 9.8531C22.2899 11.0732 22.2899 12.9268 21.1303 14.1469C19.1745 16.2047 15.8155 19 12 19C8.18448 19 4.82549 16.2047 2.86971 14.1469C1.7101 12.9268 1.7101 11.0732 2.86971 9.8531C4.82549 7.79533 8.18448 5 12 5C15.8155 5 19.1745 7.79533 21.1303 9.8531Z"
                            stroke="white"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                            stroke="white"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">{translations.logs.noLogs}</div>
        )}

        {/* Modal */}
        {selectedVerification && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-b from-neutral-800 to-neutral-900 p-5 rounded-xl w-full max-w-2xl text-gray-100 overflow-y-auto max-h-[90vh] ">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">
                  {translations.verifications.details}
                </h3>
                <button
                  onClick={() => setSelectedVerification(null)}
                  className="p-2 hover:bg-neutral-700 rounded-full transition-all duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <DetailItem
                  label={translations.table.id}
                  value={selectedVerification.id}
                />
                <DetailItem label={translations.users.table.status}>
                  <span
                    className={`inline-flex items-center px-1 text-sm font-medium  
            ${selectedVerification.status === "rejected" ? "text-red-500 " : "text-green-500 "}`}
                  >
                    {selectedVerification.status}
                  </span>
                </DetailItem>
                <DetailItem
                  label={translations.auth.name}
                  value={selectedVerification.user?.name}
                />
                <DetailItem
                  label={translations.auth.email}
                  value={selectedVerification.user?.email}
                />
                <DetailItem
                  label={translations.auth.userName}
                  value={selectedVerification.user?.username}
                />
                <DetailItem label={translations.auth.mobile}>
                  <span
                    style={{
                      direction: "ltr",
                      textAlign: "left",
                      display: "inline-block",
                    }}
                    className=" px-1"
                  >
                    {selectedVerification.user?.mobile}
                  </span>
                </DetailItem>
                <DetailItem
                  label={translations.users.table.createdAt}
                  value={new Date(
                    selectedVerification.created_at
                  ).toLocaleString()}
                />
                <DetailItem
                  label={translations.stores.table.updatedAt}
                  value={new Date(
                    selectedVerification.updated_at
                  ).toLocaleString()}
                />
              </div>

              {selectedVerification.rejected_reason && (
                <div className="bg-red-900/20 p-4 rounded-lg mb-6">
                  <p className="font-medium text-red-300 mb-2">
                    {translations.verifications.rejectionDetails}
                  </p>
                  <p className="text-sm">
                    <span className="opacity-75">
                      {translations.verifications.reason}:
                    </span>{" "}
                    {selectedVerification.rejected_reason.value}
                  </p>
                  <p className="text-sm">
                    <span className="opacity-75">
                      {translations.verifications.type}:
                    </span>{" "}
                    {selectedVerification.rejected_reason.rejected_reason_type}
                  </p>
                </div>
              )}

              <div className="mb-8">
                <p className="font-medium mb-4">
                  {translations.verifications.uploadedPhotos}
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <PhotoPreview
                    label={translations.verifications.frontPhoto}
                    src={selectedVerification.front_photo}
                  />
                  <PhotoPreview
                    label={translations.verifications.backPhoto}
                    src={selectedVerification.back_photo}
                  />
                  <PhotoPreview
                    label={translations.verifications.selfiePhoto}
                    src={selectedVerification.selfie_photo}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                {showRejectForm ? (
                  <div className="w-full space-y-4">
                    <select
                      value={selectedRejectReason}
                      onChange={(e) => {
                        setSelectedRejectReason(e.target.value);
                        if (e.target.value !== "other")
                          setCustomRejectReason("");
                      }}
                      className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                    >
                      <option value="">Select rejection reason</option>
                      {Rejectedreasons?.map((reason) => (
                        <option key={reason.id} value={reason.id}>
                          {reason.value}
                        </option>
                      ))}
                      <option value="other">Other reason</option>
                    </select>

                    {selectedRejectReason === "other" && (
                      <textarea
                        value={customRejectReason}
                        onChange={(e) => setCustomRejectReason(e.target.value)}
                        placeholder="Enter custom reason"
                        className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10 "
                        rows={3}
                      />
                    )}

                    <div className="flex gap-3 justify-end">
                      <ActionButton
                        color="green"
                        onClick={() => setShowRejectForm(false)}
                      >
                        Cancel
                      </ActionButton>
                      <ActionButton
                        color="red"
                        onClick={() => {
                          if (selectedRejectReason === "other") {
                            if (!customRejectReason.trim()) {
                              toast.error("Please provide a rejection reason");
                              return;
                            }
                            handleStatusUpdate(
                              selectedVerification.id,
                              "rejected",
                              undefined,
                              {
                                value: customRejectReason,
                                rejected_reason_type: "custom",
                              }
                            );
                          } else {
                            const reasonId = parseInt(selectedRejectReason, 10);
                            if (isNaN(reasonId)) {
                              toast.error("Invalid rejection reason");
                              return;
                            }
                            handleStatusUpdate(
                              selectedVerification.id,
                              "rejected",
                              reasonId
                            );
                          }
                        }}
                      >
                        Confirm Reject
                      </ActionButton>
                    </div>
                  </div>
                ) : (
                  <>
                    <ActionButton
                      color="green"
                      onClick={() =>
                        handleStatusUpdate(selectedVerification.id, "approved")
                      }
                    >
                      {translations.verifications.approve}
                    </ActionButton>
                    <ActionButton
                      color="red"
                      onClick={() => setShowRejectForm(true)}
                    >
                      {translations.verifications.reject}
                    </ActionButton>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-[20vw] max-h-[20vh] -mt-20">
            <img
              src={selectedImage}
              className="object-contain max-w-full max-h-full"
              alt="Enlarged preview"
            />
            <button
              className="absolute top-4 right-4 bg-gray-500/80 text-white rounded-full 
             w-8 h-8 flex items-center justify-center hover:bg-gray-400/90 
             transition-all duration-200 backdrop-blur-sm shadow-lg"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image preview"
            >
              <span className="text-2xl leading-none mb-1">×</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
