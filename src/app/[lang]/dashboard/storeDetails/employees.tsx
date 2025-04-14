"use client";
import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import getAuthHeaders from "../Shared/getAuth";
import { Params } from "./types";

type EmployeesProps = {
  employees?: Array<{
    id: number;
    name: string;
    email: string;
    mobile: string;
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
    <div className="bg-neutral-900 shadow-sm p-4 rounded-lg h-full text-white">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold mb-4">
          {translations.storeDetails.employees.title}
        </h2>
        <button
          className="bg-[#53B4AB] hover:bg-[#479d94] text-black px-4 py-2 rounded-[16px] text-sm"
          onClick={() => setShowAddModal(true)}
        >
          {translations.storeDetails.employees.addNew}
        </button>
      </div>
      {employees.map((employee) => (
        <div
          key={employee.id}
          className="mb-2 p-3 bg-[#1F1F1F] rounded-lg shadow-sm text-white flex items-center gap-3"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-700 text-white text-lg font-bold">
            {employee.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{employee.name}</p>
            <p className="text-sm">Email : {employee.email}</p>
            <p className="text-sm">Mobile : {employee.mobile}</p>
          </div>
        </div>
      ))}

      {showAddModal && (
        <div className="fixed w-full z-20 inset-0 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="bg-neutral-900 rounded-[18px] p-6 shadow-lg w-[600px] mx-6">
            <h2 className="text-xl font-bold mb-4">
              {translations.storeDetails.employees.addNew}
            </h2>
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
                    <Field
                      type="text"
                      name="name"
                      placeholder={
                        translations.storeDetails.employees.form.name
                      }
                      className="w-full px-3 py-2 bg-[#444444] text-white rounded-[18px]"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm pt-2"
                    />
                  </div>
                  <div>
                    <Field
                      type="email"
                      name="email"
                      placeholder={
                        translations.storeDetails.employees.form.email
                      }
                      className="w-full px-3 py-2 bg-[#444444] text-white rounded-[18px]"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm pt-2"
                    />
                  </div>
                  <div>
                    <Field
                      type="text"
                      name="mobile"
                      placeholder={
                        translations.storeDetails.employees.form.mobile
                      }
                      className="w-full px-3 py-2 bg-[#444444] text-white rounded-[18px]"
                    />
                    <ErrorMessage
                      name="mobile"
                      component="div"
                      className="text-red-500 text-sm pt-2"
                    />
                  </div>
                  <div>
                    <Field
                      type="password"
                      name="password"
                      placeholder={
                        translations.storeDetails.employees.form.password
                      }
                      className="w-full px-3 py-2 bg-[#444444] text-white rounded-[18px]"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm pt-2"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-[18px] mr-2"
                    >
                      {translations.storeDetails.employees.form.buttons.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#53B4AB] hover:bg-[#479d94] text-black px-4 py-2 rounded-[18px]"
                    >
                      {isSubmitting
                        ? translations.storeDetails.employees.form.buttons
                            .adding
                        : translations.storeDetails.employees.form.buttons.add}
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
