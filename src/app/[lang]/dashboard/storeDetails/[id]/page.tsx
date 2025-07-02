"use client";
import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import getAuthHeaders from "../../Shared/getAuth";
import Employees from "../employees";
import Payments from "../payments";
import Table from "../table";
import { Params } from "../types";
export const dynamic = 'force-dynamic';

export default function StoreDetails({ params }: { params: Promise<Params> }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [storeDetails, setStoreDetails] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const translations = useTranslation();
  const [resolvedParams, setResolvedParams] = useState<Params | null>(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);

  // Resolve the params Promise
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolved = await params;
        setResolvedParams(resolved);
      } catch (err) {
        setError(err as Error);
      }
    };
    
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchData = async () => {
      const { id } = resolvedParams;
      try {
        const response = await axios.get(
          `${apiUrl}/applications/${id}`,
          {
            headers: {
              ...getAuthHeaders(),
            },
          }
        );
        setStoreDetails(response.data.result || {});
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, [resolvedParams, apiUrl]);

  useEffect(() => {
    if (error) {
      toast.error("Error fetching transactions!");
    }
  }, [error]);

  const copyPaymentLink = () => {
    if (!resolvedParams || !storeDetails) return;
    
    const { id, lang } = resolvedParams;
    const baseUrl = window.location.origin;
    const paymentLink = `${baseUrl}/${lang}/public-payment/${id}`;
    
    navigator.clipboard.writeText(paymentLink);
    toast.success(translations.storeDetails.paymentLinkCopied || "Payment link copied to clipboard!");
  };

  const openWhatsAppModal = () => {
    if (!storeDetails?.mobile) {
      toast.error("Store phone number not available");
      return;
    }
    setShowWhatsAppModal(true);
    
    // Set default message
    const { id, lang } = resolvedParams || {};
    const baseUrl = window.location.origin; 
    const paymentLink = `${baseUrl}/${lang}/public-payment/${id}`;
    setMessage(`${translations.storeDetails?.whatsappMessage || "Here's the payment link:"} ${paymentLink}`);
  };

  const sendWhatsAppMessage = async () => {
    if (!phoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSendingWhatsApp(true);

    try {
      // Format phone number (remove any non-digit characters)
      const formattedNumber = phoneNumber.replace(/\D/g, '');
      
      // Create WhatsApp Web URL
      const whatsappWebUrl = `https://web.whatsapp.com/send?phone=${formattedNumber}&text=${encodeURIComponent(message.trim())}`;
      
      // Open WhatsApp Web in a popup window (background)
      const popup = window.open(
        whatsappWebUrl,
        'whatsapp-popup',
        'width=800,height=600,scrollbars=yes,resizable=yes,status=no,location=no,toolbar=no,menubar=no'
      );
      
      if (popup) {
        // Minimize the popup by moving it off-screen or to background
        popup.blur();
        window.focus();
        
        toast.success("WhatsApp Web opened in background! Complete sending the message there.");
        
        // Close the modal
        setShowWhatsAppModal(false);
        setPhoneNumber("");
        setMessage("");
      } else {
        toast.error("Please allow popups for this site to use WhatsApp Web");
      }

    } catch (error: any) {
      console.error("WhatsApp open error:", error);
      toast.error("Failed to open WhatsApp Web");
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  if (isLoading || !resolvedParams) {
    return <div>{translations.storeDetails.loading}</div>;
  }

  if (error || !storeDetails) {
    return <div>{translations.storeDetails.error}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Payment Link Section */}
      <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between lg:flex-row flex-col gap-4">
          <div>
            <h3 className="font-semibold text-xl text-white mb-2">
              {translations.storeDetails.publicPaymentLink || "Public Payment Link"}
            </h3>
            <p className="text-gray-400 text-sm">
              {translations.storeDetails.sharePaymentLink || "Share this link with customers to allow them to make payments directly"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyPaymentLink}
              className="flex items-center gap-2 px-4 py-2 bg-[#53B4AB] hover:bg-[#347871] text-black rounded-lg font-semibold transition-colors duration-200"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 6L17 14C17 16.2091 15.2091 18 13 18H7M17 6C17 3.79086 15.2091 2 13 2L10.6569 2C9.59599 2 8.57857 2.42143 7.82843 3.17157L4.17157 6.82843C3.42143 7.57857 3 8.59599 3 9.65685L3 14C3 16.2091 4.79086 18 7 18M17 6C19.2091 6 21 7.79086 21 10V18C21 20.2091 19.2091 22 17 22H11C8.79086 22 7 20.2091 7 18M9 2L9 4C9 6.20914 7.20914 8 5 8L3 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              {translations.storeDetails.copyPaymentLink || "Copy Payment Link"}
            </button>
            
            <button
              onClick={openWhatsAppModal}
              className="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-lg font-semibold transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              {translations.storeDetails?.shareViaWhatsApp || "Share via WhatsApp"}
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1E1E1E] rounded-xl p-6 w-full max-w-md">
            <h3 className="font-semibold text-xl text-white mb-4">
              Send WhatsApp Message
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Recipient Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 201234567890"
                  className="w-full px-4 py-2 bg-[#2D2D2D] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Include country code (e.g., 20 for Egypt)
                </p>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-[#2D2D2D] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowWhatsAppModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={sendWhatsAppMessage}
                  disabled={isSendingWhatsApp}
                  className="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#1DA851] disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold"
                >
                  {isSendingWhatsApp ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Existing Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 md:grid-rows-5 gap-4">
        <div className="md:col-span-2 md:row-span-1">
          <Payments payments={storeDetails.payments || []} />
        </div>
        
        <div className="md:col-span-2 md:row-span-1 md:col-start-1 md:row-start-2">
          <Employees employees={storeDetails.application_employees || []} params={resolvedParams} />
        </div>
        
        <div className="md:col-span-3 md:row-span-5 md:col-start-3 md:row-start-1">
          <Table params={resolvedParams} />
        </div>
      </div>
    </div>
  );
}