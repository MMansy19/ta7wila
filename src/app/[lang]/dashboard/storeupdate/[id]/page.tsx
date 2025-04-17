"use client";
import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
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

  // Validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, translations.storeUpdate.validation.nameMinLength)
      .required(translations.storeUpdate.validation.nameRequired),
    email: Yup.string()
      .email(translations.storeUpdate.validation.invalidEmail)
      .required(translations.storeUpdate.validation.emailRequired),
    mobileWallet: Yup.string()
      .matches(
        /^(?:\+2)?(010|011|012|015)[0-9]{8}$/,
        translations.storeUpdate.validation.invalidPhone
      )
      .required(translations.storeUpdate.validation.mobileRequired),
    subdomain: Yup.string()
      .matches(
        /^[a-zA-Z0-9]+$/,
        translations.storeUpdate.validation.invalidSubdomain
      )
      .required(translations.storeUpdate.validation.subdomainRequired),
    apiUrl: Yup.string()
      .url(translations.storeUpdate.validation.invalidWebhook)
      .required(translations.storeUpdate.validation.webhookRequired),
  });

  // Initial form values
  const initialValues: Store = {
    id: 0,
    name: "",
    apiUrl: "",
    email: "",
    mobileWallet: "",
    website: "",
    subdomain: "",
    Logo: "",
  };

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

  const handleSubdomainUpdate = async (values: Store) => {
    if (!resolvedParams) return;

    setIsUpdatingSubdomain(true);
    try {
      const { id } = resolvedParams;
      const response = await axios.post(
        `${apiUrl}/applications/update-subdomain`,
        JSON.stringify({ id: id, subdomain: values.subdomain }),
        { headers: getAuthHeaders() }
      );
      if (response.status === 200) {
        toast.success(translations.storeUpdate.toast.subdomainUpdated);
        setStores((prevStores) =>
          prevStores.map((store) =>
            store.id === Number(id)
              ? { ...store, subdomain: values.subdomain }
              : store
          )
        );
      } else {
        toast.error(
          `${translations.storeUpdate.toast.subdomainError} ${response.data.errorMessage}`
        );
      }
    } catch (error: any) {
      toast.error(translations.storeUpdate.toast.unknownError);
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
        website: data.result.website || "",
        Logo: data.result.logo || null,
      };

      setWebhookId(data.result.webhook?.id || null);

      setStores((prevStores) => [
        ...prevStores.filter((s) => s.id !== store.id),
        store,
      ]);

      return store;
    } catch (error) {
      toast.error("Failed to fetch store details.");
      return initialValues;
    }
  }, [apiUrl, resolvedParams]);

  useEffect(() => {
    if (resolvedParams) {
      fetchStoreDetails();
    }
  }, [resolvedParams, fetchStoreDetails]);

  // Get the current store data
  const currentStore = stores.find(store => store.id === Number(resolvedParams?.id)) || initialValues;

  const handleWebhookCheck = async () => {
    if (webhookId === null) {
      toast.error(translations.storeUpdate.validation.updateWebhookFirst);
      return;
    }
    setIsCheckingWebhook(true);
    try {
      const response = await axios.post(
        `${apiUrl}/webhooks/check/${webhookId}`,
        {},
        { headers: getAuthHeaders() }
      );
      if (response.status === 200) {
        toast.success(translations.storeUpdate.toast.webhookValid);
      } else {
        toast.error(`${translations.storeUpdate.toast.webhookCheckFailed} ${response.data.errorMessage}`);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errorMessage || translations.storeUpdate.toast.unknownError;
      toast.error(errorMessage);
    } finally {
      setIsCheckingWebhook(false);
    }
  };

  const handleSubmit = async (values: Store) => {
    if (!resolvedParams) return;

    setIsSavingSettings(true);

    const dataToSend = {
      id: resolvedParams.id,
      name: values.name,
      mobile: values.mobileWallet,
      email: values.email,
      website: values.website,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/applications/update`,
        JSON.stringify(dataToSend),
        { headers: getAuthHeaders() }
      );

      if (response.status === 200) {
        toast.success(translations.storeUpdate.toast.settingsUpdated);
      } else {
        toast.error(`${translations.storeUpdate.toast.settingsError} ${response.data.errorMessage}`);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.result?.email ||
        error.response?.data?.errorMessage ||
        translations.storeUpdate.toast.unknownError;
      toast.error(errorMessage);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleWebhookUpdate = async (values: Store) => {
    if (!resolvedParams) return;

    setIsUpdatingWebhook(true);
    try {
      const response = await axios.post(
        `${apiUrl}/webhooks/update`,
        JSON.stringify({ id: resolvedParams.id, value: values.apiUrl }),
        { headers: getAuthHeaders() }
      );

      if (response.status === 200) {
        toast.success(translations.storeUpdate.toast.webhookUpdated);
        await fetchStoreDetails();
        setStores((prevStores) =>
          prevStores.map((store) =>
            store.id === Number(resolvedParams.id)
              ? { ...store, apiUrl: values.apiUrl }
              : store
          )
        );
      } else {
        toast.error(
          `${translations.storeUpdate.toast.webhookUpdateError} ${response.data.errorMessage}`
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errorMessage || translations.storeUpdate.toast.unknownError;
      toast.error(errorMessage);
    } finally {
      setIsUpdatingWebhook(false);
    }
  };

  return (
    <div className="text-white py-2">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-2xl font-semibold mb-4">
        {translations.storeUpdate.title}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        <div className="col-span-5 lg:order-1">
          <Formik
            initialValues={currentStore}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue }) => (
              <>
                <div className="rounded-xl bg-neutral-900 p-4 mb-4">
                  <Form>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-2">
                        {translations.storeUpdate.form.storeName.label}
                      </label>
                      <Field
                        name="name"
                        type="text"
                        placeholder={translations.storeUpdate.form.storeName.placeholder}
                        className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-2">
                        {translations.storeUpdate.form.email.label}
                      </label>
                      <Field
                        name="email"
                        type="email"
                        placeholder={translations.storeUpdate.form.email.placeholder}
                        className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-2">
                        {translations.storeUpdate.form.mobileWallet.label}
                      </label>
                      <Field
                        name="mobileWallet"
                        type="text"
                        placeholder={translations.storeUpdate.form.mobileWallet.placeholder}
                        className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                      />
                      <ErrorMessage
                        name="mobileWallet"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#53B4AB] text-sm text-black rounded-lg"
                        disabled={isSavingSettings}
                        onClick={() => handleSubmit(values)}
                      >
                        {isSavingSettings
                          ? translations.storeUpdate.form.buttons.saving
                          : translations.storeUpdate.form.buttons.saveSettings}
                      </button>
                    </div>
                  </Form>
                </div>

                {/* Sub Domain Section */}
                <div className="rounded-xl bg-neutral-900 p-4 mb-4">
                  <div className="mb-2">
                    <label className="block text-sm font-semibold mb-2">
                      {translations.storeUpdate.form.subdomain.label}
                    </label>
                    <Field
                      name="subdomain"
                      type="text"
                      placeholder={translations.storeUpdate.form.subdomain.placeholder}
                      className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                    />
                    <ErrorMessage
                      name="subdomain"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      className="px-5 py-2 bg-[#53B4AB] text-sm text-black rounded-lg"
                      onClick={() => handleSubdomainUpdate(values)}
                      disabled={isUpdatingSubdomain}
                    >
                      {isUpdatingSubdomain
                        ? translations.storeUpdate.form.buttons.updating
                        : translations.storeUpdate.form.buttons.updateSubdomain}
                    </button>
                  </div>
                </div>

                {/* Web hook Section */}
                <div className="rounded-xl bg-neutral-900 p-4">
                  <div className="mb-2">
                    <label className="block text-sm font-semibold mb-2">
                      {translations.storeUpdate.form.webhook.label}
                    </label>
                    <Field
                      name="apiUrl"
                      type="text"
                      placeholder={translations.storeUpdate.form.webhook.placeholder}
                      className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                    />
                    <ErrorMessage
                      name="apiUrl"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="flex justify-end mt-4 gap-2">
                    <button
                      type="button"
                      onClick={() => handleWebhookUpdate(values)}
                      className="px-5 py-2 bg-[#53B4AB] text-sm text-black rounded-lg"
                      disabled={isUpdatingWebhook}
                    >
                      {isUpdatingWebhook
                        ? translations.storeUpdate.form.buttons.updating
                        : translations.storeUpdate.form.buttons.update}
                    </button>
                    <button
                      type="button"
                      onClick={handleWebhookCheck}
                      className="px-5 py-2 bg-[#53B4AB] text-sm text-black rounded-lg"
                      disabled={isCheckingWebhook}
                    >
                      {isCheckingWebhook
                        ? translations.storeUpdate.form.buttons.checking
                        : translations.storeUpdate.form.buttons.check}
                    </button>
                  </div>
                </div>
              </>
            )}
          </Formik>
        </div>
        <div className="col-span-1 lg:order-2">
          {resolvedParams && (
            <UploadLogo params={resolvedParams} logo={currentStore.Logo} />
          )}
        </div>
      </div>
    </div>
  );
}
