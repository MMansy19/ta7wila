"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import getAuthHeaders from "../Shared/getAuth";
import { UserInfoClient } from "./components/UserInfoClient";
export const dynamic = 'force-dynamic';

export default function UserInfoPage() {
  const [userData, setUserData] = useState<any>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [transactionsData, setTransactionsData] = useState<any>({ data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = await getAuthHeaders();
        
        // Fetch user data
        
        const userResponse = await axios.get("/api/users/me", { headers });
        setUserData(userResponse.data);

        // Fetch subscription data

        const subscriptionResponse = await axios.get("/api/subscriptions/current", { headers });
        setSubscriptionData(subscriptionResponse.data);

        // Fetch transactions data

        const transactionsResponse = await axios.get("/api/transactions", { headers });
        setTransactionsData(transactionsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#53B4AB]"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        Error loading user data
      </div>
    );
  }

  return (
    <UserInfoClient 
      user={userData} 
      subscription={subscriptionData} 
      transactions={transactionsData}
    />
  );
}