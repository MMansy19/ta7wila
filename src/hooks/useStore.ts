// useStores.ts
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import getAuthHeaders from "../app/[lang]/dashboard/Shared/getAuth";

export default function useStores() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(`${apiUrl}/applications`, {
          headers: getAuthHeaders(),
        });
        setStores(response.data.result.data.map((item: any) => ({
          id: item.id,
          name: item.name,
        })));
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch stores");
        toast.error("Failed to fetch stores");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [apiUrl]);

  return { stores, loading, error };
}