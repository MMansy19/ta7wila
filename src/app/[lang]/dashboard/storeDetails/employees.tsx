"use client";
import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import getAuthHeaders from "../Shared/getAuth";
import { formatDateTime } from "@/lib/utils";
import { Users, Plus, X, User, Mail, Phone, Lock } from "lucide-react";
import { Params } from "./types";

type EmployeesProps = {
  employees?: Array<{
    id: number;
    name: string;
    email: string;
    mobile: string;
    created_at?: string;
  }>;
  params: Params;
};

export default function Employees({ employees = [], params }: EmployeesProps) {
  const translations = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employeeList, setEmployeeList] = useState(employees);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleAddEmployee = async (values: {
    application_id: string;
    name: string;
    email: string;
    mobile: string;
    password: string;
  }) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${apiUrl}/employees/add`, values, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });

      toast.success(translations.storeDetails.employees.toast.success);
      setEmployeeList([...employeeList, response.data]);
      setShowAddModal(false);
    } catch (err: any) {
      const message =
        err.response?.data?.errorMessage ||
        translations.storeDetails.employees.toast.error;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    name: Yup.string().required("Name is required").min(3),
    mobile: Yup.string()
      .matches(
        /^(?:\+2)?(010|011|012|015)[0-9]{8}$/,
        "Mobile number is not valid"
      )
      .required("Mobile number is required"),
  });

  return (
    <div className="bg-gradient-to-br from-neutral-800/40 to-neutral-900/60 backdrop-blur-sm rounded-2xl border border-white/10 p-4 lg:p-6 h-full flex flex-col">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Users className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-base lg:text-lg font-bold text-white">{translations.storeDetails.employees.title}</h2>
            <p className="text-white/60 text-xs lg:text-sm">فريق العمل</p>
          </div>
        </div>
        
        <button
          className="group flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-gradient-to-r from-[#53B4AB]/20 to-[#53B4AB]/10 hover:from-[#53B4AB]/30 hover:to-[#53B4AB]/20 text-[#53B4AB] hover:text-white rounded-xl text-xs lg:text-sm font-medium transition-all duration-200 border border-[#53B4AB]/20 hover:border-[#53B4AB]/40"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-3 h-3 lg:w-4 lg:h-4 group-hover:rotate-90 transition-transform duration-200" />
          <span className="hidden sm:inline">{translations.storeDetails.employees.addNew}</span>
          <span className="sm:hidden">إضافة</span>
        </button>
      </div>

      {employees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 lg:py-12 text-white/50 flex-1">
          <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center mb-3 lg:mb-4 backdrop-blur-sm border border-white/10">
            <Users className="w-6 h-6 lg:w-8 lg:h-8 text-white/30" />
          </div>
          <h3 className="text-base lg:text-lg font-semibold text-white/70 mb-2">لا يوجد موظفون</h3>
          <p className="text-xs lg:text-sm text-center mb-4">{translations.employees.noData}</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-gradient-to-r from-[#53B4AB] to-[#4cb0a6] hover:from-[#4cb0a6] hover:to-[#53B4AB] text-black rounded-xl text-xs lg:text-sm font-medium transition-all duration-200"
          >
            <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
            إضافة موظف جديد
          </button>
        </div>
      ) : (
        <div className="space-y-2 lg:space-y-3 flex-1 overflow-y-auto">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="group bg-black/20 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-white/10 hover:border-white/20 transition-all duration-200 hover:bg-black/30"
            >
              <div className="flex items-start gap-3 lg:gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#53B4AB]/20 to-[#53B4AB]/10 text-[#53B4AB] text-sm lg:text-lg font-bold border border-[#53B4AB]/20 flex-shrink-0">
                  {employee.name.charAt(0).toUpperCase()}
                </div>
                
                {/* Employee Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm lg:text-base mb-1 lg:mb-2 truncate">{employee.name}</h3>
                  
                  <div className="space-y-1 lg:space-y-2">
                    <div className="flex items-center gap-2 text-xs lg:text-sm">
                      <Mail className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-blue-400 flex-shrink-0" />
                      <span className="text-blue-400 truncate">{employee.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs lg:text-sm">
                      <Phone className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-[#F58C7B] flex-shrink-0" />
                      <span className="text-[#F58C7B]" style={{ direction: "ltr" }}>{employee.mobile}</span>
                    </div>
                  </div>
                  
                  {employee.created_at && (
                    <div className="flex items-center gap-2 text-xs text-white/60 mt-2">
                      <span className="hidden sm:inline">انضم في:</span>
                      <span className="sm:hidden">انضم:</span>
                      <span className="hidden lg:inline">{formatDateTime(employee.created_at).date}</span>
                      <span className="text-amber-400">{formatDateTime(employee.created_at).time}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-neutral-800/90 to-neutral-900/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#53B4AB]/20 to-[#53B4AB]/10 flex items-center justify-center border border-[#53B4AB]/20">
                  <Plus className="w-5 h-5 text-[#53B4AB]" />
                </div>
                <h3 className="font-semibold text-lg text-white">
                  {translations.storeDetails.employees.addNew}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
            
            <Formik
              initialValues={{
                application_id: params.id,
                name: "",
                email: "",
                mobile: "",
                password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => handleAddEmployee(values)}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-white/80 text-sm mb-2 font-medium">
                      <User className="w-4 h-4" />
                      {translations.storeDetails.employees.form.name}
                    </label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="أدخل اسم الموظف"
                      className="w-full px-4 py-3 bg-neutral-700/50 backdrop-blur-sm text-white rounded-xl border border-white/10 focus:border-[#53B4AB]/50 focus:outline-none focus:ring-2 focus:ring-[#53B4AB]/20 transition-all"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-white/80 text-sm mb-2 font-medium">
                      <Mail className="w-4 h-4" />
                      {translations.storeDetails.employees.form.email}
                    </label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="example@email.com"
                      className="w-full px-4 py-3 bg-neutral-700/50 backdrop-blur-sm text-white rounded-xl border border-white/10 focus:border-[#53B4AB]/50 focus:outline-none focus:ring-2 focus:ring-[#53B4AB]/20 transition-all"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-white/80 text-sm mb-2 font-medium">
                      <Phone className="w-4 h-4" />
                      {translations.storeDetails.employees.form.mobile}
                    </label>
                    <Field
                      type="text"
                      name="mobile"
                      placeholder="01234567890"
                      className="w-full px-4 py-3 bg-neutral-700/50 backdrop-blur-sm text-white rounded-xl border border-white/10 focus:border-[#53B4AB]/50 focus:outline-none focus:ring-2 focus:ring-[#53B4AB]/20 transition-all"
                    />
                    <ErrorMessage
                      name="mobile"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-white/80 text-sm mb-2 font-medium">
                      <Lock className="w-4 h-4" />
                      {translations.storeDetails.employees.form.password}
                    </label>
                    <Field
                      type="password"
                      name="password"
                      placeholder="كلمة مرور قوية"
                      className="w-full px-4 py-3 bg-neutral-700/50 backdrop-blur-sm text-white rounded-xl border border-white/10 focus:border-[#53B4AB]/50 focus:outline-none focus:ring-2 focus:ring-[#53B4AB]/20 transition-all"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-white/60 hover:text-white transition-colors"
                    >
                      {translations.storeDetails.employees.form.buttons.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#53B4AB] to-[#4cb0a6] hover:from-[#4cb0a6] hover:to-[#53B4AB] disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black rounded-xl font-medium transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-black/30 border-t-black rounded-full" />
                          {translations.storeDetails.employees.form.buttons.adding}
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          {translations.storeDetails.employees.form.buttons.add}
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}
