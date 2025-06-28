"use client";
import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import getAuthHeaders from "../Shared/getAuth";
import AddEmployeeModal from "./addEmployeeModal";
import EditEmployeeModal from "./editEmployeeModal";
import EmployeeTable from "./employeeTable";
import Header from "./header";
import Pagination from "./pagination";
import { Store, User } from "./types";
export const dynamic = 'force-dynamic';

export default function Employees() {
  const translations = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchUsers = async (currentPage: number) => {
    try {
      const response = await axios.get(
        `${apiUrl}/employees?page=${currentPage}`,
        { headers: getAuthHeaders() }
      );
      const data = response.data.result.data;

      const transformedUsers: User[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        mobile: item.mobile,
        email: item.email,
        status: item.status,
        application_id: item.employee_applications?.[0]?.id?? '',
        createdAt: new Date(item.created_at).toLocaleDateString(),
        updatedAt: new Date(item.updated_at).toLocaleDateString(),
      }));
      setUsers(transformedUsers);
      setTotalPages(response.data.result.totalPages);
      setTotalEmployees(response.data.result.total);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    console.log(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (values: User) => {
    setIsSubmitting(true);
    try {
      await axios.post(`${apiUrl}/employees/update`, values, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });
      toast.success("Employee updated successfully!");
      setShowEditModal(false);
    } catch (err) {
      toast.error("Error updating employee.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent,
    user: User,
    newStatus: string
  ) => {
    e.preventDefault();

    if (!user) {
      toast.error(translations.employees.errors.noUserSelected);
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        `${apiUrl}/employees/update-status/${user.id}`,
        { status: newStatus },
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(translations.employees.toast.statusUpdated);

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, status: newStatus } : u
        )
      );
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        translations.employees.errors.updateFailed;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(translations.auth.validation.invalidEmail)
      .required(translations.auth.validation.emailRequired),
    password: Yup.string()
      .min(8, translations.auth.validation.passwordLength)
      .required(translations.auth.validation.passwordRequired),
    name: Yup.string()
      .required(translations.auth.validation.nameRequired)
      .min(3, translations.auth.validation.nameMinLength),
    mobile: Yup.string()
      .matches(
        /^(?:\+2)?(010|011|012|015)[0-9]{8}$/,
        translations.auth.validation.mobileInvalid
      )
      .required(translations.auth.validation.mobileRequired),
  });

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(`${apiUrl}/applications`, {
          headers: getAuthHeaders(),
        });

        const transformedStores: Store[] = response.data.result.data.map(
          (store: any) => ({
            id: store.id,
            name: store.name,
          })
        );
        setStores(transformedStores);
      } catch (err) {
        toast.error("Failed to load stores");
      }
    };
    fetchStores();
  }, []);

  const handleAddEmployee = async (values: {
    name: string;
    email: string;
    mobile: string;
    password: string;
    application_id: string;
  }) => {
    setIsSubmitting(true);
    try {
      await axios.post(`${apiUrl}/employees/add`, values, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });
      toast.success("Employee added successfully!");
      setShowAddModal(false);
      fetchUsers(currentPage);
    } catch (err: any) {
      const message =
        err.response?.data?.errorMessage ||
        "An error occurred while adding the Employee.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error)
    return (
      <div className="text-center mt-28">
        <div className="text-red-500">{translations.storeDetails.error}</div>
      </div>
    );

  return (
    <div className="text-white grid">
      <div className="flex overflow-hidden flex-col px-8 py-6 w-full bg-neutral-900 rounded-lg max-md:max-w-full text-white min-h-[calc(100vh-73px)]">
        <Toaster position="top-right" reverseOrder={false} />

        <Header
          totalEmployees={totalEmployees}
          setShowAddModal={setShowAddModal}
        />

        <EmployeeTable
          users={users}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
          handleEditUser={handleEditUser}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />

        {showAddModal && (
          <AddEmployeeModal
            setShowAddModal={setShowAddModal}
            handleAddEmployee={handleAddEmployee}
            validationSchema={validationSchema}
            stores={stores}
          />
        )}

        {showEditModal && selectedUser && (
          <EditEmployeeModal
            setShowEditModal={setShowEditModal}
            handleUpdateUser={handleUpdateUser}
            validationSchema={validationSchema}
            selectedUser={selectedUser}
            
          />
        )}
      </div>
    </div>
  );
}
