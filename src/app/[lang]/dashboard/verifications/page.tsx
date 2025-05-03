"use client";
import { ReactNode, useEffect, useState } from "react";
import Pagination from "@/components/Shared/Pagination";
import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";
import { Verifications } from "./types";


type DetailItemProps = {
  label: string;
  value?: string | number | null;
  children?: ReactNode;
};

type PhotoPreviewProps = {
  label: string;
  src: string;
};

type ActionButtonProps = {
  color: 'green' | 'red';
  children: ReactNode;
  onClick?: () => void;
};


export default function Verification() {
  const translations = useTranslation();
  const [verifications, setVerifications] = useState<Verifications[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedVerification, setSelectedVerification] =
    useState<Verifications | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Helper components
const DetailItem = ({ label, value, children }: DetailItemProps) => (
  <div className="flex items-center space-x-2">
    <span className="opacity-70">{label}:</span>
    {children || <span className="font-medium">{value || 'N/A'}</span>}
  </div>
);

const PhotoPreview = ({ label, src }: PhotoPreviewProps) => (
  <div className="group relative overflow-hidden rounded-lg aspect-video bg-neutral-700">
    <img
      src={`https://api.ta7wila.com/${src}`}
      alt={label}
      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
    />
    <span className="absolute bottom-2 left-2 px-2 py-1 text-xs bg-black/50 rounded backdrop-blur-sm">
      {label}
    </span>
  </div>
);

  const ActionButton = ({ color, children, ...props }: ActionButtonProps) => (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm
        ${color === 'green' ? 'text-[#53B4AB] bg-[#0FDBC8] bg-opacity-20' : 
         color === 'red' ? 'text-[#F58C7B] bg-[#F58C7B] bg-opacity-20' : ''}
        hover:scale-[1.02] hover:shadow-lg`}
    >
      {children}
    </button>
  );

  const fetchVerifications = async (currentPage: number) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${apiUrl}/identity-verification`, {
        headers: getAuthHeaders(),
      });
      if (data.success) {
        setVerifications(data.result.data || []);
      } else {
        toast.error(data.message || "Failed to fetch verifications.");
      }
    } catch (error) {
      toast.error("Error fetching verifications.");
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const { data } = await axios.put(
        `${apiUrl}/identity-verification/${id}`,
        { status: newStatus },
        { headers: getAuthHeaders() }
      );
      if (data.success) {
        toast.success("Status updated successfully.");
        setSelectedVerification(null);
        fetchVerifications(page);
      } else {
        toast.error(data.message || "Failed to update status.");
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
                      {verification.user?.mobile || "N/A"}
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
                        {translations.users.table.view}
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
              <h3 className="text-xl font-bold  ">
                Verification Details
              </h3>
              <button 
                onClick={() => setSelectedVerification(null)}
                className="p-2 hover:bg-neutral-700 rounded-full transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
        
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <DetailItem label="ID" value={selectedVerification.id} />
              <DetailItem label="Status">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                  ${selectedVerification.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                  {selectedVerification.status}
                </span>
              </DetailItem>
              <DetailItem label="Name" value={selectedVerification.user?.name} />
              <DetailItem label="Email" value={selectedVerification.user?.email} />
              <DetailItem label="Username" value={selectedVerification.user?.username} />
              <DetailItem label="Mobile" value={selectedVerification.user?.mobile} />
              <DetailItem 
                label="Created At" 
                value={new Date(selectedVerification.created_at).toLocaleString()} 
              />
              <DetailItem 
                label="Updated At" 
                value={new Date(selectedVerification.updated_at).toLocaleString()} 
              />
            </div>
        
            {selectedVerification.rejected_reason && (
              <div className="bg-red-900/20 p-4 rounded-lg mb-6">
                <p className="font-medium text-red-300 mb-2">Rejection Details</p>
                <p className="text-sm"><span className="opacity-75">Reason:</span> {selectedVerification.rejected_reason.value}</p>
                <p className="text-sm"><span className="opacity-75">Type:</span> {selectedVerification.rejected_reason.rejected_reason_type}</p>
              </div>
            )}
        
            <div className="mb-8">
              <p className="font-medium mb-4">Uploaded Photos</p>
              <div className="grid grid-cols-3 gap-4">
                <PhotoPreview label="Front" src={selectedVerification.front_photo} />
                <PhotoPreview label="Back" src={selectedVerification.back_photo} />
                <PhotoPreview label="Selfie" src={selectedVerification.selfie_photo} />
              </div>
            </div>
        
            <div className="flex justify-end gap-3">
              <ActionButton 
                color="green" 
                onClick={() => handleStatusUpdate(selectedVerification.id, "active")}
              >
                Approve
              </ActionButton>
              <ActionButton 
                color="red" 
                onClick={() => handleStatusUpdate(selectedVerification.id, "inactive")}
              >
                Reject
              </ActionButton>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
