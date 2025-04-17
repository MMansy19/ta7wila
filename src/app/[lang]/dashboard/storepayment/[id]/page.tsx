"use client";
import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import getAuthHeaders from "../../Shared/getAuth";

interface Store {
  id: number;
  value: string;
  is_public: boolean;
  payment_option: string;
  created_at: string;
  updated_at: string;
  application_id: number;
  ref_id: number;
  user_id: number;
}

interface Params {
  id: string;
  lang: string;
}

export default function PaymentService({
  params,
}: {
  params: Promise<Params>;
}) {
  const translations = useTranslation();
  const [refId, setRefId] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenadd, setIsModalOpenadd] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [value, setValue] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submittingAdd, setSubmittingAdd] = useState(false);
  const [paymentOption, setPaymentOption] = useState<string>("");
  const paymentOptions = [
    { name: "VF- CASH", key: "vcash", img: "/vcash.svg" },
    { name: "Et- CASH", key: "ecash", img: "/ecash.svg" },
    { name: "WE- CASH", key: "wecash", img: "/wecash.svg" },
    { name: "OR- CASH", key: "ocash", img: "/ocash.svg" },
    { name: "INSTAPAY", key: "instapay", img: "/instapay.svg" },
  ];

  const [resolvedParams, setResolvedParams] = useState<Params | null>(null);
  
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

  // Validation schema for update form
  const updateValidationSchema = Yup.object().shape({
    value: Yup.string()
      .required(translations.storepayment.validation.valueRequired || "Value is required"),
    ref_id: Yup.string()
      .required(translations.storepayment.validation.refIdRequired || "Reference ID is required"),
    payment_option: Yup.string()
      .required(translations.storepayment.validation.paymentOptionRequired || "Payment option is required"),
    is_public: Yup.boolean()
  });

  // Validation schema for add form
  const addValidationSchema = Yup.object().shape({
    value: Yup.string()
      .required(translations.storepayment.validation.valueRequired || "Value is required"),
    ref_id: Yup.string()
      .required(translations.storepayment.validation.refIdRequired || "Reference ID is required"),
    payment_option: Yup.string()
      .required(translations.storepayment.validation.paymentOptionRequired || "Payment option is required"),
    is_public: Yup.boolean()
  });

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const openModal = (store: Store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStore(null);
    setIsModalOpen(false);
  };

  const openModal2 = () => {
    setIsModalOpenadd(true);
  };

  const closeModal2 = () => {
    setIsModalOpenadd(false);
  };

  const updateSelectedStoreField = (field: keyof Store, value: any) => {
    setSelectedStore((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleAddPayment = async (values: any, { resetForm }: any) => {
    setSubmittingAdd(true);
    try {
      const { id } = await params;
      await axios.post(
        `${apiUrl}/payments/add`,
        {
          id: id,
          value: values.value,
          payment_option: values.payment_option,
          ref_id: values.ref_id,
          is_public: values.is_public,
        },
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(translations.storepayment.toast.addSuccess || "Payment added successfully!");
      setIsModalOpenadd(false);
      fetchStores();
      resetForm();
    } catch (error: any) {
      console.error("Error submitting the form", error);

      if (axios.isAxiosError(error)) {
        const axiosError = error;
        if (axiosError.response) {
          const errorMessage =
            axiosError.response.data.result.value || "Unknown error occurred";
          toast.error(`${errorMessage}`);
        } else if (axiosError.request) {
          toast.error("No response received from the server.");
        } else {
          toast.error(`Error: ${axiosError.message}`);
        }
      } else {
        toast.error(
          `An unexpected error occurred: ${error.message || "Unknown error"}`
        );
      }
    } finally {
      setSubmittingAdd(false);
    }
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    if (!selectedStore) return;
    setSubmitting(true);
    try {
      await axios.post(
        `${apiUrl}/payments/update`,
        {
          id: selectedStore.id,
          value: values.value,
          is_public: values.is_public,
          ref_id: values.ref_id,
          payment_option: values.payment_option,
        },
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(translations.storepayment.toast.updateSuccess || "Store updated successfully!");
      setIsModalOpen(false);

      setStores((prevStores) =>
        prevStores.map((store) =>
          store.id === selectedStore.id ? { ...store, ...values } : store
        )
      );
      resetForm();
    } catch (error: any) {
      console.error("Error submitting the form", error);

      if (axios.isAxiosError(error)) {
        const axiosError = error;
        if (axiosError.response) {
          const errorMessage =
            axiosError.response.data.result.value || "Unknown error occurred";
          toast.error(`${errorMessage}`);
        } else if (axiosError.request) {
          toast.error("No response received from the server.");
        } else {
          toast.error(`Error: ${axiosError.message}`);
        }
      } else {
        toast.error(
          `An unexpected error occurred: ${error.message || "Unknown error"}`
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    const { id } = await params;
    const url = `${apiUrl}/payments?application_id=${id}?page=${currentPage}`;

    try {
      const response = await axios.get(url, { headers: getAuthHeaders() });
      setStores(response.data.result.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="grid mt-2">
        <div className="flex flex-col overflow-hidden bg-neutral-900 rounded-[18px] p-6 text-white min-h-[calc(100vh-76px)]">
          <Toaster position="top-right" />
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              {translations.storepayment.title}
            </h2>
            <button
              className="bg-[#53B4AB] hover:bg-[#347871] text-black px-4 py-2 rounded-lg text-sm"
              onClick={() => openModal2()}
            >
              {translations.storepayment.addPayment}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-2">{translations.storepayment.table.id}</th>
                  <th className="p-2">
                    {translations.storepayment.table.value}
                  </th>
                  <th className="p-2">
                    {translations.storepayment.table.public}
                  </th>
                  <th className="p-2">
                    {translations.storepayment.table.paymentOption}
                  </th>
                  <th className="p-2">
                    {translations.storepayment.table.createdAt}
                  </th>
                  <th className="p-2">
                    {translations.storepayment.table.updatedAt}
                  </th>
                  <th className="p-2">
                    {translations.storepayment.table.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {stores && stores.length > 0 ? (
                  stores.map((store) => (
                    <tr
                      key={store.id}
                      className="transition rounded-lg border-b border-white/10 text-start"
                    >
                      <td className="p-2">{store.id}</td>
                      <td className="p-2">{store.value}</td>
                      <td className="p-2">{store.is_public ? "Yes" : "No"}</td>
                      <td className="p-2 flex justify-start items-start">
                        {(() => {
                          const selectedOption = paymentOptions.find(
                            (option) => option.key === store.payment_option
                          );
                          return selectedOption ? (
                            <Image
                              width="34"
                              height="34"
                              loading="lazy"
                              src={selectedOption.img}
                              alt={store.payment_option}
                              className="object-contain self-center aspect-square w-[34px]"
                            />
                          ) : (
                            "N/A"
                          );
                        })()}
                      </td>
                      <td className="p-2">
                        {new Date(store.created_at).toLocaleString(resolvedParams?.lang === 'ar' ? 'ar-AE' : 'en-US')}
                      </td>
                      <td className="p-2">
                        {new Date(store.updated_at).toLocaleString(resolvedParams?.lang === 'ar' ? 'ar-AE' : 'en-US')}
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => openModal(store)}
                          className="bg-[#53B4AB] hover:bg-[#347871] px-3 py-1 rounded-lg text-black text-sm"
                        >
                          {translations.storepayment.table.update}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-24">
                      {translations.storepayment.noData}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-end mt-auto">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className={`mx-1 rounded-full w-9 h-9 flex justify-center items-center ${
                currentPage === 1
                  ? "bg-[#53B4AB] cursor-not-allowed"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transform ${resolvedParams?.lang === 'ar' ? 'rotate-180' : ''}`}
              >
                <path
                  d="M14 17.772L9 12.772L14 7.77197"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <span className="  p-2  text-sm">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={` mx-1 rounded-full w-9 h-9 flex justify-center items-center ${
                currentPage === totalPages
                  ? "bg-[#53B4AB] cursor-not-allowed"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transform ${resolvedParams?.lang === 'ar' ? 'rotate-180' : ''}`}
              >
                <path
                  d="M10 17.772L15 12.772L10 7.77197"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {isModalOpen && selectedStore && (
            <div className="fixed w-full z-20 inset-0 bg-black bg-opacity-70 flex justify-center items-center">
              <div className="bg-neutral-900 rounded-xl p-6 shadow-lg mx-4">
                <h2 className="text-xl font-bold mb-4">
                  {translations.storepayment.modal.update.title}
                </h2>
                <Formik
                  initialValues={{
                    value: selectedStore.value,
                    ref_id: selectedStore.ref_id,
                    payment_option: selectedStore.payment_option,
                    is_public: selectedStore.is_public
                  }}
                  validationSchema={updateValidationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ setFieldValue, values }) => (
                    <Form>
                      <div className="flex flex-col leading-tight text-center text-white max-w-[596px]">
                        <div className="text-xl font-semibold max-md:max-w-full">
                          {translations.storepayment.modal.update.choosePayment}
                        </div>
                        <div className="flex flex-wrap gap-2 items-center self-center mt-4 font-medium max-md:max-w-full">
                          {paymentOptions.map((option) => (
                            <div
                              key={option.key}
                              onClick={() => {
                                setFieldValue("payment_option", option.key);
                              }}
                              className={`flex flex-col justify-center self-stretch my-auto text-xs rounded-2xl bg-opacity-40 h-[80px] min-h-[80px] w-[80px] 
                                                ${
                                                  values.payment_option ===
                                                  option.key
                                                    ? "bg-[#53B4AB] text-white"
                                                    : "bg-gray-400 text-black hover:bg-[#53B4AB] hover:text-white"
                                                }`}
                            >
                              <Image
                                width="34"
                                height="34"
                                loading="lazy"
                                src={option.img}
                                alt={option.name}
                                className="object-contain self-center aspect-square w-[34px]"
                              />
                              <div className="mt-2.5">{option.name}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="my-4">
                        <label className="block text-sm font-medium mb-2">
                          {translations.storepayment.modal.update.value}
                        </label>
                        <Field
                          name="value"
                          type="text"
                          className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                        />
                        <ErrorMessage
                          name="value"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="my-4">
                        <label className="block text-sm font-medium mb-2">
                          {translations.storepayment.modal.update.refId}
                        </label>
                        <Field
                          name="ref_id"
                          type="text"
                          className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                        />
                        <ErrorMessage
                          name="ref_id"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                          {translations.storepayment.modal.update.publicLabel}
                        </label>
                        <Field
                          as="select"
                          name="is_public"
                          className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                        >
                          <option value="true">
                            {translations.storepayment.modal.update.yes}
                          </option>
                          <option value="false">
                            {translations.storepayment.modal.update.no}
                          </option>
                        </Field>
                        <ErrorMessage
                          name="is_public"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                        >
                          {translations.storepayment.modal.update.cancel}
                        </button>
                        <button
                          type="submit"
                          className="bg-[#53B4AB] hover:bg-[#347871] text-black px-4 py-2 rounded-lg"
                          disabled={submitting}
                        >
                          {submitting 
                            ? translations.storepayment.modal.update.saving 
                            : translations.storepayment.modal.update.save}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          )}

          {isModalOpenadd && (
            <div className="fixed w-full z-20 inset-0 bg-black bg-opacity-70 flex justify-center items-center">
              <div className="bg-neutral-900 rounded-[18px] p-6 shadow-lg mx-4">
                <h2 className="text-xl font-bold mb-4">
                  {translations.storepayment.modal.add.title}
                </h2>
                <Formik
                  initialValues={{
                    value: "",
                    ref_id: "",
                    payment_option: "",
                    is_public: false
                  }}
                  validationSchema={addValidationSchema}
                  onSubmit={handleAddPayment}
                >
                  {({ setFieldValue, values }) => (
                    <Form>
                      <div className="flex flex-col leading-tight text-center text-white max-w-[596px]">
                        <div className="text-xl font-semibold max-md:max-w-full">
                          {translations.storepayment.modal.add.paymentOption}
                        </div>
                        <div className="flex flex-wrap gap-2 items-center self-center mt-4 font-medium max-md:max-w-full">
                          {paymentOptions.map((option) => (
                            <div
                              key={option.key}
                              onClick={() => setFieldValue("payment_option", option.key)}
                              className={`flex flex-col justify-center self-stretch my-auto text-xs rounded-2xl bg-opacity-40 h-[80px] min-h-[80px] w-[80px] ${
                                values.payment_option === option.key
                                  ? "bg-[#53B4AB] text-white"
                                  : "bg-gray-400 text-black hover:bg-[#53B4AB] hover:text-white"
                              }`}
                            >
                              <Image
                                width="34"
                                height="34"
                                loading="lazy"
                                src={option.img}
                                alt={option.name}
                                className="object-contain self-center aspect-square w-[34px]"
                              />
                              <div className="mt-2.5">{option.name}</div>
                            </div>
                          ))}
                        </div>
                        <ErrorMessage
                          name="payment_option"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div className="my-4">
                        <label className="block text-sm font-medium mb-2">
                          {translations.storepayment.modal.add.value}
                        </label>
                        <Field
                          name="value"
                          type="text"
                          placeholder="01********* || name@instapay "
                          className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                        />
                        <ErrorMessage
                          name="value"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div className="my-4">
                        <label className="block text-sm font-medium mb-2">
                          {translations.storepayment.modal.add.referenceLabel}
                        </label>
                        <Field
                          name="ref_id"
                          type="text"
                          placeholder="Enter reference ID"
                          className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                        />
                        <ErrorMessage
                          name="ref_id"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div className="my-4">
                        <label className="block text-sm font-medium mb-2">
                          {translations.storepayment.modal.add.visibility}
                        </label>
                        <Field
                          as="select"
                          name="is_public"
                          className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10 focus:outline-none"
                        >
                          <option value="true">
                            {translations.storepayment.modal.add.public}
                          </option>
                          <option value="false">
                            {translations.storepayment.modal.add.private}
                          </option>
                        </Field>
                        <ErrorMessage
                          name="is_public"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={closeModal2}
                          className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                        >
                          {translations.storepayment.modal.add.cancel}
                        </button>
                        <button
                          type="submit"
                          className="bg-[#53B4AB] hover:bg-[#347871] text-black px-4 py-2 rounded-lg"
                          disabled={submittingAdd}
                        >
                          {submittingAdd 
                            ? translations.storepayment.modal.add.adding 
                            : translations.storepayment.modal.add.add}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
