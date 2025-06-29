"use client";
import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import getAuthHeaders from "../../Shared/getAuth";
import Employees from "../employees";
import Payments from "../payments";
import Table from "../table";
import { Params } from "../types";
export const dynamic = 'force-dynamic';

export default function StoreDetails({ params }: { params: Promise<Params> }) {
  
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [storeDetails, setStoreDetails] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const translations = useTranslation();
  const [resolvedParams, setResolvedParams] = useState<Params | null>(null);

  // Resolve the params Promise
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolved = await params;
        setResolvedParams(resolved);
      } catch (err) {
        setError(err as Error);
      }
    };
    
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchData = async () => {
      const { id } = resolvedParams;
      try {
        const response = await axios.get(
          `${apiUrl}/applications/${id}`,
          {
            headers: {
              ...getAuthHeaders(),
            },
          }
        );
        setStoreDetails(response.data.result || {});
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, [resolvedParams, apiUrl]);

  useEffect(() => {
    if (error) {
      toast.error("Error fetching transactions!");
    }
  }, [error]);

  const copyPaymentLink = () => {
    if (!resolvedParams || !storeDetails) return;
    
    const { id, lang } = resolvedParams;
    const baseUrl = window.location.origin;
    
    const paymentLink = `${baseUrl}/${lang}/public-payment/${id}`;
    
    navigator.clipboard.writeText(paymentLink);
    toast.success(translations.storeDetails.paymentLinkCopied || "Payment link copied to clipboard!");
  };

  if (isLoading || !resolvedParams) {
    return <div>{translations.storeDetails.loading}</div>;
  }

  if (error || !storeDetails) {
    return <div>{translations.storeDetails.error}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Payment Link Section */}
      <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-xl text-white mb-2">
              {translations.storeDetails.publicPaymentLink || "Public Payment Link"}
            </h3>
            <p className="text-gray-400 text-sm">
              {translations.storeDetails.sharePaymentLink || "Share this link with customers to allow them to make payments directly"}
            </p>
          </div>
          <button
            onClick={copyPaymentLink}
            className="flex items-center gap-2 px-4 py-2 bg-[#53B4AB] hover:bg-[#347871] text-black rounded-lg font-semibold transition-colors duration-200"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 6L17 14C17 16.2091 15.2091 18 13 18H7M17 6C17 3.79086 15.2091 2 13 2L10.6569 2C9.59599 2 8.57857 2.42143 7.82843 3.17157L4.17157 6.82843C3.42143 7.57857 3 8.59599 3 9.65685L3 14C3 16.2091 4.79086 18 7 18M17 6C19.2091 6 21 7.79086 21 10V18C21 20.2091 19.2091 22 17 22H11C8.79086 22 7 20.2091 7 18M9 2L9 4C9 6.20914 7.20914 8 5 8L3 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            {translations.storeDetails.copyPaymentLink || "Copy Payment Link"}
          </button>
        </div>
      </div>

      {/* Existing Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 md:grid-rows-5 gap-4">
        <div className="md:col-span-2 md:row-span-1">
          <Payments payments={storeDetails.payments || []} />
        </div>
        
        <div className="md:col-span-2 md:row-span-1 md:col-start-1 md:row-start-2">
          <Employees employees={storeDetails.application_employees || []} params={resolvedParams} />
        </div>
        
        <div className="md:col-span-3 md:row-span-5 md:col-start-3 md:row-start-1">
          <Table params={resolvedParams} />
        </div>
      </div>
    </div>
  );
}