"use client";
import Pagination from "@/components/Shared/Pagination";
import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { Search } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
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

  const handleSubmit = async (
    e: React.FormEvent,
    user: User,
    newStatus: string
  ) => {
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
      );    } catch (error: unknown) {
      let errorMessage = translations.errors.developerMode;
      
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

  const fetchUsers = async (page: number) => {
    try {
      const response = await axios.get(`${apiUrl}/users?page=${page}`, {
        headers: getAuthHeaders(),
      });
      const data = response.data.result.data.reverse();

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

      setUsers(transformedUsers.reverse());
      setFilteredUsers(transformedUsers.reverse());
      setTotalPages(response.data.result.totalPages);
      setTotalVendors(response.data.result.total);    } catch (error: unknown) {
      let errorMessage = translations.errors.developerMode;
      
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

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
    const mobileNumber = value.startsWith("+20")
      ? value
      : "+20" + value.replace(/^0+/, "");
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

        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-white/90 bg-gradient-to-r from-[#2A2A2A] to-[#1F1F1F] backdrop-blur-sm">
                  {[
                    { text: translations.users.table.id, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg> },
                    { text: translations.users.table.name, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
                    { text: translations.users.table.email, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                    { text: translations.users.table.mobile, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> },
                    { text: translations.users.table.status, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                    { text: translations.users.table.createdAt, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
                    { text: translations.users.table.actions, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg> }
                  ].map((header, index) => (
                    <th key={header.text} className={`px-4 py-4 text-right font-semibold text-sm tracking-wide border-b border-white/10 ${index === 0 ? 'first:rounded-tl-xl' : ''} ${index === 6 ? 'last:rounded-tr-xl' : ''}`}>
                      <div className="flex items-center justify-end gap-2 min-h-[24px]">
                        <span className="text-[#53B4AB] opacity-80">{header.icon}</span>
                        <span>{header.text}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`transition-all duration-200 hover:bg-white/5 ${index === filteredUsers.length - 1 ? 'hover:rounded-b-xl' : ''}`}
                    >
                      <td className="px-4 py-4 text-right">
                        <span className="text-white/80 font-medium">{user.id}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <span className="text-white font-medium">{user.name}</span>
                        </div>
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
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/user-info/${user.id}`}>
                            <button className="p-2 text-[#53B4AB] hover:bg-[#53B4AB]/10 rounded-md transition-colors duration-200 flex items-center">
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
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </button>
                          </Link>
                          <button
                            onClick={(e) =>
                              handleSubmit(
                                e,
                                user,
                                user.status === "active" ? "inactive" : "active"
                              )
                            }
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
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-white/60">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">{translations.users.noData}</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
