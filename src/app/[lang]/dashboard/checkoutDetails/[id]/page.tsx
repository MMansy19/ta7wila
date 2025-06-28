"use client";

import { useTranslation } from '@/hooks/useTranslation';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import getAuthHeaders from "../../Shared/getAuth";
import { type CheckoutDetails, Params } from "../types";
import useCurrency from "../../Shared/useCurrency";
import { use, useEffect } from "react";
export const dynamic = 'force-dynamic';

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CheckoutDetails({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = use(params);
  const translations = useTranslation();
  const formatCurrency = useCurrency();
  async function fetchCheckoutDetails(): Promise<CheckoutDetails> {
    const response = await axios.get(`${apiUrl}/checkouts/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data.result || {};
  }

  const { data: checkout, error, isLoading } = useQuery<CheckoutDetails, Error>({
    queryKey: ["checkoutDetails", id],
    queryFn: () => fetchCheckoutDetails(),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (error) {
      toast.error("Error fetching checkout details!");
    }
  }, [error]);

  if (isLoading) {
    return <div className="text-white text-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-white text-center p-8">Error loading checkout details.</div>;
  }

  if (!checkout) {
    return <div className="text-white text-center p-8">No checkout data found.</div>;
  }

  return (
    <div className="container">
      <div className="bg-[#1F1F1F] rounded-lg shadow-lg px-8 pt-6 pb-1 mx-auto min-h-[calc(100vh-77px)]">
        <div className="flex text-center w-full mt-2">
          <span
            className={`badge ${checkout.status === "paid" ? "bg-green-500" : "bg-[#F58C7B]"} text-black px-2 py-2 rounded-lg w-full`}
          >
            {checkout.status.charAt(0).toUpperCase() + checkout.status.slice(1)}{" "}
            !
          </span>
        </div>

        <div className="flex justify-between mb-4 border-b-2 border-green-200 py-3 flex-wrap">
          <div className="mb-8 w-full sm:w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-green-200">
              {translations.checkout.details.storeInfo}
            </h2>
            <div className="text-white mb-2">
              <strong>{translations.checkout.details.labels.name}</strong>{" "}
              {checkout.application.name}
            </div>
            <div className="text-white mb-2">
              <strong>{translations.checkout.details.labels.email}</strong>{" "}
              {checkout.application.email}
            </div>
            <div className="text-white mb-2">
              <strong>{translations.checkout.details.labels.mobile}</strong>{" "}
              <span
                style={{
                  direction: "ltr",
                  textAlign: "left",
                  display: "inline-block",
                }}
              >
                {checkout.application.mobile}
              </span>
            </div>
          </div>

          <div className="mb-8 w-full sm:w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-green-200">
              {translations.checkout.details.personalInfo}
            </h2>
            <div className="text-white mb-2">
              <strong>{translations.checkout.details.labels.name}</strong>{" "}
              {checkout.customer.name}
            </div>
            <div className="text-white mb-2">
              <strong>{translations.checkout.details.labels.email}</strong>{" "}
              {checkout.customer.email}
            </div>
            <div className="text-white mb-2">
              <strong>{translations.checkout.details.labels.mobile}</strong>{" "}
              <span
                style={{
                  direction: "ltr",
                  textAlign: "left",
                  display: "inline-block",
                }}
              > 
              {checkout.customer.mobile}
              </span>
            </div>
          </div>
        </div>

        <div className="block lg:hidden mb-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-white">
              {translations.checkout.details.paymentDetails.id} :
            </span>
            <span className="text-white">{checkout.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white">
              {translations.checkout.details.paymentDetails.refId} :
            </span>
            <span className="text-white">{checkout.ref_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white">
              {translations.checkout.details.paymentDetails.itemId} :
            </span>
            <span className="text-white">{checkout.item_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white">
              {translations.checkout.details.paymentDetails.paidAt} :
            </span>
            <span className="text-white">
              {checkout.paid_at
                ? new Date(checkout.paid_at).toLocaleString()
                : "--"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white">
              {translations.checkout.details.paymentDetails.createdAt} :
            </span>
            <span className="text-white">
              {checkout.created_at
                ? new Date(checkout.created_at).toLocaleString()
                : "--"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white">
              {translations.checkout.details.paymentDetails.updatedAt} :
            </span>
            <span className="text-white">
              {checkout.updated_at
                ? new Date(checkout.updated_at).toLocaleString()
                : "--"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white">
              {translations.checkout.details.paymentDetails.amount}  :
            </span>
            <span className="text-white">{formatCurrency(checkout.amount)} </span>
          </div>
        </div>

        <div className="overflow-x-auto hidden lg:block">
          <table className="w-full text-center mb-8">
            <thead>
              <tr>
                <th className="text-white font-bold uppercase p-2">
                  {translations.checkout.details.paymentDetails.id}
                </th>
                <th className="text-white font-bold uppercase p-2">
                  {translations.checkout.details.paymentDetails.refId}
                </th>
                <th className="text-white font-bold uppercase p-2">
                  {translations.checkout.details.paymentDetails.itemId}
                </th>
                <th className="text-white font-bold uppercase p-2">
                  {translations.checkout.details.paymentDetails.paidAt}
                </th>
                <th className="text-white font-bold uppercase p-2">
                  {translations.checkout.details.paymentDetails.createdAt}
                </th>
                <th className="text-white font-bold uppercase p-2">
                  {translations.checkout.details.paymentDetails.updatedAt}
                </th>
                <th className="text-white font-bold uppercase p-2">
                  {translations.checkout.details.paymentDetails.amount}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-4 text-white">{checkout.id}</td>
                <td className="py-4 text-white">{checkout.ref_id}</td>
                <td className="py-4 text-white">{checkout.item_id}</td>
                <td className="py-4 text-white">
                  {checkout.paid_at
                    ? new Date(checkout.paid_at).toLocaleString()
                    : "--"}
                </td>
                <td className="py-4 text-white">
                  {checkout.created_at
                    ? new Date(checkout.created_at).toLocaleString()
                    : "--"}
                </td>
                <td className="py-4 text-white">
                  {checkout.updated_at
                    ? new Date(checkout.updated_at).toLocaleString()
                    : "--"}
                </td>
                <td className="py-4 text-white">
                {formatCurrency(checkout.amount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="border-t-2 border-green-200 pt-4 mb-8">
          {checkout.status === "paid" ? (
            <div>
              <div className="mb-6 px-3 text-center text-white mt-5">
                <span>{translations.checkout.details.invoice.paid}</span>
                <b className="underline font-bold ml-2">
                  {translations.checkout.details.invoice.specifyNumber}
                </b>
              </div>

              <div className="mb-6 text-4xl text-center px-3 text-white">
                <span>{translations.checkout.details.invoice.thankYou}</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6 px-3 text-center text-white mt-5">
                <span>{translations.checkout.details.invoice.notPaid}</span>
              </div>

              <div className="mb-6  text-center justify-center px-3 text-white">
                <Link
                  href={checkout.redirect_frame_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#53B4AB] p-2 px-4 hover:bg-[#489f97] rounded-lg text-center text-black font-semibold"
                >
                  {translations.checkout.details.invoice.payNow}
                </Link>
              </div>
            </div>
          )}

          <div className="text-center text-sm px-3 text-white">
            {translations.checkout.details.contact}
          </div>
        </div>
      </div>
    </div>
  );
}
