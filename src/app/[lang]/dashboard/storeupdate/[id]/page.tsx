"use client";
import { useTranslation } from "@/context/translation-context";
import useForm from "@/hooks/form";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../../Shared/getAuth";
import UploadLogo from "../logoUpload";
import { Params, Store } from "../types";



export default function StoreUpdate({ params }: { params: Promise<Params> }) {
  const translations = useTranslation();
  const [isUpdatingSubdomain, setIsUpdatingSubdomain] = useState(false);
  const [isCheckingWebhook, setIsCheckingWebhook] = useState(false);
  const [isUpdatingWebhook, setIsUpdatingWebhook] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [webhookId, setWebhookId] = useState<number | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [resolvedParams, setResolvedParams] = useState<Params | null>(null);

  const { formData, handleChange, setFormData } = useForm<Store>({
    id:0,
    name: "",
    apiUrl: "",
    email: "",
    mobileWallet: "",
    website:"",
    subdomain: "",
    Logo: "",
  });
  

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^(?:\+2)?(010|011|012|015)[0-9]{8}$/.test(phone);
  const isValidSubdomain = (subdomain: string) => /^[a-zA-Z0-9]+$/.test(subdomain);
  
  // Resolve the params Promise
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolved = await params;
        setResolvedParams(resolved);
      } catch (err) {
        toast.error("Error resolving parameters");
      }
    };
    
    resolveParams();
  }, [params]);
  
  const handleSubdomainUpdate = async () => {
    if (!isValidSubdomain(formData.subdomain)) {
      toast.error("Invalid subdomain format.");
      return;
    }

    if (!resolvedParams) return;
    
    setIsUpdatingSubdomain(true);
    try {
      const { id } = resolvedParams;
      const response = await axios.post(
        `${apiUrl}/applications/update-subdomain`,
        JSON.stringify({ id: id, subdomain: formData.subdomain }),
        { headers: getAuthHeaders() }
      );
      if (response.status === 200) {
        toast.success("Subdomain updated successfully!");
        setStores(prevStores =>
          prevStores.map(store =>
            store.id === Number(id) 
              ? { ...store, subdomain: formData.subdomain }
              : store
          )
        );
      } else {
        toast.error(`Failed to update subdomain: ${response.data.errorMessage}`);
      }
    } catch (error: any) {
      toast.error("An error occurred while updating the subdomain.");
    } finally {
      setIsUpdatingSubdomain(false);
    }
  };
  const fetchStoreDetails = useCallback(async () => {
    if (!resolvedParams) return;
    
    try {
      const { id } = resolvedParams;
      const { data } = await axios.get(`${apiUrl}/applications/${id}`, {
        headers: getAuthHeaders(),
      });
      const store = {
        id: Number(id),
        name: data.result.name || "",
        apiUrl: data.result.webhook?.value || "",
        email: data.result.email || "",
        mobileWallet: data.result.mobile || "",
        subdomain: data.result.subdomain || "",
        webhookId: data.result.webhook?.id || null,
        website:data.result.website || "",
        Logo: data.result.logo || null,
      };

      setFormData({
        id: store.id,
        name: store.name,
        apiUrl: store.apiUrl,
        email: store.email,
        mobileWallet: store.mobileWallet,
        website : store.website,
        subdomain: store.subdomain,
        Logo: store.Logo
      });
      
      setWebhookId(data.result.webhook?.id || null);

      setStores(prevStores => [...prevStores.filter(s => s.id !== store.id), store]);
    } catch (error) {
      toast.error("Failed to fetch store details.");
    }
  }, [apiUrl, resolvedParams]);

  useEffect(() => {
    if (resolvedParams) {
      fetchStoreDetails();
    }
  }, [resolvedParams, fetchStoreDetails]); 
  


  const handleWebhookCheck = async () => {
    if (!formData.apiUrl) {
      toast.error("Please enter a valid Webhook URL.");
      return;
    }
    setIsCheckingWebhook(true);
    if (webhookId === null) {
      toast.error(`Please update webhook first`);
      setIsCheckingWebhook(false);
      return;
    }
    try {
      const response = await axios.post(
        `${apiUrl}/webhooks/check/${webhookId}`, {},
        { headers: getAuthHeaders() }
      );
      if (response.status === 200) {
        toast.success("Webhook is valid!");
        setIsCheckingWebhook(false);
      } else {
        toast.error(`Webhook check failed: ${response.data.errorMessage}`);
        setIsCheckingWebhook(false);
      }
    } catch (error: any) {
      const errorMessage =

        error.response?.data?.errorMessage ||
        "An unknown error occurred";
      toast.error(errorMessage);
      
      console.log(error);
    } finally {
      setIsCheckingWebhook(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidEmail(formData.email)) {
      toast.error("Invalid email format.");
      return;
    }
    if (!isValidPhone(formData.mobileWallet)) {
      toast.error("Invalid phone number. Must start with +20 and contain 10 digits.");
      return;
    }

    if (!resolvedParams) return;
    
    setIsSavingSettings(true);

    const dataToSend = {
      id: resolvedParams.id,
      name: formData.name,
      mobile: formData.mobileWallet,
      email: formData.email,
      website: formData.website

    };

    try {
      const response = await axios.post(
        `${apiUrl}/applications/update`,
        JSON.stringify(dataToSend),
        { headers: getAuthHeaders() }
      );

      if (response.status === 200) {
        toast.success("Settings updated successfully!");
      //  fetchStoreDetails();
      } else {
        toast.error(`Failed to update settings: ${response.data.errorMessage}`);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.result?.email ||
        error.response?.data?.errorMessage ||
        "An unknown error occurred";
      toast.error(errorMessage);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleWebhookUpdate = async () => {
    if (!formData.apiUrl) {
      toast.error("Please enter a valid Webhook URL.");
      return;
    }

    if (!resolvedParams) return;
    
    setIsUpdatingWebhook(true);
    try {
      const response = await axios.post(
        `${apiUrl}/webhooks/update`,
        JSON.stringify({ id: resolvedParams.id, value: formData.apiUrl }),
        { headers: getAuthHeaders() }
      );

      if (response.status === 200) {
        toast.success("Webhook URL updated successfully!");
        await fetchStoreDetails()
        setStores(prevStores =>
          prevStores.map(store =>
            store.id === Number(resolvedParams.id) 
              ? { ...store, apiUrl: formData.apiUrl }
              : store
          )
        );
      } else {
        toast.error(`Failed to update webhook URL: ${response.data.errorMessage}`);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.errorMessage || "An unknown error occurred";
      console.error(error)
      toast.error(errorMessage);
    } finally {
      setIsUpdatingWebhook(false);
    }
  };


  return (
    <div className="text-white py-2">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-2xl font-semibold mb-4">{translations.storeUpdate.title}</h2>
      <div className="flex flex-col-reverse lg:flex-row justify-between gap-4">
        <div className="w-full lg:order-1">
          <div className="rounded-[18px] bg-neutral-900 p-4 mb-4">
            <form onSubmit={handleSubmit}>
              {/* Update all form labels and placeholders using translations */}
              {/* ...existing form fields structure... */}
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#53B4AB] text-sm text-black rounded-[16px]"
                  disabled={isSavingSettings}
                >
                  {isSavingSettings 
                    ? translations.storeUpdate.form.buttons.saving 
                    : translations.storeUpdate.form.buttons.saveSettings}
                </button>
              </div>
            </form>
          </div>
          {/* ...rest of the component... */}
        </div>
        <div className="lg:order-2">
          {resolvedParams && <UploadLogo params={resolvedParams} logo={formData.Logo} />}
        </div>
      </div>
    </div>
  );
}
