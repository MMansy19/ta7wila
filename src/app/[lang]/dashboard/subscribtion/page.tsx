"use client";
import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";
import useCurrency from "../Shared/useCurrency";
import SubscriptionModal from "./modal";
import { ApiResponse, Plan } from "./types";

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<Plan | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const formatCurrency = useCurrency();

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const translations = useTranslation();

  const openModal = (subscription: Plan) => {
    setSelectedSubscription(subscription);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSubscription(null);
    setIsModalOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const url = `${apiUrl}/subscriptions?page=${currentPage}`;
      try {
        const response = await axios.get<ApiResponse>(url, {
          headers: getAuthHeaders(),
        });
        setSubscriptions(response.data.result.data);      } catch (error: unknown) {
        let errorMessage = translations.errors?.developerMode || "Failed to fetch subscriptions";
        
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

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, [currentPage, apiUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubscription) return;

    setSubmitting(true);
    try {
      const response = await axios.put(
        `${apiUrl}/subscriptions/${selectedSubscription.id}`,
        selectedSubscription,
        { headers: getAuthHeaders() }
      );
      toast.success("Subscription updated successfully");
      setSubscriptions(
        subscriptions.map((sub) =>
          sub.id === selectedSubscription.id
            ? response.data.result.data[0]
            : sub
        )
      );
      closeModal();    } catch (error: unknown) {
      let errorMessage = translations.errors?.developerMode || "Failed to update subscription";
      
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
      setSubmitting(false);
    }
  };

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-500 bg-red-100/10 p-4 rounded-lg">
        {error}
      </div>
    </div>
  );

  return (
    <div>
      <div className="grid mt-2">
        <div className="flex flex-col overflow-hidden bg-neutral-900 rounded-xl p-6 text-white min-h-[calc(100vh-76px)]">
          <Toaster position="top-right" />
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">{translations.subscription.title}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-2">{translations.subscription.table.title}</th>
                  <th className="p-2">{translations.subscription.table.amount}</th>
                  <th className="p-2">{translations.subscription.table.type}</th>
                  <th className="p-2">{translations.subscription.table.status}</th>
                  <th className="p-2">{translations.subscription.table.applications}</th>
                  <th className="p-2">{translations.subscription.table.employees}</th>
                  <th className="p-2">{translations.subscription.table.vendors}</th>
                  <th className="p-2">{translations.subscription.table.createdAt}</th>
                  <th className="p-2">{translations.subscription.table.actions}</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.length > 0 ? (
                  subscriptions.map((subscription) => (
                    <tr key={subscription.id} className="transition py-2 border-b border-white/10">
                      <td className="p-2">{subscription.title}</td>
                      <td className="p-2">{formatCurrency(subscription.amount)}</td>
                      <td className="p-2">{subscription.subscription_type}</td>
                      <td className="p-2">
                  
                        <span className={`px-2 py-1 rounded-full text-sm ${subscription.status === "active" ? "text-[#53B4AB] bg-[#0FDBC8] bg-opacity-20 cursor-not-allowed" : "text-[#F58C7B] bg-[#F58C7B] bg-opacity-20 cursor-pointer"
                          }`}
                        >
                          {subscription.status}
                        </span>
                        </td>
                      <td className="p-2">
                        {subscription.applications_count}/
                        {subscription.max_applications_count}
                      </td>
                      <td className="p-2">
                        {subscription.employees_count}/
                        {subscription.max_employees_count}
                      </td>
                      <td className="p-2">
                        {subscription.vendors_count}/
                        {subscription.max_vendors_count}
                      </td>
                      <td className="p-2">
                        {new Date(subscription.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => openModal(subscription)}
                          className="bg-[#53B4AB] hover:bg-[#347871] px-3 py-1 rounded-lg text-black text-sm"
                        >
                          {translations.subscription.table.view}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-24">
                      {translations.subscription.noData}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {isModalOpen && selectedSubscription && (
            <SubscriptionModal
              selectedSubscription={selectedSubscription}
              onClose={closeModal}
            />
          )}
        </div>
      </div>
    </div>
  );
}
