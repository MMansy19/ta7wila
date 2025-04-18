"use client";
import { useTranslation } from "@/context/translation-context";
import axios from "axios";

import Pagination from "@/components/Shared/Pagination";
import { Search } from "lucide-react";
import { useParams } from "next/navigation";
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
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVendors, setTotalVendors] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const translations = useTranslation();
  const params = useParams();
  const lang = params.lang as string;

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
      toast.success(translations.errors.statusUpdated);

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, status: newStatus } : u
        )
      );
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        translations.errors.developerMode;
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
      setFilteredUsers(transformedUsers.reverse());
      setTotalPages(response.data.result.totalPages);
      setTotalVendors(response.data.result.total)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        translations.errors.developerMode
      );
    } finally {
      setLoading(false);
    }
  }

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.mobile.includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);


  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
          <h2 className="text-2xl font-semibold">{translations.users.title}</h2>
          <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder={translations.users.search.placeholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 bg-neutral-800 rounded-lg text-sm text-white placeholder:text-white/50 !outline-none focus:outline-none focus:ring-0 border-0 focus:border-0 w-[300px]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          </div>
     
   
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="text-start border-b border-white/10">
                    <td className="p-2">{user.id}</td>
                    
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.mobile}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-.5 rounded-full text-sm ${user.status === "active" ? "text-[#53B4AB] bg-[#0FDBC8] bg-opacity-20 cursor-not-allowed" : "text-[#F58C7B] bg-[#F58C7B] bg-opacity-20 cursor-pointer"
                          }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-2">{user.createdAt}</td>
                    <td className="p-2">
                      <button
                        onClick={(e) => handleSubmit(e, user, user.status === "active" ? "inactive" : "active")}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full text-sm"
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
      
       <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          lang={lang}
        />
      </div>
    </div>

  );
}

