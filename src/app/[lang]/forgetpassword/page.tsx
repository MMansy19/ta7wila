"use client";
import { useTranslation } from '@/hooks/useTranslation';
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
export const dynamic = 'force-dynamic';

const API_URL = "https://api.ta7wila.com";

const ForgetPassword: React.FC = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset" | null>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const translations = useTranslation();

  const handleForgotPassword = async (
    values: { email: string },
    { setSubmitting }: any
  ) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/auth/forgot-password`,
        values
      );
      setEmail(values.email);
      setStep("otp");
      toast.success(translations.auth.forgetPassword.toast.otpSent);
    } catch (err: any) {
      toast.error(
        err.response?.data?.errorMessage ||
          translations.auth.forgetPassword.toast.otpError
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpVerification = async (
    values: { otp: string },
    { setSubmitting }: any
  ) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/verify`, {
        email,
        value: values.otp,
      });
      setOtp(values.otp);
      setStep("reset");
      toast.success(translations.auth.forgetPassword.toast.otpVerified);
    } catch (err: any) {
      toast.error(
        err.response?.data?.errorMessage ||
          translations.auth.forgetPassword.validation.otpInvalid
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordReset = async (
    values: { password: string; confirmPassword: string },
    { setSubmitting }: any
  ) => {
    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        value: otp,
        password: values.password,
      });
      toast.success(translations.auth.forgetPassword.toast.resetSuccess);
      router.push("/login");
    } catch (err: any) {
      toast.error(
        err.response?.data?.errorMessage ||
          translations.auth.forgetPassword.toast.resetError
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex overflow-y-auto max-h-screen flex-wrap pl-8 bg-imgg min-h-screen max-md:px-5">
      <Toaster position="top-left" reverseOrder={false} />
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
      <div className="w-full ">
        <div className="flex   w-full justify-center items-center">
          <div className="w-full max-w-3xl bg-[#1F1F1F] p-[22px] text-white rounded-xl ">
            <div className="md:mx-4 md:p-2 ">
              {step === "email" && (
                <Formik
                  initialValues={{ email: "" }}
                  validationSchema={Yup.object({
                    email: Yup.string()
                      .email(translations.auth.validation.invalidEmail)
                      .required(translations.auth.validation.emailRequired),
                  })}
                  onSubmit={handleForgotPassword}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="text-center pb-2">
                        <h3 className="pb-1 lg:text-3xl text-2xl  font-semibold text-gradient-to-r from-gray-100 via-gray-500 to-gray-800">
                          {translations.auth.forgetPassword.title}
                        </h3>
                        <p className="text-[#7E7E7E] py-2">
                          {translations.auth.forgetPassword.subTitle}
                        </p>
                      </div>

                      <div className="relative mb-2 mt-3 ">
                        <label htmlFor="email" className="block text-sm  mb-3">
                          {translations.auth.email} <span className="text-red-700">*</span>
                        </label>
                        <Field
                          type="email"
                          name="email"
                          placeholder="examble@gmail.com"
                          className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-sm my-2"
                        />
                      </div>
                      <div className="mb-2 pt-2  text-center">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className=" inline-block w-full rounded-lg p-3 px-4 text-sm font-bold leading-normal text-black bg-[#53B4AB]"
                        >
                          {isSubmitting
                            ? translations.auth.forgetPassword.sending
                            : translations.auth.forgetPassword.sendOtp}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}

              {step === "otp" && (
                <Formik
                  initialValues={{ otp: "" }}
                  validationSchema={Yup.object({
                    otp: Yup.string()
                      .required(
                        translations.auth.forgetPassword.validation.otpRequired
                      )
                      .length(
                        6,
                        translations.auth.forgetPassword.validation.otpLength
                      ),
                  })}
                  onSubmit={handleOtpVerification}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="text-center space-y-2">
                        <h3 className="pb-1 lg:text-3xl text-2xl font-semibold">
                          {translations.auth.forgetPassword.otpTitle}
                        </h3>
                        <p className="text-[#7E7E7E] py-2">
                          {translations.auth.forgetPassword.otpSubTitle}
                        </p>
                      </div>
                      <div className="relative mb-2 mt-3 ">
                        <Field
                          type="text"
                          name="otp"
                          placeholder={
                            translations.auth.forgetPassword.otpPlaceholder
                          }
                          className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                        />
                        <ErrorMessage
                          name="otp"
                          component="div"
                          className="text-red-500 text-sm my-2"
                        />
                      </div>

                      <div className="mb-2 pt-2 text-center">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-block w-full rounded-lg p-3 px-4 text-sm font-bold leading-normal text-black bg-[#53B4AB]"
                        >
                          {isSubmitting
                            ? translations.auth.forgetPassword.verifying
                            : translations.auth.forgetPassword.verifyOtp}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
              {step === "reset" && (
                <Formik
                  initialValues={{ password: "", confirmPassword: "" }}
                  validationSchema={Yup.object({
                    password: Yup.string()
                      .min(
                        8,
                        translations.auth.forgetPassword.validation
                          .passwordMinLength
                      )
                      .required(
                        translations.auth.forgetPassword.validation
                          .passwordRequired
                      ),
                    confirmPassword: Yup.string()
                      .oneOf(
                        [Yup.ref("password")],
                        translations.auth.forgetPassword.validation
                          .confirmPasswordMatch
                      )
                      .required(
                        translations.auth.forgetPassword.validation
                          .confirmPasswordRequired
                      ),
                  })}
                  onSubmit={handlePasswordReset}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="text-center">
                        <h3 className="pb-1 lg:text-3xl text-2xl font-semibold">
                          {translations.auth.forgetPassword.resetTitle}
                        </h3>
                        <p className="text-[#7E7E7E] py-2">
                          {translations.auth.forgetPassword.resetSubTitle}
                        </p>
                      </div>
                      <div className="relative mb-2 mt-3 ">
                        <label
                          htmlFor="password"
                          className="block text-sm mb-2"
                        >
                          {translations.auth.forgetPassword.newPassword} <span className="text-red-700">*</span>
                        </label>
                        <Field
                          type="password"
                          name="password"
                          placeholder={
                            translations.auth.forgetPassword.newPassword
                          }
                          className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-500 text-sm my-2"
                        />
                      </div>
                      <div className="relative mb-2 mt-3 ">
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm mb-2"
                        >
                          {translations.auth.forgetPassword.confirmPassword} <span className="text-red-700">*</span>
                        </label>
                        <Field
                          type="password"
                          name="confirmPassword"
                          placeholder={
                            translations.auth.forgetPassword.confirmPassword
                          }
                          className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="text-red-500 text-sm my-2"
                        />
                      </div>
                      <div className="mb-2 pt-2 text-center">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-block w-full rounded-lg p-3 px-4 text-sm font-bold leading-normal text-black bg-[#53B4AB]"
                        >
                          {isSubmitting
                            ? translations.auth.forgetPassword.resetting
                            : translations.auth.forgetPassword.resetPassword}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
