"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link"
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { setCookie } from 'cookies-next';
import { useTranslation } from "@/context/translation-context";

const API_URL = "https://api.ta7wila.com";

console.log(process.env, process.env.NEXT_MAIN_API_VERSION);

type FormData = {
  email: string;
  password: string;
  name: string;
  mobile: string;
};

const AuthForm: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();
  const translations = useTranslation();

  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  const validationSchema = Yup.object({
    email: Yup.string().email(translations.auth.validation.invalidEmail).required(translations.auth.validation.emailRequired),
    password: Yup.string().min(8, translations.auth.validation.passwordLength).required(translations.auth.validation.passwordRequired),
    name: isRegister ? Yup.string().required(translations.auth.validation.nameRequired).min(3, translations.auth.validation.nameMinLength) : Yup.string(),
    mobile: isRegister ? Yup.string().matches(/^(?:\+2)?(010|011|012|015)[0-9]{8}$/, translations.auth.validation.mobileInvalid).required(translations.auth.validation.mobileRequired) : Yup.string(),
  });

  const register = async (values: FormData) => {
    try {
      const body = new URLSearchParams();
      body.append("name", values.name);
      body.append("mobile", values.mobile);
      body.append("email", values.email);
      body.append("password", values.password);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.errorMessage || "Something went wrong");
      }
      toast.success(translations.auth.toast.registerSuccess);
      setIsRegister(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred.");
    }
  };

  const login = async (values: FormData) => {
    try {
      const body = new URLSearchParams();
      body.append("email", values.email);
      body.append("password", values.password);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.errorMessage || "Something went wrong");

      }

      setCookie("token", data?.result?.token)
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred.");
    }
  };

  return (
    <div className="flex overflow-y-auto max-h-screen flex-wrap pl-8 bg-imgg min-h-screen max-md:px-5 ">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col self-start mt-6 max-md:mt-6 px-2">
        <Image width={200} height={200} loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/82abf788e81d00493505b733772e69127dd1ec73b52053d9ddbb4f60508f2764" className="object-contain w-36 mx-auto " alt="Company Logo" />
      </div>
      <div className="w-full min-h-screen flex">
        <div className="flex flex-col md:flex-row gap-8  w-full ">
          <div className="w-full h-max mt-20 lg:w-1/2 justify-center items-center flex">
            <div className="bg-[#1F1F1F] p-[22px] text-white rounded-[48px] w-full lg:w-4/5">
              <div className="md:mx-4 md:p-2 ">
                <div className="text-center">
                  <h4 className="pb-1 lg:text-4xl text-3xl  font-semibold text-gradient-to-r from-gray-100 via-gray-500 to-gray-800"> {isRegister ? translations.auth.signUp : translations.auth.signIn}</h4>
                </div>
                <Formik
                  initialValues={{
                    email: "",
                    password: "",
                    name: "",
                    mobile: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={async (values, actions) => {
                    try {
                      if (isRegister) {
                        await register(values);
                      } else {
                        await login(values);
                      }
                    } catch (err) {
                      console.error(err);
                    } finally {
                      actions.setSubmitting(false);
                    }
                  }}

                >
                  {({ isSubmitting }) => (
                    <Form className="py-4 ">
                      {isRegister && (
                        <div>
                          <div className="relative mb-2 mt-3 ">
                            <label htmlFor="name" className="block text-sm  mb-2">{translations.auth.name}</label>
                            <Field type="text" name="name" placeholder={translations.auth.name} className="w-full h-[44px] bg-[#444444] text-white  px-3 rounded-[16px] outline-none focus:ring-2 focus:ring-blue-500" />
                            <ErrorMessage name="name" component="div" className="text-[#F58C7B] text-sm my-2" />
                          </div>
                          <div className="relative mb-2 mt-3 ">
                            <label htmlFor="mobile" className="block text-sm  mb-2">{translations.auth.mobile}</label>
                            <Field type="text" name="mobile" placeholder={translations.auth.mobile} className="w-full h-[44px] bg-[#444444] text-white   px-3 rounded-[16px] outline-none focus:ring-2 focus:ring-blue-500" />
                            <ErrorMessage name="mobile" component="div" className="text-[#F58C7B] text-sm my-2" />
                          </div>
                        </div>
                      )}
                      <div className="relative mb-2 mt-3 ">
                        <label htmlFor="email" className="block text-sm  mb-2">{translations.auth.email}</label>
                        <Field type="email" name="email" placeholder={translations.auth.email} className="w-full h-[44px] bg-[#444444] text-white   px-3 rounded-[16px] outline-none focus:ring-2 focus:ring-blue-500" />
                        <ErrorMessage name="email" component="div" className="text-[#F58C7B] text-sm my-2" />
                      </div>
                      <div className="relative mb-4 mt-3  ">
                        <label htmlFor="password" className="block text-sm  mb-2">{translations.auth.password}</label>
                        <Field type="password" name="password" placeholder={translations.auth.password} className="w-full h-[44px] bg-[#444444] text-white   px-3 rounded-[16px] outline-none focus:ring-2 focus:ring-blue-500" />
                        <ErrorMessage name="password" component="div" className="text-[#F58C7B] text-sm my-2" />
                      </div>
                      {!isRegister && (
                        <div className="flex justify-end gap-2 mt-6 mb-1 px-2">

                          <div className="flex text-sm">
                            <p className="mb-0 me-1">{translations.auth.forgotPassword}</p>
                            <Link href="forgetpassword" className="text-[#53B4AB] hover:text-[#6F8798]">
                              {translations.auth.clickHere}
                            </Link>
                          </div>
                        </div>
                      )}
                      <div className="mb-2 pt-2  text-center">
                        <button
                          disabled={isSubmitting}
                          type="submit"
                          className=" inline-block w-full rounded-[16px] p-3  px-4 text-sm font-bold  leading-normal text-black bg-[#53B4AB]"
                        >
                          {isSubmitting ? translations.auth.submitting : isRegister ? translations.auth.signUp : translations.auth.signIn}

                        </button>
                      </div>
                    </Form>

                  )}
                </Formik>
                <div className="flex justify-center items-center mb-4">
                  <div className="flex items-center gap-1">
                    <p className="mb-0 me-1">{isRegister ? translations.auth.alreadyHaveAccount : translations.auth.dontHaveAccount}</p>
                    <button
                      type="button"

                      className="inline-block   font-medium  text-[#53B4AB]"
                      onClick={toggleForm}
                    >
                      {isRegister ? translations.auth.signIn : translations.auth.signUp}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>



          <div className="w-full lg:w-1/2 flex perspective-[1000px]">
            <Image
              src="/Group 48095540.svg"
              alt="Authentication Illustration"
              width={600}
              height={400}
              className="w-full"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

