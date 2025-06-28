"use client";

import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import FormField from "../Shared/FormField";
import getAuthHeaders from "../Shared/getAuth";
import { FormData } from "./types";
import { createValidationSchema } from "./validation";

const StoreSettings: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const translations = useTranslation();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Memoize the validation schema to prevent unnecessary recreations
  const validationSchema = useMemo(() => 
    createValidationSchema(translations),
    [translations]
  );

  const handleSubmit = async (
    values: FormData,
    { resetForm }: { resetForm: () => void }
  ) => {
    setLoading(true);
    const dataToSend = {
      name: values.name,
      mobile: values.mobileWallet,
      email: values.email,
      website: values.website,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/applications/create`,
        JSON.stringify(dataToSend),
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(translations?.storeUpdate?.toast?.settingsUpdated || "Store created successfully!");
        resetForm();
      } else {
        toast.error(translations?.storeUpdate?.toast?.settingsError || "Failed to create store");
      }
    } catch (error: any) {
      console.error("Error submitting the form", error);
      toast.error(
        error?.response?.data?.errorMessage || 
        translations?.storeUpdate?.toast?.unknownError || 
        "An error occurred while creating the store"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      <Toaster position="top-right" reverseOrder={false} />
      <Formik
        initialValues={{
          name: "",
          website: "",
          email: "",
          mobileWallet: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <h2 className="block text-xl font-semibold mb-2">
              {translations?.stores?.addStore || "Add New Store"}
            </h2>

            <div className="flex overflow-hidden flex-col justify-center px-8 py-6 w-full bg-neutral-900 rounded-xl max-md:max-w-full mb-4">
              <FormField
                name="name"
                type="text"
                label={translations?.storeUpdate?.form?.storeName?.label || "Store Name"}
                placeholder={translations?.storeUpdate?.form?.storeName?.placeholder || "Enter store name"}
              />
            </div>

            <div className="flex overflow-hidden flex-col justify-center px-8 py-6 w-full bg-neutral-900 rounded-[18px] max-md:max-w-full">
              <FormField
                name="website"
                type="text"
                label={translations?.storeUpdate?.form?.website?.label || "Website"}
                placeholder={translations?.storeUpdate?.form?.website?.placeholder || "Enter website URL"}
              />

              <FormField
                name="email"
                type="text"
                label={translations?.storeUpdate?.form?.email?.label || "Email"}
                placeholder={translations?.storeUpdate?.form?.email?.placeholder || "Enter email address"}
              />

              <FormField
                name="mobileWallet"
                type="text"
                label={translations?.storeUpdate?.form?.mobileWallet?.label || "Mobile Wallet"}
                placeholder={translations?.storeUpdate?.form?.mobileWallet?.placeholder || "Enter mobile wallet number"}
              />
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-4 py-3 bg-[#53B4AB] text-sm text-black font-semibold rounded-lg"
                disabled={isSubmitting || loading}
              >
                {loading
                  ? translations?.storeUpdate?.form?.buttons?.saving || "Saving..."
                  : translations?.storeUpdate?.form?.buttons?.saveSettings || "Save Settings"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StoreSettings;
