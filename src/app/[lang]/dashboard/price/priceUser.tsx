"use client";
import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import { useEffect, useState } from "react";
import getAuthHeaders from "../Shared/getAuth";
import { Plan } from "./types";
import Link from "next/link";
import Plans from "../plans/page";

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
        console.error("Error fetching data:", error);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#1F1F1F] rounded-[33px] py-8">
        <div className="text-center mb-12">
          <h4 className="text-2xl font-extrabold text-white sm:text-3xl">
            {translations.price.yourSubscription}
          </h4>
        </div>
        <div className="grid grid-cols-3 grid-rows-1 gap-4 mb-6">
          <div className="col-span-2">
            <div className="bg-[#444444] rounded-[33px] shadow-4xl p-8  text-white mb-8">
              <h3 className="text-2xl font-bold mb-4">
                {translations.price.subscriptionCosts}
              </h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold">
                  ${currentPlan.amount}
                </span>
                <span className="text-lg opacity-80">
                  {translations.price.perMonth}
                </span>
              </div>
              <p className="text-lg text-[#D9D9D9] font-bold px-5 py-4 mb-6">
                {translations.price.paymentWarning}
              </p>
              <p className="text-[#F58C7B] text-lg font-bold px-5 py-2 mb-6">
                {translations.price.suspensionWarning}
              </p>
              <button className="w-full py-3 bg-[#53B4AB] text-black rounded-xl font-semibold hover:bg-opacity-90 transition">
                {translations.price.payNow}
              </button>
            </div>
          </div>

          <div className="col-start-3">
            <div className="bg-[#53B4AB] rounded-[33px] shadow-4xl p-8 text-black min-h-[400px]">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-4">
                  {translations.price.yourPlan}
                </h3>
                <ul className="space-y-6 text-black mb-8 min-h-[200px] flex flex-col justify-center ">
                  <li className="flex items-center text-xl">
                    <svg
                      className="h-6 w-6 text-white mr-2"
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
                    <span className="font-bold">
                      {currentPlan.applications_count} /{" "}
                      {currentPlan.max_applications_count}{" "}
                      {translations.price.applications}
                    </span>
                   
                  </li>
                  <li className="flex items-center text-xl">
                    <svg
                      className="h-6 w-6 text-white mr-2"
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
                    <span className="font-bold">
                      {currentPlan.employees_count} /{" "}
                      {currentPlan.max_employees_count}{" "}
                      {translations.price.employees}
                    </span>
                  </li>
                  <li className="flex items-center text-xl">
                    <svg
                      className="h-6 w-6 text-white mr-2"
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

                    <span className="font-bold">
                      {currentPlan.vendors_count} /{" "}
                      {currentPlan.max_vendors_count}{" "}
                      {translations.price.vendors}
                    </span>
                  </li>
                </ul>
              </div>

              <Link href={"/dashboard/plans"}>
                <button className="w-full py-3 bg-white text-[#398c84] rounded-xl font-bold hover:bg-opacity-90 transition">
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
