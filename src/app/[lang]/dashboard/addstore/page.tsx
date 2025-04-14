"use client";

import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";

import { useTranslation } from "@/context/translation-context";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FormData } from "./types";
import createValidationSchema from "./validation";

const StoreSettings: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const translations = useTranslation();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Get validation schema with translations
  const validationSchema = createValidationSchema(translations);

  const handleSubmit = async (values: FormData, { resetForm }: { resetForm: () => void }) => {
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
        toast.success("Store Created successfully!");
        resetForm();
      } else {
        toast.error(`Failed to create store: ${response.data.errorMessage}`);
      }
    } catch (error: any) {
      console.error("Error submitting the form", error);

      if (axios.isAxiosError(error)) {
        const axiosError = error;
        const errorMessage =
          axiosError.response?.data?.errorMessage || "Unknown error occurred";
        toast.error(`${errorMessage}`);
      } else {
        toast.error(
          `An unexpected error occurred: ${error.message || "Unknown error"}`
        );
      }
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
            <h2 className="block text-xl font-semibold mb-2">{translations.stores.addStore}</h2>

            <div className="flex overflow-hidden flex-col justify-center px-8 py-6 w-full bg-neutral-900 rounded-[18px] max-md:max-w-full mb-4">
              <label className="block text-lg font-semibold mb-2">
                {translations.storeUpdate.form.storeName.label}
              </label>
              <Field
                name="name"
                type="text"
                placeholder={translations.storeUpdate.form.storeName.placeholder}
                className="w-full bg-[#444444] text-white p-2 px-4 rounded-[16px] outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="name" component="div" className="text-[#7E7E7E]" />
            </div>

            <div className="flex overflow-hidden flex-col justify-center px-8 py-6 w-full bg-neutral-900 rounded-[18px] max-md:max-w-full">
              <label className="block text-lg font-semibold mb-2">
                API Options <span className="text-[#7E7E7E]">*</span>
              </label>

              <div className="mb-4">
                <label className="block mb-1">{translations.storeUpdate.form.website.label}</label>
                <Field
                  name="website"
                  type="text"
                  placeholder={translations.storeUpdate.form.website.placeholder}
                  className="w-full p-2 rounded-[16px] bg-[#444444] text-white px-4"
                />
                <ErrorMessage name="website" component="div" className="text-[#7E7E7E]" />
              </div>

              <div className="mb-4">
                <label className="block mb-1">{translations.storeUpdate.form.email.label}</label>
                <Field
                  name="email"
                  type="text"
                  placeholder={translations.storeUpdate.form.email.placeholder}
                  className="w-full p-2 rounded-[16px] bg-[#444444] text-white px-4"
                />
                <ErrorMessage name="email" component="div" className="text-[#7E7E7E]" />
              </div>

              <div className="mb-4">
                <label className="block mb-1">{translations.storeUpdate.form.mobileWallet.label}</label>
                <Field
                  name="mobileWallet"
                  type="text"
                  placeholder={translations.storeUpdate.form.mobileWallet.placeholder}
                  className="w-full p-2 rounded-[16px] bg-[#444444] text-white px-4"
                />
                <ErrorMessage name="mobileWallet" component="div" className="text-[#7E7E7E]" />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-[#53B4AB] text-sm text-black rounded-[16px]"
                disabled={isSubmitting || loading}
              >
                {loading ? translations.storeUpdate.form.buttons.saving : translations.storeUpdate.form.buttons.saveSettings}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StoreSettings;

