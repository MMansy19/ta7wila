"use client";

import { useProfile } from "@/context/ProfileContext";
import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import getAuthHeaders from "../Shared/getAuth";
export const dynamic = 'force-dynamic';

interface User {
  id: number;
  name: string;
  webhook_url: string;
  mobile: string;
  email: string;
  image: string;
  status: string;
  createdAt: string;
  updatedAt: string;

}

export default function Vendors() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVendors, setTotalVendors] = useState(1);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const translations = useTranslation();
  const {profile} = useProfile();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


  const handleSubmit = async (e: React.FormEvent, user: User, newStatus: string) => {
    e.preventDefault();

    if (!user) {
      toast.error("No user selected to update.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        `${apiUrl}/vendors/update-status/${user.id}`,
        { status: newStatus },
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Status updated successfully!");

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, status: newStatus } : u
        )
      );    } catch (error: unknown) {
      let errorMessage = "An error occurred while updating the status.";
      
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { 
          response: { 
            data?: { 
              errorMessage?: string;
              message?: string;
              result?: Record<string, string>;
            } | string;
          }
        };

        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else if (err.response.data?.errorMessage) {
          errorMessage = err.response.data.errorMessage;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data?.result) {
          errorMessage = Object.values(err.response.data.result).join(", ");
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };


  const validationSchema = Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
      name:  Yup.string().required("Name is required").min(3),
      mobile: Yup.string().matches(/^(?:\+2)?(010|011|012|015)[0-9]{8}$/, "Mobile number is not valid").required("Mobile number is required") ,
    });


  const fetchUsers = async (currentPage: number) => {
    try {
      const response = await axios.get(
        `${apiUrl}/vendors?page=${currentPage}`,
        { headers: getAuthHeaders() }
      );
      const data = response.data.result.data;

      const transformedUsers: User[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        mobile: item.mobile,
        email: item.email,
        image: item.image,
        status: item.status,
        createdAt: new Date(item.created_at).toLocaleDateString(),
        updatedAt: new Date(item.updated_at).toLocaleDateString(),
      }));

      setUsers(transformedUsers);
      setTotalPages(response.data.result.totalPages);
      setTotalVendors(response.data.result.total)
    } catch (err: any) {
       
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAddVendor = async (values: { name: string; email: string; mobile: string; password: string }) => {
    setIsSubmitting(true)
    try {
      await axios.post(
        `${apiUrl}/vendors/add`,
        values,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Vendor added successfully!");
      setShowAddModal(false);
      fetchUsers(currentPage);    } catch (error: unknown) {
      let errorMessage = "An error occurred while adding the vendor.";
      
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { 
          response: { 
            data?: { 
              errorMessage?: string;
              message?: string;
              result?: Record<string, string>;
            } | string;
          }
        };

        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else if (err.response.data?.errorMessage) {
          errorMessage = err.response.data.errorMessage;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data?.result) {
          errorMessage = Object.values(err.response.data.result).join(", ");
        }
      }

      toast.error(errorMessage);
    }finally{
      setIsSubmitting(false)
    }
  };


  if (error) return <div className="text-center mt-28"><div className="text-red-500 ">Error: {error}</div></div>;


  return (
    <div>
      <div className="text-white grid">
        <div className="flex overflow-hidden flex-col  px-8 py-6 w-full bg-neutral-900 rounded-xl max-md:max-w-full text-white min-h-[calc(100vh-73px)]">
          <Toaster position="top-right" reverseOrder={false} />
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">{translations.vendors.title}</h1>
            <div className="flex flex-wrap gap-2 justify-end md:justify-start">
              <button className="bg-[#53B4AB] hover:bg-[#419189] text-black px-4 py-2 rounded-lg text-sm">
                {translations.vendors.total}: {totalVendors}
              </button>
              <button className="bg-[#53B4AB] hover:bg-[#479d94] text-black px-4 py-2 rounded-lg text-sm" onClick={() => setShowAddModal(true)}>
                {translations.vendors.addNew}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-2">{translations.vendors.table.id}</th>
                  <th className="p-2">{translations.vendors.table.image}</th>
                  <th className="p-2">{translations.vendors.table.name}</th>
                  <th className="p-2">{translations.vendors.table.email}</th>
                  <th className="p-2">{translations.vendors.table.mobile}</th>
                  <th className="p-2">{translations.vendors.table.status}</th>
                  <th className="p-2">{translations.vendors.table.createdAt}</th>
                  <th className="p-2">{translations.vendors.table.actions}</th>
                </tr>
              </thead>
              <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} >
                    <td className="p-2">{user.id}</td>
                    <td className="p-2">
                      <Image
                        src={user.image || "/no-dp_16.webp"}
                        className="rounded-full"
                        alt={`${user.name}'s Avatar`}
                        width={40}
                        height={40}
                      />
                    </td>
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">
                      <span
                        style={{
                          direction: "ltr",
                          textAlign: "left",
                          display: "inline-block",
                        }}
                      >
                        {user.mobile}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-lg text-black ${user.status === "active" ? "bg-green-500" : "bg-[#F58C7B]"}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-2">{user.createdAt}</td>
                    <td className="p-2">
                      <button  disabled={isSubmitting} onClick={(e) => handleSubmit(e, user, user.status === "active" ? "inactive" : "active")} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg">
                        {user.status === "active" ? translations.vendors.actions.deactivate : translations.vendors.actions.activate}
                      </button>
                    </td>
                  </tr>
                    ))
                ):(
                  <tr>
                    <td colSpan={8} className="text-center">{translations.vendors.noData}</td>
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
              className={`mx-1 rounded-full w-11 h-11 flex justify-center items-center ${currentPage === 1 ? "bg-[#53B4AB] cursor-not-allowed" : "bg-gray-700 hover:bg-gray-600"
                }`}
            >
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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

            <span className="px-2 py-3">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={` mx-1 rounded-full w-11 h-11 flex justify-center items-center ${currentPage === totalPages ? "bg-[#53B4AB] cursor-not-allowed" : "bg-gray-700 hover:bg-gray-600"
                }`}
            >
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 17.772L15 12.772L10 7.77197" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

            </button>
          </div>
          {showAddModal && (
           <div className="fixed w-full z-20 inset-0 bg-black bg-opacity-70 flex justify-center items-center">
           <div className="bg-neutral-900 rounded-xl p-6 shadow-lg w-[600px] mx-6">
             <h2 className="text-xl font-bold mb-4">{translations.vendors.modal.title}</h2>
             <Formik
               initialValues={{ name: "", email: "", mobile: "", password: "" }}
               validationSchema={Yup.object({
                email: Yup.string().email(translations.vendors.validation.email).required(),
                password: Yup.string().min(8, translations.vendors.validation.password).required(),
                name: Yup.string().required(translations.vendors.validation.name).min(3),
                mobile: Yup.string().matches(/^(?:\+2)?(010|011|012|015)[0-9]{8}$/, translations.vendors.validation.mobile).required(),
              })}
               onSubmit={(values) => handleAddVendor(values)}
             >
               {({ isSubmitting }) => (
                 <Form className="space-y-4">
                   <div>
                     <Field
                       type="text"
                       name="name"
                       placeholder="Name"
                       className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                     />
                     <ErrorMessage name="name" component="div" className="text-red-500 text-sm pt-2" />
                   </div>
                   <div>
                     <Field
                       type="email"
                       name="email"
                       placeholder="Email"
                       className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                     />
                     <ErrorMessage name="email" component="div" className="text-red-500 text-sm pt-2" />
                   </div>
                   <div>
                     <Field
                       type="text"
                       name="mobile"
                       placeholder="Mobile"
                       className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                     />
                     <ErrorMessage name="mobile" component="div" className="text-red-500 text-sm pt-2" />
                   </div>
                   <div>
                     <Field
                       type="password"
                       name="password"
                       placeholder="Password"
                       className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                     />
                     <ErrorMessage name="password" component="div" className="text-red-500 text-sm pt-2" />
                   </div>
                   <div className="flex justify-end space-x-2">
                     <button
                       type="button"
                       onClick={() => setShowAddModal(false)}
                       className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm mr-2"
                     >
                       {translations.vendors.modal.cancel}
                     </button>
                     <button
                       type="submit"
                       disabled={isSubmitting}
                       className="bg-[#53B4AB] hover:bg-[#479d94] text-black px-4 py-2 rounded-lg text-sm"
                     >
                       {isSubmitting ? translations.vendors.modal.adding : translations.vendors.modal.add}
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

