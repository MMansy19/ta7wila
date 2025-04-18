"use client";
import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import { useEffect, useState } from "react";
import getAuthHeaders from "../Shared/getAuth";
import { Plan } from "./types";

export default function AdminPlans() {
  const translations = useTranslation();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [newPlan, setNewPlan] = useState({
    title: "",
    amount: 0,
    subtitle: "",
    applications_count: "",
    employees_count: "",
    vendors_count: ""
  });
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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
      console.error("Error fetching plans:", error);
    }
  };

  const handleAddPlan = async () => {
    try {
      await axios.post(`${apiUrl}/plans/add`, newPlan, {
        headers: getAuthHeaders(),
      });
      fetchPlans();
      setNewPlan({ title: "", amount: 0, subtitle: "", applications_count: "", employees_count: "", vendors_count: "" });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding plan:", error);
    }
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
  };

  const handleUpdatePlan = async () => {
    if (!editingPlan) return;
    try {
      await axios.post(`${apiUrl}/plans/update`, editingPlan, {
        headers: getAuthHeaders(),
      });
      fetchPlans();
      setEditingPlan(null);
    } catch (error) {
      console.error("Error updating plan:", error);
    }
  };

  const handleDeletePlan = async (id: number) => {
    try {
      await axios.post(`${apiUrl}/plans/delete/${id}`, {}, {
        headers: getAuthHeaders(),
      });
      fetchPlans();
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  return (
    <div className="grid">
      <div className="flex overflow-hidden flex-col px-8 py-6 w-full bg-neutral-900 rounded-xl max-md:max-w-full text-white min-h-[calc(100vh-73px)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold mb-4">{translations.price.manageTitle}</h2>
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
                <h3 className="text-2xl font-bold mb-6 text-white">{translations.price.modal.addTitle}</h3>
                <button type="button" onClick={() => setShowAddModal(false)} className="text-white">
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

              <div className="space-y-5">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-neutral-300 mb-2">
                    {translations.price.modal.title} *
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder={translations.price.modal.titlePlaceholder}
                    value={newPlan.title}
                    onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                    className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#53B4AB] focus:ring-2 focus:ring-[#53B4AB]/50"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subtitle" className="block text-sm font-medium text-neutral-300 mb-2">
                    {translations.price.modal.subtitle} *
                  </label>
                  <input
                    id="subtitle"
                    type="text"
                    placeholder={translations.price.modal.subtitlePlaceholder}
                    value={newPlan.subtitle}
                    onChange={(e) => setNewPlan({ ...newPlan, subtitle: e.target.value })}
                    className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#53B4AB] focus:ring-2 focus:ring-[#53B4AB]/50"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-neutral-300 mb-2">
                    {translations.price.modal.amount} (USD) *
                  </label>
                  <input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={newPlan.amount || ""}
                    onChange={(e) => setNewPlan({ ...newPlan, amount: Number(e.target.value) })}
                    className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#53B4AB] focus:ring-2 focus:ring-[#53B4AB]/50"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="applications" className="block text-sm font-medium text-neutral-300 mb-2">
                      {translations.price.modal.applicationsCount} *
                    </label>
                    <input
                      id="applications"
                      type="number"
                      placeholder="0"
                      value={newPlan.applications_count}
                      onChange={(e) => setNewPlan({ ...newPlan, applications_count: e.target.value })}
                      className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#53B4AB] focus:ring-2 focus:ring-[#53B4AB]/50"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="employees" className="block text-sm font-medium text-neutral-300 mb-2">
                      {translations.price.modal.employeesCount} *
                    </label>
                    <input
                      id="employees"
                      type="number"
                      placeholder="0"
                      value={newPlan.employees_count}
                      onChange={(e) => setNewPlan({ ...newPlan, employees_count: e.target.value })}
                      className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#53B4AB] focus:ring-2 focus:ring-[#53B4AB]/50"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="vendors" className="block text-sm font-medium text-neutral-300 mb-2">
                      {translations.price.modal.vendorsCount} *
                    </label>
                    <input
                      id="vendors"
                      type="number"
                      placeholder="0"
                      value={newPlan.vendors_count}
                      onChange={(e) => setNewPlan({ ...newPlan, vendors_count: e.target.value })}
                      className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#53B4AB] focus:ring-2 focus:ring-[#53B4AB]/50"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={handleAddPlan}
                  className="px-4 py-2 rounded-xl font-medium bg-[#53B4AB] hover:bg-[#479d94] text-neutral-900 transition-colors"
                >
                  {translations.price.modal.createPlan}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingPlan && (
          <div className="fixed w-full z-20 inset-0 bg-black/70 flex justify-center items-center">
            <div className="bg-neutral-900 rounded-xl p-5 shadow-xl max-w-2xl w-full mx-4 border border-neutral-800">
              <div className="flex justify-between text-xl font-bold mb-4">
                <h3 className="text-2xl font-bold mb-6 text-white">{translations.price.modal.editTitle}</h3>
                <button type="button" onClick={() => setEditingPlan(null)} className="text-white">
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

              <input
                type="number"
                value={editingPlan.id}
                disabled
                className="hidden"
              />

              <div className="space-y-5">
                <div>
                  <label htmlFor="edit-title" className="block text-sm font-medium text-neutral-300 mb-2">
                    {translations.price.modal.title} *
                  </label>
                  <input
                    id="edit-title"
                    type="text"
                    value={editingPlan.title}
                    onChange={(e) => setEditingPlan({ ...editingPlan, title: e.target.value })}
                    className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-[#53B4AB] focus:ring-2 focus:ring-[#53B4AB]/50"
                  />
                </div>

                <div>
                  <label htmlFor="edit-subtitle" className="block text-sm font-medium text-neutral-300 mb-2">
                    {translations.price.modal.subtitle} *
                  </label>
                  <input
                    id="edit-subtitle"
                    type="text"
                    value={editingPlan.subtitle}
                    onChange={(e) => setEditingPlan({ ...editingPlan, subtitle: e.target.value })}
                    className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-[#53B4AB] focus:ring-2 focus:ring-[#53B4AB]/50"
                  />
                </div>

                <div>
                  <label htmlFor="edit-amount" className="block text-sm font-medium text-neutral-300 mb-2">
                    {translations.price.modal.amount} (USD) *
                  </label>
                  <input
                    id="edit-amount"
                    type="number"
                    value={editingPlan.amount}
                    onChange={(e) => setEditingPlan({ ...editingPlan, amount: Number(e.target.value) })}
                    className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-[#53B4AB] focus:ring-2 focus:ring-[#53B4AB]/50"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="edit-applications" className="block text-sm font-medium text-neutral-300 mb-2">
                      {translations.price.modal.applicationsCount} *
                    </label>
                    <input
                      id="edit-applications"
                      type="number"
                      value={editingPlan.applications_count}
                      onChange={(e) => setEditingPlan({ ...editingPlan, applications_count: Number(e.target.value) })}
                      className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-[#53B4AB] focus:ring-2 focus:ring-[#53B4AB]/50"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-employees" className="block text-sm font-medium text-neutral-300 mb-2">
                      {translations.price.modal.employeesCount} *
                    </label>
                    <input
                      id="edit-employees"
                      type="number"
                      value={editingPlan.employees_count}
                      onChange={(e) => setEditingPlan({ ...editingPlan, employees_count: Number(e.target.value) })}
                      className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-[#53B4AB] focus:ring-2 focus:ring-[#53B4AB]/50"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-vendors" className="block text-sm font-medium text-neutral-300 mb-2">
                      {translations.price.modal.vendorsCount} *
                    </label>
                    <input
                      id="edit-vendors"
                      type="number"
                      value={editingPlan.vendors_count}
                      onChange={(e) => setEditingPlan({ ...editingPlan, vendors_count: Number(e.target.value) })}
                      className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-[#53B4AB] focus:ring-2 focus:ring-[#53B4AB]/50"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={handleUpdatePlan}
                  className="px-5 py-2 rounded-xl font-medium bg-[#53B4AB] hover:bg-[#479d94] text-neutral-900 transition-colors"
                >
                  {translations.price.modal.saveChanges}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingPlan && (
          <div className="fixed w-full z-20 inset-0 bg-black bg-opacity-70 flex justify-center items-center">
            <div className="bg-neutral-900 rounded-[18px] p-6 shadow-lg  mx-6">
              <h3 className="text-xl font-bold mb-4">{translations.price.modal.deleteTitle}</h3>
              <p className="mb-4">{translations.price.modal.deleteConfirm}</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeletingPlan(null)}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-[18px]"
                >
                  {translations.price.modal.cancel}
                </button>
                <button
                  onClick={() => {
                    handleDeletePlan(deletingPlan.id);
                    setDeletingPlan(null);
                  }}
                  className=" bg-red-500 hover:bg-red-600   text-black px-4 py-2 rounded-[18px]"
                >
                  {translations.price.modal.delete}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead className="text-white text-center">
              <tr>
                <th className="p-2">{translations.price.table.id}</th>
                <th className="p-2">{translations.price.table.title}</th>
                <th className="p-2">{translations.price.table.subtitle}</th>
                <th className="p-2">{translations.price.table.amount}</th>
                <th className="p-2">{translations.price.table.applications}</th>
                <th className="p-2">{translations.price.table.employees}</th>
                <th className="p-2">{translations.price.table.vendors}</th>
                <th className="p-2">{translations.price.table.action}</th>
              </tr>
            </thead>
            <tbody>
              {plans.length > 0 ? (
                plans.map((plan) => (
                  <tr key={plan.id} className="text-start shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.1)]">
                    <td className="p-2">{plan.id}</td>
                    <td className="p-2 text-[#F58C7B]">{plan.title}</td>
                    <td className="p-2">{plan.subtitle}</td>
                    <td className="p-2 font-bold text-[#53B4AB]">
                      {plan.amount} {translations.dashboard.cards.currency}
                    </td>
                    <td className="p-2">{plan.applications_count}</td>
                    <td className="p-2">{plan.employees_count}</td>
                    <td className="p-2">{plan.vendors_count}</td>
                    <td className="p-2">
                      <div>
                        <button
                          onClick={() => handleEditPlan(plan)}
                          className="bg-[#1F1F1F] text-white p-3 mr-2 rounded-lg "
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
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeletingPlan(plan)}
                          className="bg-[#1F1F1F] text-white p-3 rounded-lg"
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
                              stroke="white"
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
                  <td className="p-4 text-center" colSpan={8}>
                    {translations.price.table.noPlans}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}