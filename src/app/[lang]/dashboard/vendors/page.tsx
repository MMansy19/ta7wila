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
        createdAt: item.created_at,
        updatedAt: item.updated_at,
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
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-white/90 bg-gradient-to-r from-[#2A2A2A] to-[#1F1F1F] backdrop-blur-sm">
                    {[
                      { text: translations.vendors.table.id, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg> },
                      { text: translations.vendors.table.image, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
                      { text: translations.vendors.table.name, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
                      { text: translations.vendors.table.email, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                      { text: translations.vendors.table.mobile, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> },
                      { text: translations.vendors.table.status, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                      { text: translations.vendors.table.createdAt, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
                      { text: translations.vendors.table.actions, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg> }
                    ].map((header, index) => (
                      <th key={header.text} className={`px-4 py-4 text-right font-semibold text-sm tracking-wide border-b border-white/10 ${index === 0 ? 'first:rounded-tl-xl' : ''} ${index === 7 ? 'last:rounded-tr-xl' : ''}`}>
                        <div className="flex items-center justify-end gap-2 min-h-[24px]">
                          <span className="text-[#53B4AB] opacity-80">{header.icon}</span>
                          <span>{header.text}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr 
                        key={user.id} 
                        className={`transition-all duration-200 hover:bg-white/5 ${index === users.length - 1 ? 'hover:rounded-b-xl' : ''}`}
                      >
                        <td className="px-4 py-4 text-right">
                          <span className="text-white/80 font-medium">{user.id}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end">
                            <Image
                              src={user.image || "/no-dp_16.webp"}
                              className="rounded-full ring-2 ring-white/10"
                              alt={`${user.name}'s Avatar`}
                              width={40}
                              height={40}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-white font-medium">{user.name}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-white/70">{user.email}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span
                            className="text-white/70 font-mono"
                            style={{
                              direction: "ltr",
                              textAlign: "left",
                              display: "inline-block",
                            }}
                          >
                            {user.mobile}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span 
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.status === "active" 
                                ? "text-[#53B4AB] bg-[#53B4AB]/20" 
                                : "text-[#F58C7B] bg-[#F58C7B]/20"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex flex-col text-right">
                            <span className="font-medium text-white text-sm">
                              {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                            </span>
                            <span className="text-xs text-amber-400 font-medium">
                              {new Date(user.createdAt).toLocaleTimeString('ar-EG', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: true 
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button 
                            disabled={isSubmitting} 
                            onClick={(e) => handleSubmit(e, user, user.status === "active" ? "inactive" : "active")} 
                            className={`p-2 rounded-md transition-colors duration-200 ${
                              user.status === "active"
                                ? "text-red-400 hover:bg-red-400/10"
                                : "text-green-400 hover:bg-green-400/10"
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-white/60">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium">{translations.vendors.noData}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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

