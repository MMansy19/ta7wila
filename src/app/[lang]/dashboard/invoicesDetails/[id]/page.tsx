"use client"
import { useTranslation } from "@/context/translation-context";
import { useEffect, useState } from "react";
import getAuthHeaders from "../../Shared/getAuth";
import { Invoice, Params } from "../types";

export default function InvoiceDetails({ params }: { params: Promise<Params> }) {
  const translations = useTranslation();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
      const fetchInvoice = async () => {
      try {
        const { id } = await params;
        const response = await fetch(
          `${apiUrl}/invoices/${id}`, { headers: getAuthHeaders() }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch invoice");
        }
        const data = await response.json();
        if (data.success) {
          setInvoice(data.result);
        } else {
          setError("Unable to retrieve invoice details");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  if (!invoice) {
    return <div>No invoice found</div>;
  }

  return (
    <div className="container">
      <div className="bg-[#1F1F1F] rounded-lg shadow-lg px-8 pt-6 pb-1 mx-auto">
        <div className="flex justify-between mb-2 flex-wrap">
          <div className="flex text-center w-full mt-2">
            <span className={`badge ${invoice.status === 'completed' ? 'bg-green-500' : 'bg-[#F58C7B]'} text-black px-2 py-2 rounded-lg w-full`}>
              {invoice.status === 'completed' ? translations.transactions.status.completed : translations.transactions.status.pending}!
            </span>
          </div>
        </div>

        <div className="flex justify-between mb-4 border-b-2 border-green-200 py-3 flex-wrap">
          <div className="mb-8 w-full sm:w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-green-200">{translations.invoice.billTo}:</h2>
            <div className="text-white mb-2">
              <span className="font-bold">{translations.auth.name}:</span> {invoice.user.name}
            </div>
            <div className="text-white mb-2">
              <span className="font-bold">{translations.auth.email}:</span> {invoice.user.email}
            </div>
            <div className="text-white mb-2">
              <span className="font-bold">{translations.auth.mobile}:</span> {invoice.user.mobile}
            </div>
          </div>

          <div className="text-white text-center sm:text-left space-y-2">
            <div className="font-bold text-xl mb-2 text-green-200">{translations.invoice.title}</div>
            <div className="text-sm">{translations.invoice.number}: {invoice.id}</div>
            <div className="text-sm">{translations.invoice.date}: {invoice.invoice_date}</div>
            <div className="text-sm">{translations.subscription.modal.subscriptionType}: {invoice.subscription_type}</div>
            <div className="text-sm">{translations.invoice.period}: {invoice.subscription_period} {translations.invoice.days}</div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="block lg:hidden mb-4">
          <div className="flex justify-between">
            <span className="text-white">{translations.invoice.amountWithoutFees}:</span>
            <span className="text-white">{invoice.amount_without_fees}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white">{translations.invoice.lateFees}:</span>
            <span className="text-white">{invoice.late_fees}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white">{translations.invoice.developerFees}:</span>
            <span className="text-white">{invoice.developer_fees}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white">{translations.invoice.totalFees}:</span>
            <span className="text-white">{invoice.total_fees}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white">{translations.invoice.subscriptionAmount}:</span>
            <span className="text-white">{invoice.subscription_amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white">{translations.invoice.amountInclFees}:</span>
            <span className="text-white">{invoice.amount_includes_fees}</span>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <table className="w-full text-center mb-8">
            <thead>
              <tr>
                <th className="text-white font-bold uppercase p-2">{translations.invoice.amountWithoutFees}</th>
                <th className="text-white font-bold uppercase p-2">{translations.invoice.lateFees}</th>
                <th className="text-white font-bold uppercase p-2">{translations.invoice.developerFees}</th>
                <th className="text-white font-bold uppercase p-2">{translations.invoice.totalFees}</th>
                <th className="text-white font-bold uppercase p-2">{translations.invoice.subscriptionAmount}</th>
                <th className="text-white font-bold uppercase p-2">{translations.invoice.amountInclFees}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-4 text-white">{invoice.amount_without_fees}</td>
                <td className="py-4 text-white">{invoice.late_fees}</td>
                <td className="py-4 text-white">{invoice.developer_fees}</td>
                <td className="py-4 text-white">{invoice.total_fees}</td>
                <td className="py-4 text-white">{invoice.subscription_amount}</td>
                <td className="py-4 text-white">{invoice.amount_includes_fees}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-2">
          <div className="text-green-200 font-bold text-xl mr-2">{translations.invoice.total}:</div>
          <div className="text-white font-bold text-xl">{invoice.total_amount} {translations.dashboard.cards.currency}</div>
        </div>

        <div className="border-t-2 border-green-200 pt-4 mb-8">
          <div className="mb-6 px-3 text-center text-white mt-5">
            <span>{translations.invoice.deletionDateNote}</span>
            <b className="underline font-bold ml-2">{invoice.invoice_date}</b> {translations.invoice.specifyingNumber}
          </div>

          <div className="mb-6 text-4xl text-center px-3 text-white">
            <span>{translations.invoice.thankYou}</span>
          </div>

          <div className="text-center text-sm px-3 text-white">
            ta7wila@ta7wila.com ∖ www.ta7wila.com
          </div>
        </div>
      </div>
    </div>
  );
}
