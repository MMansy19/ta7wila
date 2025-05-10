"use client";

import LastTranaction from "@/components/[lang]/lasttransaction";
import { useProfile } from "@/context/ProfileContext";
import { useTranslation } from "@/context/translation-context";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import TransactionAnalysisChart from "./analytics/TransactionAnalysisChart";
import DashboardCards from "./cardData";
import getAuthHeaders from "./Shared/getAuth";

export default function Main() {
  const translations = useTranslation();
  const { profile } = useProfile();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");

  const {
    data: analyticsData = {
      data: [],
      timeframe: "weekly",
      period: "current",
      dateRange: {
        start: new Date().toISOString(),
        end: new Date().toISOString(),
      },
    },
  } = useQuery({
    queryKey: ["transactionAnalytics", period],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${apiUrl}/transactions/analysis?period=${period}&timeframe=year`,
          {
            headers: getAuthHeaders(),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch analytics data");
        }
        if (data.success) {
          return data;
        }
        return null;
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        return null;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div className="min-h-screen text-white">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col flex-1">
            <div className="flex flex-col flex-1 mb-2 shrink self-stretch leading-tight basis-0 max-md:max-w-full text-white">
              <div className="text-xl bg-gradient-to-r from-white via-black text-transparent bg-clip-text">
                {translations.dashboard.welcome}
              </div>
              <div className="mt-1.5 text-3xl font-medium max-md:max-w-full">
                {profile?.name ? (
                  <>
                    {profile.name.split(" ")[0]}{" "}
                    <span className="bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500 text-transparent bg-clip-text capitalize">
                      {profile?.name.split(" ")[1] || ""}
                    </span>
                  </>
                ) : (
                  "User"
                )}
              </div>
              <div className="mt-1.5 text-lg text-stone-500 max-md:max-w-full">
                {translations.dashboard.greeting}
              </div>
            </div>
          </div>
        </div>
        <DashboardCards />
      </div>{" "}
      <div className="mb-6">
        <TransactionAnalysisChart
          data={analyticsData?.data || []}
          timeframe={period}
          period={analyticsData?.period || "current"}
          dateRange={{
            start: analyticsData?.dateRange?.start || new Date().toISOString(),
            end: analyticsData?.dateRange?.end || new Date().toISOString(),
          }}
          setPeriod={setPeriod}
        />
      </div>
      <LastTranaction />
    </div>
  );
}
