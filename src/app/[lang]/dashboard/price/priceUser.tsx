"use client";
import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Plans from "../plans/page";
import getAuthHeaders from "../Shared/getAuth";
import { Plan } from "./types";

export default function PriceUser() {
  const translations = useTranslation();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subscriptionResponse = await axios.get(
          `${apiUrl}/subscriptions/me`,
          { headers: getAuthHeaders() }
        );

        if (subscriptionResponse.data.success) {
          setCurrentPlan(subscriptionResponse.data.result);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 422 && 
            error.response?.data?.errorMessage === "Subscription not found") {
          setCurrentPlan(null);
        } else {
          console.error("Error fetching subscription data:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  if (isLoading) {
    return <div>{translations.price.loading}</div>;
  }

  return (
    <>
      {currentPlan ? (
        <SubscriptionDetails currentPlan={currentPlan} />
      ) : (
        <Plans />
      )}
    </>
  );
}

function SubscriptionDetails({ currentPlan }: { currentPlan: Plan }) {
  const translations = useTranslation();

  return (
    <section className="py-8">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h4 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
            {translations.price.yourSubscription}
          </h4>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-[#1F1F1F] rounded-xl shadow-4xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">
                  {translations.price.subscriptionCosts}
                </h3>
                <span className="px-4 py-2 bg-[#53B4AB] bg-opacity-20 text-[#53B4AB] rounded-full text-sm font-semibold">
                  Active
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold">
                  {currentPlan.amount} {translations.dashboard.cards.currency}
                </span>
                <span className="text-lg text-gray-400">
                  {translations.price.perMonth}
                </span>
              </div>
              <div className="space-y-4">
                <div className="bg-[#2A2A2A] rounded-lg p-4">
                  <p className="text-[#D9D9D9] font-medium">
                    {translations.price.paymentWarning}
                  </p>
                </div>
                <div className="bg-[#2A2A2A] rounded-lg p-4 border-l-4 border-[#F58C7B]">
                  <p className="text-[#F58C7B] font-medium">
                    {translations.price.suspensionWarning}
                  </p>
                </div>
              </div>
              <button className="w-full mt-6 py-4 bg-[#53B4AB] text-black rounded-xl font-semibold hover:bg-opacity-90 transition-all duration-300 transform hover:scale-[1.02]">
                {translations.price.payNow}
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#53B4AB] rounded-xl shadow-4xl p-8 text-black h-full">
              <h3 className="text-2xl font-bold mb-6">
                {translations.price.yourPlan}
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black bg-opacity-20 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {currentPlan.applications_count} / {currentPlan.max_applications_count}
                    </p>
                    <p className="text-sm opacity-80">{translations.price.applications}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black bg-opacity-20 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {currentPlan.employees_count} / {currentPlan.max_employees_count}
                    </p>
                    <p className="text-sm opacity-80">{translations.price.employees}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black bg-opacity-20 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {currentPlan.vendors_count} / {currentPlan.max_vendors_count}
                    </p>
                    <p className="text-sm opacity-80">{translations.price.vendors}</p>
                  </div>
                </div>
              </div>
              <Link href={"/dashboard/plans"} className="block mt-12">
                <button className="w-full py-3 bg-white text-[#398c84] rounded-xl font-semibold hover:bg-opacity-90 transition-all duration-300 transform hover:scale-[1.02]">
                  {translations.price.change}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
