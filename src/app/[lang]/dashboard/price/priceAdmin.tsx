"use client";
import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import FormField from "../Shared/FormField";
import getAuthHeaders from "../Shared/getAuth";
import useCurrency from "../Shared/useCurrency";
import { Plan } from "./types";

export default function AdminPlans() {
  const translations = useTranslation();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);
  const formatCurrency = useCurrency();

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.errorMessage) {
        toast.error(error.response.data.errorMessage);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error(translations.common.errorOccurred || "Unauthorized access");
      } else {
        toast.error(translations.common.errorOccurred);
      }
    } else {
      toast.error(translations.common.errorOccurred);
    }
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required(
        translations.price?.validation?.titleRequired || "Title is required"
      )
      .min(
        3,
        translations.price?.validation?.titleMinLength ||
          "Title must be at least 3 characters"
      ),
    subtitle: Yup.string().required(
      translations.price?.validation?.subtitleRequired || "Subtitle is required"
    ),
    amount: Yup.number()
      .required(
        translations.price?.validation?.amountRequired || "Amount is required"
      )
      .min(
        0,
        translations.price?.validation?.amountMin ||
          "Amount must be greater than 0"
      ),
    applications_count: Yup.number()
      .required(
        translations.price?.validation?.applicationsRequired ||
          "Applications count is required"
      )
      .min(
        0,
        translations.price?.validation?.applicationsMin ||
          "Applications count must be greater than 0"
      ),
    employees_count: Yup.number()
      .required(
        translations.price?.validation?.employeesRequired ||
          "Employees count is required"
      )
      .min(
        0,
        translations.price?.validation?.employeesMin ||
          "Employees count must be greater than 0"
      ),
    vendors_count: Yup.number()
      .required(
        translations.price?.validation?.vendorsRequired ||
          "Vendors count is required"
      )
      .min(
        0,
        translations.price?.validation?.vendorsMin ||
          "Vendors count must be greater than 0"
      ),
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${apiUrl}/plans`, {
        headers: getAuthHeaders(),
      });
      setPlans(
        response.data.result.data.sort(
          (a: { id: number }, b: { id: number }) => a.id - b.id
        )
      );
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddPlan = async (values: any) => {
    try {
      const planToAdd = {
        ...values,
        employees_count: Number(values.employees_count),
      };
      await axios.post(`${apiUrl}/plans/add`, planToAdd, {
        headers: getAuthHeaders(),
      });
      toast.success(translations.common.createdSuccessfully);
      fetchPlans();
      setShowAddModal(false);
    } catch (error) {
      handleError(error);
    }
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
  };

  const handleUpdatePlan = async (values: any) => {
    try {
      const planToUpdate = {
        ...values,
        employees_count: Number(values.employees_count),
      };
      await axios.post(`${apiUrl}/plans/update`, planToUpdate, {
        headers: getAuthHeaders(),
      });
      toast.success(translations.common.updatedSuccessfully);
      fetchPlans();
      setEditingPlan(null);
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeletePlan = async (id: number) => {
    try {
      await axios.post(
        `${apiUrl}/plans/delete/${id}`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );
      toast.success(translations.common.deletedSuccessfully);
      fetchPlans();
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <div className="grid">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex overflow-hidden flex-col px-8 py-6 w-full bg-neutral-900 rounded-xl max-md:max-w-full text-white min-h-[calc(100vh-73px)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold mb-4">
            {translations.price.manageTitle}
          </h2>
          <div className="flex flex-wrap gap-2 justify-end md:justify-start">
            <button
              className="bg-[#53B4AB] hover:bg-[#479d94] text-black px-4 py-2 rounded-lg text-sm"
              onClick={() => setShowAddModal(true)}
            >
              {translations.price.addNewPlan}
            </button>
          </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed w-full z-20 inset-0 bg-black/70 flex justify-center items-center">
            <div className="bg-neutral-900 rounded-xl p-5 shadow-xl max-w-2xl w-full mx-4 border border-neutral-800">
              <div className="flex justify-between text-xl font-bold mb-4">
                <h3 className="text-2xl font-bold mb-6 text-white">
                  {translations.price.modal.addTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-white"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.2431 7.75738L7.75781 16.2427M16.2431 16.2426L7.75781 7.75732"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <Formik
                initialValues={{
                  title: "",
                  amount: 0,
                  subtitle: "",
                  applications_count: "",
                  employees_count: "",
                  vendors_count: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleAddPlan}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-5">
                    <FormField
                      name="title"
                      type="text"
                      label={translations.price.modal.title}
                      placeholder={translations.price.modal.titlePlaceholder}
                      required
                    />

                    <FormField
                      name="subtitle"
                      type="text"
                      label={translations.price.modal.subtitle}
                      placeholder={translations.price.modal.subtitlePlaceholder}
                      required
                    />

                    <FormField
                      name="amount"
                      type="number"
                      label={`${translations.price.modal.amount} (${formatCurrency(0)})`}
                      placeholder="0.00"
                      min={0}
                      required
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        name="applications_count"
                        type="number"
                        label={translations.price.modal.applicationsCount}
                        placeholder="0"
                        required
                      />

                      <FormField
                        name="employees_count"
                        type="number"
                        label={translations.price.modal.employeesCount}
                        placeholder="0"
                        min={0}
                        required
                      />

                      <FormField
                        name="vendors_count"
                        type="number"
                        label={translations.price.modal.vendorsCount}
                        placeholder="0"
                        min={0}
                        required
                      />
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-xl font-medium bg-[#53B4AB] hover:bg-[#479d94] text-neutral-900 transition-colors"
                      >
                        {translations.price.modal.createPlan}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingPlan && (
          <div className="fixed w-full z-20 inset-0 bg-black/70 flex justify-center items-center">
            <div className="bg-neutral-900 rounded-xl p-5 shadow-xl max-w-2xl w-full mx-4 border border-neutral-800">
              <div className="flex justify-between text-xl font-bold mb-4">
                <h3 className="text-2xl font-bold mb-6 text-white">
                  {translations.price.modal.editTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="text-white"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.2431 7.75738L7.75781 16.2427M16.2431 16.2426L7.75781 7.75732"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <Formik
                initialValues={editingPlan}
                validationSchema={validationSchema}
                onSubmit={handleUpdatePlan}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-5">
                    <Field type="hidden" name="id" />
                    <FormField
                      name="title"
                      type="text"
                      label={translations.price.modal.title}
                      required
                    />

                    <FormField
                      name="subtitle"
                      type="text"
                      label={translations.price.modal.subtitle}
                      required
                    />

                    <FormField
                      name="amount"
                      type="number"
                      label={`${translations.price.modal.amount} (${formatCurrency(0)})`}
                      min={0}
                      required
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        name="applications_count"
                        type="number"
                        label={translations.price.modal.applicationsCount}
                        required
                        min={0}
                      />

                      <FormField
                        name="employees_count"
                        type="number"
                        label={translations.price.modal.employeesCount}
                        required
                        min={0}
                      />

                      <FormField
                        name="vendors_count"
                        type="number"
                        label={translations.price.modal.vendorsCount}
                        required
                        min={0}
                      />
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2 rounded-xl font-medium bg-[#53B4AB] hover:bg-[#479d94] text-neutral-900 transition-colors"
                      >
                        {translations.price.modal.saveChanges}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingPlan && (
          <div className="fixed w-full z-20 inset-0 bg-black bg-opacity-70 flex justify-center items-center">
            <div className="bg-neutral-900 rounded-lg p-6 shadow-lg mx-6">
              <h3 className="text-xl font-bold mb-4">
                {translations.price.modal.deleteTitle}
              </h3>
              <p className="mb-4">{translations.price.modal.deleteConfirm}</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeletingPlan(null)}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  {translations.price.modal.cancel}
                </button>
                <button
                  onClick={() => {
                    handleDeletePlan(deletingPlan.id);
                    setDeletingPlan(null);
                  }}
                  className="bg-red-500 bg-opacity-40 hover:bg-red-900 text-white px-4 py-2 rounded-lg"
                >
                  {translations.price.modal.delete}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-neutral-800/50 rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-neutral-800/80 to-neutral-700/80 border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/90 tracking-wide">{translations.price.table.id}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/90 tracking-wide">{translations.price.table.title}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/90 tracking-wide">{translations.price.table.subtitle}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/90 tracking-wide">{translations.price.table.amount}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/90 tracking-wide">{translations.price.table.applications}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/90 tracking-wide">{translations.price.table.employees}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/90 tracking-wide">{translations.price.table.vendors}</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white/90 tracking-wide">{translations.price.table.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {plans.length > 0 ? (
                  plans.map((plan, index) => (
                    <tr
                      key={plan.id}
                      className={`group hover:bg-white/5 transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-neutral-800/20' : 'bg-transparent'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-purple-400 font-bold text-sm">#{plan.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-orange-400 font-bold text-sm">{plan.title.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium text-orange-400 group-hover:text-orange-300 transition-colors">
                              {plan.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white/80 text-sm">
                          {plan.subtitle}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-emerald-400 text-lg">
                          {formatCurrency(plan.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-lg text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {plan.applications_count}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-lg text-sm font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {plan.employees_count}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-lg text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {plan.vendors_count}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 items-center justify-center">
                          <button
                            onClick={() => handleEditPlan(plan)}
                            className="inline-flex items-center p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 rounded-lg transition-all duration-200 transform hover:scale-105"
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4"
                            >
                              <path
                                d="M22 12V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18V6C2 3.79086 3.79086 2 6 2H12M15.6864 4.02275C15.6864 4.02275 15.6864 5.45305 17.1167 6.88334C18.547 8.31364 19.9773 8.31364 19.9773 8.31364M9.15467 15.9896L12.1583 15.5605C12.5916 15.4986 12.9931 15.2978 13.3025 14.9884L21.4076 6.88334C22.1975 6.09341 22.1975 4.81268 21.4076 4.02275L19.9773 2.59245C19.1873 1.80252 17.9066 1.80252 17.1167 2.59245L9.01164 10.6975C8.70217 11.0069 8.50142 11.4084 8.43952 11.8417L8.01044 14.8453C7.91508 15.5128 8.4872 16.0849 9.15467 15.9896Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeletingPlan(plan)}
                            className="inline-flex items-center p-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg transition-all duration-200 transform hover:scale-105"
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4"
                            >
                              <path
                                d="M5 8V18C5 20.2091 6.79086 22 9 22H15C17.2091 22 19 20.2091 19 18V8M14 11V17M10 11L10 17M16 5L14.5937 2.8906C14.2228 2.3342 13.5983 2 12.9296 2H11.0704C10.4017 2 9.7772 2.3342 9.40627 2.8906L8 5M16 5H8M16 5H21M8 5H3"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 bg-neutral-700/50 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="text-neutral-400 text-lg font-medium">{translations.price.table.noPlans}</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
