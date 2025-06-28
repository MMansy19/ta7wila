"use client";

import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { useEffect, useState } from "react";
import getAuthHeaders from "../Shared/getAuth";
import TransactionAnalysisChart from "./TransactionAnalysisChart";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function TransactionAnalysis() {
  const translations = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");

  useEffect(() => {
    async function fetchAnalysisData() {
      try {
        const response = await axios.get(
          `${apiUrl}/transactions/analysis?period=${period}&timeframe=year`,
          { headers: getAuthHeaders() }
        );
        if (response.data.success) {
          setAnalysisData(response.data);
        } else {
          setError("Failed to fetch analysis data");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalysisData();
  }, [period]);

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!analysisData) return <div className="text-white">No data available</div>;

  return (
    <div className="container mx-auto p-2 space-y-6">
      <div className="bg-neutral-900 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">
            {translations.transactions.analysis.title}
          </h1>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as "weekly" | "monthly")}
            className="bg-neutral-800 text-white px-3 py-1 rounded-lg border border-neutral-700"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <TransactionAnalysisChart
          data={analysisData?.data || []}
          timeframe={period}
          period={analysisData?.period || "current"}
          dateRange={{
            start: analysisData?.dateRange?.start || new Date().toISOString(),
            end: analysisData?.dateRange?.end || new Date().toISOString(),
          }}
          setPeriod={setPeriod}
        />
      </div>
    </div>
  );
}
