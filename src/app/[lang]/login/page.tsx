"use client";
import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import { setCookie } from "cookies-next";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as Yup from "yup";

const API_URL = "https://api.ta7wila.com";

type FormData = {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
  mobile?: string;
};

const LoginForm: React.FC<{ onSwitchToRegister: () => void }> = ({
  onSwitchToRegister,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const translations = useTranslation();
  // Add this line if using Next.js 13+

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(translations.auth.validation.invalidEmail)
      .required(translations.auth.validation.emailRequired),
    password: Yup.string()
      .min(8, translations.auth.validation.passwordLength)
      .required(translations.auth.validation.passwordRequired),
  });

  const login = async (values: FormData) => {
    try {
      const body = new URLSearchParams();
      body.append("email", values.email);
      body.append("password", values.password);

      const response = await axios.post(`${API_URL}/auth/login`, body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const data = response.data;
      if (response.status !== 200) {
        throw new Error(data.errorMessage || "Something went wrong");
      }

      setCookie("token", data?.result?.token);
      toast.success("Login successful!");

      const pathSegments = window.location.pathname.split('/');
      const locale = pathSegments[1] || 'en';
  
      // Redirect with locale
      router.push(`/${locale}/dashboard`);
      
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    }
  };

  return (
    <div className="bg-[#1F1F1F] p-4 text-white rounded-xl w-full lg:w-4/5">
      <div className="md:mx-4">
        <div className="text-center">
          <h4 className="pb-1 lg:text-4xl text-3xl font-semibold text-gradient-to-r from-gray-100 via-gray-500 to-gray-800">
            {translations.auth.signIn}
          </h4>
        </div>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            try {
              await login(values);
            } catch (err) {
              console.error(err);
            } finally {
              actions.setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="py-4">
              <div className="relative mb-2 mt-3">
                <label htmlFor="email" className="block text-sm mb-2">
                  {translations.auth.email}
                </label>
                <Field
                  type="email"
                  name="email"
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder={translations.auth.email}
                  className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-[#F58C7B] text-sm my-2"
                />
              </div>
              <div className="relative mb-4 mt-3">
                <label htmlFor="password" className="block text-sm mb-2">
                  {translations.auth.password}
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder={translations.auth.password}
                    className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute end-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-[#F58C7B] text-sm my-2"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4 mb-1 px-2">
                <div className="flex text-sm">
                  <div className="mb-0 me-1">
                    {translations.auth.forgotPassword}
                  </div>
                  <Link
                    href="forgetpassword"
                    className="text-[#53B4AB] hover:text-[#6F8798]"
                  >
                    {translations.auth.clickHere}
                  </Link>
                </div>
              </div>

              <div className="mb-2 pt-2 text-center">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="inline-block w-full rounded-lg p-3 px-4 text-sm font-bold leading-normal text-black bg-[#53B4AB]"
                >
                  {isSubmitting
                    ? translations.auth.submitting
                    : translations.auth.signIn}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <div className="flex justify-center items-center mb-4">
          <div className="flex items-center gap-1">
            <div className="mb-0 me-1">{translations.auth.dontHaveAccount}</div>
            <button
              type="button"
              className="inline-block font-medium text-[#53B4AB]"
              onClick={onSwitchToRegister}
            >
              {translations.auth.signUp}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Register Form Component
const RegisterForm: React.FC<{ onSwitchToLogin: () => void }> = ({
  onSwitchToLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const translations = useTranslation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(translations.auth.validation.invalidEmail)
      .required(translations.auth.validation.emailRequired),
    password: Yup.string()
      .min(8, translations.auth.validation.passwordLength)
      .required(translations.auth.validation.passwordRequired),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
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

  const register = async (values: FormData) => {
    try {
      const body = new URLSearchParams();
      if (values.name) body.append("name", values.name);
      if (values.mobile) body.append("mobile", values.mobile);
      body.append("email", values.email);
      body.append("password", values.password);

      const response = await axios.post(`${API_URL}/auth/register`, body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const data = response.data;
      if (response.status !== 200) {
        throw new Error(data.errorMessage || "Something went wrong");
      }

      toast.success(translations.auth.toast.registerSuccess);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    }
  };

  return (
    <div className="bg-[#1F1F1F] p-4 text-white rounded-xl w-full lg:w-4/5">
      <div className="md:mx-4">
        <div className="text-center">
          <h4 className="pb-1 lg:text-4xl text-3xl font-semibold text-gradient-to-r from-gray-100 via-gray-500 to-gray-800">
            {translations.auth.signUp}
          </h4>
        </div>
        <Formik
          initialValues={{
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
            mobile: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            try {
              await register(values);
              actions.resetForm();
            } catch (err) {
              console.error(err);
            } finally {
              actions.setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="py-4">
              <div className="relative mb-2 mt-3">
                <label htmlFor="name" className="block text-sm mb-2">
                  {translations.auth.name}
                </label>
                <Field
                  type="text"
                  name="name"
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder={translations.auth.name}
                  className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-[#F58C7B] text-sm my-2"
                />
              </div>
              <div className="relative mb-2 mt-3">
                <label htmlFor="mobile" className="block text-sm mb-2">
                  {translations.auth.mobile}
                </label>
                <Field
                  type="text"
                  name="mobile"
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder={translations.auth.mobile}
                  className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                />
                <ErrorMessage
                  name="mobile"
                  component="div"
                  className="text-[#F58C7B] text-sm my-2"
                />
              </div>
              <div className="relative mb-2 mt-3">
                <label htmlFor="email" className="block text-sm mb-2">
                  {translations.auth.email}
                </label>
                <Field
                  type="email"
                  name="email"
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder={translations.auth.email}
                  className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-[#F58C7B] text-sm my-2"
                />
              </div>
              <div className="relative mb-4 mt-3">
                <label htmlFor="password" className="block text-sm mb-2">
                  {translations.auth.password}
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder={translations.auth.password}
                    className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute end-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-[#F58C7B] text-sm my-2"
                />
              </div>

              <div className="relative mb-4 mt-3">
                <label htmlFor="confirmPassword" className="block text-sm mb-2">
                {translations.auth.confirmPassword}
                </label>
                <div className="relative">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder="Confirm Password"
                    className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute end-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-[#F58C7B] text-sm my-2"
                />
              </div>

              <div className="mb-2 pt-2 text-center">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="inline-block w-full rounded-lg p-3 px-4 text-sm font-bold leading-normal text-black bg-[#53B4AB]"
                >
                  {isSubmitting
                    ? translations.auth.submitting
                    : translations.auth.signUp}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <div className="flex justify-center items-center mb-4">
          <div className="flex items-center gap-1">
            <div className="mb-0 me-1">
              {translations.auth.alreadyHaveAccount}
            </div>
            <button
              type="button"
              className="inline-block font-medium text-[#53B4AB]"
              onClick={onSwitchToLogin}
            >
              {translations.auth.signIn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Auth Form Component
const AuthForm: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();
  const translations = useTranslation();

  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  return (
    <div className="flex overflow-y-auto max-h-screen flex-wrap pl-8 bg-imgg min-h-screen max-md:px-5">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col self-start mt-6 max-md:mt-6 px-2">
        <Image
          width={200}
          height={200}
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/82abf788e81d00493505b733772e69127dd1ec73b52053d9ddbb4f60508f2764"
          className="object-contain w-36 mx-auto"
          alt="Company Logo"
        />
      </div>
      <div className="w-full min-h-screen flex">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          <div className="w-full h-max mt-20 lg:w-1/2 justify-center items-center flex">
            {isRegister ? (
              <RegisterForm onSwitchToLogin={toggleForm} />
            ) : (
              <LoginForm onSwitchToRegister={toggleForm} />
            )}
          </div>

          <div className="w-full lg:w-1/2 flex perspective-[1000px]">
            <Image
              src="/Group 48095540.svg"
              alt="Authentication Illustration"
              width={600}
              height={400}
              className="w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
