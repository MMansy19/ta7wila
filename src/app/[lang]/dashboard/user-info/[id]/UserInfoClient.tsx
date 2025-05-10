"use client";

import { useTranslation } from "@/context/translation-context";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import getAuthHeaders from "../../Shared/getAuth";
import useCurrency from "../../Shared/useCurrency";
import { AccountInfo } from "../components/AccountInfo";
import { ApplicationsTable } from "../components/ApplicationsTable";
import { SubscriptionInfo } from "../components/SubscriptionInfo";
import { TransactionsTable } from "../components/TransactionsTable";
import { UserStatusInfo } from "../components/UserStatusInfo";
import { Application, UserData } from "../types";

const defaultPaymentOptions = [
  { name: "VF- CASH", key: "vcash", img: "/vcash.svg" },
  { name: "Et- CASH", key: "ecash", img: "/ecash.svg" },
  { name: "WE- CASH", key: "wecash", img: "/wecash.svg" },
  { name: "OR- CASH", key: "ocash", img: "/ocash.svg" },
  { name: "INSTAPAY", key: "instapay", img: "/instapay.svg" },
];

export default function UserInfoClient({ id }: { id: string }) {
  const translations = useTranslation();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const formatCurrency = useCurrency();

  async function fetchUserInfo() {
    const response = await axios.get(`${apiUrl}/users/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data.result || {};
  }

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<UserData & { applications: Application[] }, Error>({
    queryKey: ["user-info", id],
    queryFn: fetchUserInfo,
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user information</div>;
  if (!user) return <div>No data found</div>;

  return (
    <div className="container mx-auto p-2 space-y-6 text-white">
      <div className="flex items-center justify-between bg-neutral-900 rounded-xl p-6 ">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold">{user.user.name}</h2>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 
                  transition-all ${
                    user.user.status === "active"
                      ? "bg-green-400/20 text-green-300 border border-green-400/30 hover:bg-green-400/25"
                      : "bg-red-400/20 text-red-300 border border-red-400/30 hover:bg-red-400/25"
                  }`}
              >
                {user.user.status === "active" && (
                  <span className="w-2.5 h-2.5 bg-green-300 rounded-full animate-pulse" />
                )}
                {user.user.status === "active"
                  ? translations.userInfo.status.active
                  : translations.userInfo.status.inactive}
              </span>

              <span
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium 
                  bg-blue-400/20 text-blue-300 border border-blue-400/30 hover:bg-blue-400/25 
                  transition-all gap-2"
              >
                {user.user.user_type === "user"
                  ? translations.users.status.active
                  : translations.auth.userName}
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <div className="group flex items-center gap-3 p-2.5">
              <div className="w-8 h-8 flex items-center justify-center bg-purple-400/20 rounded-lg group-hover:bg-purple-400/30 transition-colors">
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-purple-300/80 group-hover:text-purple-200" />
              </div>
              <span className="text-neutral-300 font-medium tracking-wide">
                {user.user.email}
              </span>
            </div>

            <div className="group flex items-center gap-3 p-2.5">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-400/20 rounded-lg group-hover:bg-blue-400/30 transition-colors">
                <FontAwesomeIcon icon={faPhone} className="w-4 h-4 text-blue-300/80 group-hover:text-blue-200" />
              </div>
              <span className="text-neutral-300 font-medium tracking-wide"  style={{
                          direction: "ltr",
                          textAlign: "left",
                          display: "inline-block",
                        }}>
                {user.user.mobile}
              </span>
            </div>
          </div>
        </div>
      </div>

      <UserStatusInfo user={user.user} translations={translations} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AccountInfo user={user.user} translations={translations} />
        <SubscriptionInfo 
          subscription={user.subscription} 
          translations={translations}
          formatCurrency={formatCurrency}
        />
      </div>

      {user.applications && (
        <ApplicationsTable 
          applications={user.applications}
          translations={translations}
        />
      )}

      <TransactionsTable 
        transactions={user.transactions}
        translations={translations}
        formatCurrency={formatCurrency}
        defaultPaymentOptions={defaultPaymentOptions}
      />

     
    </div>
  );
}
