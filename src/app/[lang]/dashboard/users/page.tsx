"use client";
import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";

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

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVendors, setTotalVendors] = useState(1);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const translations = useTranslation();

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
        `${apiUrl}/users/update-status/${user.id}`,
        { status: newStatus },
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Status updated successfully!");

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, status: newStatus } : u
        )
      );
    } catch (err: any) {
      const message =
        err.response?.data?.message || "An error occurred while updating the status.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const fetchUsers = async (page: number) => {
    try {
      const response = await axios.get(
        `${apiUrl}/users?page=${page}`,
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

      setUsers(transformedUsers.reverse());
      setTotalPages(response.data.result.totalPages);
      setTotalVendors(response.data.result.total)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "You aren't developer to do this action, upgrade your account from normal user to developer to be able to do this action then try again"
      );
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


  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const mobileNumber = value.startsWith("+20") ? value : "+20" + value.replace(/^0+/, "");
    setSelectedUser((prev) => {
      if (prev) {
        return { ...prev, mobile: mobileNumber };
      }
      return prev;
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
 
    <div className="text-white grid">
      <div className="flex overflow-hidden flex-col px-8 py-6 w-full bg-neutral-900 rounded-lg max-md:max-w-full text-white min-h-[calc(100vh-73px)]">
        <Toaster position="top-right" reverseOrder={false} />

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">{translations.users.title}</h1>
          <div className="space-x-2">
            <button className="bg-[#53B4AB] hover:bg-[#459a91] text-black px-4 py-2 rounded-lg text-sm">
              {translations.users.total}: {totalVendors}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-start">
                <th className="p-2">{translations.users.table.id}</th>
               
                <th className="p-2">{translations.users.table.name}</th>
                <th className="p-2">{translations.users.table.email}</th>
                <th className="p-2">{translations.users.table.mobile}</th>
                <th className="p-2">{translations.users.table.status}</th>
                <th className="p-2">{translations.users.table.createdAt}</th>
                <th className="p-2">{translations.users.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="text-start border-b border-white/10">
                    <td className="p-2">{user.id}</td>
                    
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.mobile}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-.5 rounded-[12px] ${user.status === "active" ? "text-[#53B4AB] bg-[#0FDBC8] bg-opacity-30 cursor-not-allowed" : "text-[#F58C7B] bg-[#F58C7B] bg-opacity-50 cursor-pointer"
                          }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-2">{user.createdAt}</td>
                    <td className="p-2">
                      <button
                        onClick={(e) => handleSubmit(e, user, user.status === "active" ? "inactive" : "active")}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-[12px]"
                      >
                        {user.status === "active" ? translations.users.actions.deactivate : translations.users.actions.activate}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center">{translations.users.noData}</td>
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

      </div>
    </div>

  );
}

