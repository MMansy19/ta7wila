"use client"
import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import getAuthHeaders from "../Shared/getAuth";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface User {
  id: number;
  username: string;
  name: string;
  mobile: string;
  email: string;
  [key: string]: any;
}

interface PasswordChangeValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const translations = useTranslation();
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const validationSchema = Yup.object({
    username: Yup.string().required(translations.auth.validation.nameRequired),
    name: Yup.string().required(translations.auth.validation.nameRequired),
    mobile: Yup.string().required(translations.auth.validation.mobileRequired),
    email: Yup.string().email(translations.auth.validation.invalidEmail).required(translations.auth.validation.emailRequired),
  });

  const passwordValidationSchema = Yup.object({
    currentPassword: Yup.string().required(translations.auth.forgetPassword.validation.passwordRequired),
    newPassword: Yup.string()
      .required(translations.auth.forgetPassword.validation.passwordRequired)
      .min(8, translations.auth.forgetPassword.validation.passwordMinLength),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], translations.auth.forgetPassword.validation.confirmPasswordMatch)
      .required(translations.auth.forgetPassword.validation.confirmPasswordRequired),
  });

  const copyToClipboard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText(token);
    toast.success(translations.settings.tokenCopied);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${apiUrl}/profile`, { headers: getAuthHeaders() });
        setUser(response.data.result);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else if (error.response?.data.errorMessage ) {
            toast.error(error.response?.data.errorMessage);
          } else if (error.response?.status === 401) {
            toast.error("Unauthorized access");
          } else {
            toast.error(translations.errors?.developerMode || "Failed to fetch profile data");
          }
        }
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchToken = async () => {
      try {
        const response = await axios.get(`${apiUrl}/token`, { headers: getAuthHeaders() });
        setToken(response.data.result.value);
      } catch (error) {
        console.error("Error fetching token:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error(translations.errors?.developerMode || "Failed to fetch token");
          }
        }
      }
    };

    fetchUserProfile();
    fetchToken();
  }, [translations.errors?.developerMode]);

  const handleSubmit = async (
    values: User,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    setSubmitting(true);
    try {
      const response = await axios.post(
        `${apiUrl}/profile/update`, 
        values, 
        { headers: getAuthHeaders() }
      );
      const updatedUser = response.data.result;
      setUser(prev => prev ? { ...prev, ...updatedUser } : updatedUser);
      toast.success(translations.settings?.profileUpdated || "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(translations.errors?.developerMode || "Failed to update profile");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async (
    values: PasswordChangeValues,
    { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    setSubmitting(true);
    try {
      await axios.post(
        `${apiUrl}/profile/change-password`,
        {
          id: user?.id,
          password: values.currentPassword,
          newPassword: values.newPassword,
        },
        { headers: getAuthHeaders() }
      );
      toast.success(translations.settings?.passwordChanged || "Password changed successfully");
      resetForm();
    } catch (error) {
      console.error("Error changing password:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(translations.errors?.developerMode || "Failed to change password");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#53B4AB]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <div className="text-center p-8 rounded-lg bg-neutral-800">
          <div className="text-red-500 text-xl mb-4">
            {translations.errors?.developerMode || "An error occurred"}
          </div>
          <div className="text-white/70 mb-4">{error}</div>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              window.location.reload();
            }}
            className="bg-[#53B4AB] hover:bg-[#347871] text-black px-6 py-2 rounded-lg"
          >
            {"Try Again"}
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#53B4AB]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-2  text-white mt-4">
      <Toaster position="top-right" reverseOrder={false} />
      <Formik
        initialValues={{
          id: user.id,
          username: user.username || "",
          name: user.name || "",
          mobile: user.mobile || "",
          email: user.email || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className=" ">
            <div className="flex overflow-x flex-col justify-center px-8 py-6 w-full bg-neutral-900 rounded-xl mb-4 max-md:max-w-full">
              <h2 className="text-2xl font-bold mb-4">{translations.header.profile}</h2>
              {/* Username */}
              <div className="mb-2">
                <Field type="hidden" name="id" />
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  {translations.auth.userName}
                </label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10 "
                />
                <ErrorMessage name="username" component="p" className=" text-red-500 text-sm mt-1" />
              </div>
              {/* Name */}
              <div className="mb-2">
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  {translations.auth.name}
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10 "
                />
                <ErrorMessage name="name" component="p" className=" text-red-500 text-sm mt-1" />
              </div>
              {/* Mobile */}
              <div className="mb-2">
                <label htmlFor="mobile" className="block text-sm font-medium mb-2">
                  {translations.auth.mobile}
                </label>
                <Field
                  type="text"
                  id="mobile"
                  name="mobile"
                  className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10 "
                />
                <ErrorMessage name="mobile" component="p" className=" text-red-500 text-sm mt-1" />
              </div>
              {/* Email */}
              <div className="mb-2">
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {translations.auth.email}
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10 "
                />
                <ErrorMessage name="email" component="p" className=" text-red-500 text-sm mt-1" />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 font-semibold text-sm bg-[#53B4AB]  text-black rounded-lg"

                >
                  {isSubmitting ? translations.auth.submitting : translations.header.updateProfile}
                </button>
              </div>
            </div>
          </Form>)}
      </Formik>
      <div className="flex overflow-x flex-col justify-center px-8 py-6 w-full bg-neutral-900 rounded-xl max-md:max-w-full mb-4">
        <form className="space-y-4">
          <h2 className="text-2xl font-bold my-2">{translations.settings.appToken}</h2>
          {/* App Token */}
          <div>
            <label htmlFor="app-token" className="block text-sm font-medium  mb-2">
            {translations.settings.Token}
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                id="app-token"
                value={token}
                className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10 "
                readOnly
                 />
              <button onClick={copyToClipboard} className="mt-1  bg-[#444444] border border-gray-600 rounded-lg p-2 ">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 6L17 14C17 16.2091 15.2091 18 13 18H7M17 6C17 3.79086 15.2091 2 13 2L10.6569 2C9.59599 2 8.57857 2.42143 7.82843 3.17157L4.17157 6.82843C3.42143 7.57857 3 8.59599 3 9.65685L3 14C3 16.2091 4.79086 18 7 18M17 6C19.2091 6 21 7.79086 21 10V18C21 20.2091 19.2091 22 17 22H11C8.79086 22 7 20.2091 7 18M9 2L9 4C9 6.20914 7.20914 8 5 8L3 8" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={passwordValidationSchema}
        onSubmit={handlePasswordChange}
      >
        {({ isSubmitting }) => (
          <Form className="flex overflow-x flex-col justify-center px-8 py-6 w-full space-y-4 bg-neutral-900 rounded-xl max-md:max-w-full">
            <h2 className="text-2xl font-bold my-2">{translations.auth.forgetPassword.resetTitle}</h2>
            {/* Current Password */}
            <div className="mb-2">
              <label htmlFor="current-password" className="block text-sm font-medium mb-2">
                {translations.auth.password}
              </label>
              <Field
                name="currentPassword"
                type="password"
                id="current-password"
                placeholder={translations.auth.password}
                autoComplete = 'off'
                autoCorrect = 'off'
                className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10 "
              />
              <ErrorMessage
                name="currentPassword"
                component="p"
                className="text-red-500 text-sm "
                aria-live="assertive"
              />
            </div>
            {/* New Password */}
            <div className="mb-2">
              <label htmlFor="new-password" className="block text-sm font-medium mb-2">
                {translations.auth.forgetPassword.newPassword}
              </label>
              <Field
                name="newPassword"
                type="password"
                id="new-password"
                placeholder={translations.auth.forgetPassword.newPassword}
                className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10 "
              />
              <ErrorMessage
                name="newPassword"
                component="p"
                className="text-red-500 text-sm"
                aria-live="assertive"
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-2">
              <label htmlFor="confirm-password" className="block text-sm font-medium mb-2">
                {translations.auth.forgetPassword.confirmPassword}
              </label>
              <Field
                name="confirmPassword"
                type="password"
                id="confirm-password"
                placeholder={translations.auth.forgetPassword.confirmPassword}
                className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10 "
              />
              <ErrorMessage
                name="confirmPassword"
                component="p"
                className="text-red-500 text-sm"
                aria-live="assertive"
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-[#53B4AB] text-sm text-black rounded-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? translations.auth.forgetPassword.resetting : translations.auth.forgetPassword.resetPassword}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}