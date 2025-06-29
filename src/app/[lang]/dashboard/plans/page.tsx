"use client";
import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";
import { Plan } from "../price/types";
import useCurrency from "../Shared/useCurrency";
export const dynamic = 'force-dynamic';

export default function Plans() {
  const translations = useTranslation();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [subscribingPlanId, setSubscribingPlanId] = useState<number | null>(
    null
  );
  const [plans, setPlans] = useState<Plan[]>([]);
  const router = useRouter();
  const formatCurrency = useCurrency();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansResponse = await axios.get(`${apiUrl}/plans`, {
          headers: getAuthHeaders(),
        });

        const sortedPlans = plansResponse.data.result.data.sort(
          (a: Plan, b: Plan) => a.id - b.id
        );
        setPlans(sortedPlans);
        console.log(plansResponse);
      } catch (error) {
        console.error(" fetching data:", error);
      }
    };

    fetchData();
  }, [apiUrl]);

  const handleSubscribe = async (planId: number) => {
    setSubscribingPlanId(planId);
    try {
      const response = await axios.post(
        `${apiUrl}/subscriptions/${planId}/subscribe`,
        {},
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      if (response.data.success == true) {
        console.log(response.data);
        const iframeUrl = response.data.result.redirect_iframe_url;
        const url = new URL(iframeUrl);
        const params = {
          amount: url.searchParams.get("amount") || "",
          ref_id: url.searchParams.get("ref_id") || "",
          name: url.searchParams.get("name") || "",
        };

        router.push(
          `/dashboard/payment-confirmation?${new URLSearchParams(params).toString()}`
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.errorMessage || "An error occurred");
    } finally {
      setSubscribingPlanId(null);
    }
  };
  return (
    <section className="py-8">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 bg-[#1F1F1F] rounded-xl py-8  ">
        <Toaster position="top-right" reverseOrder={false} />

        <div className="text-center mb-12">
          <h4 className="text-2xl font-extrabold text-white sm:text-3xl">
            {translations.plans.title}
          </h4>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-[#444444] rounded-xl shadow-4xl p-8  text-white"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-4">{plan.title}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold">
                    {formatCurrency(plan.amount)}
                  </span>
                  <span className="text-lg opacity-80">
                    {translations.plans.perMonth}
                  </span>
                </div>
                <p className="text-lg mb-6">{plan.subtitle}</p>

                <div className="space-y-3 mb-8">
                  <ul className={`space-y-4  text-white mb-8`}>
                    <li className="flex items-center">
                      <svg
                        className="h-6 w-6 text-[#53B4AB] mr-2"
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
                        {plan.applications_count}{" "}
                        {translations.plans.applications}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-6 w-6 text-[#53B4AB] mr-2"
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
                        {plan.employees_count} {translations.plans.Employees}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-6 w-6 text-[#53B4AB] mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 24 24"
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
                        {plan.vendors_count} {translations.plans.Vendors}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                className={`w-full py-3 px-6 text-center rounded-lg font-bold
                 
                     bg-[#53B4AB] text-black
                      hover:opacity-90 transition-opacity`}
                onClick={() => handleSubscribe(plan.id)}
                disabled={subscribingPlanId === plan.id}
              >
                {subscribingPlanId === plan.id
                  ? translations.plans.processing
                  : translations.plans.getStarted}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
