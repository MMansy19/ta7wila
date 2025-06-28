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

  if (isLoading || !resolvedParams) {
    return <div>{translations.storeDetails.loading}</div>;
  }

  if (error || !storeDetails) {
    return <div>{translations.storeDetails.error}</div>;
  }

  return (
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
  );
}