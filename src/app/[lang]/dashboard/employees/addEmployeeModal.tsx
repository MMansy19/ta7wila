"use client";
import { useTranslation } from "@/context/translation-context";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import FormField from "../Shared/FormField";
import { Store } from "./types";

interface AddEmployeeModalProps {
  setShowAddModal: (show: boolean) => void;
  handleAddEmployee: (values: any) => void;
  validationSchema?: Yup.AnySchema;
  stores: Store[];
}

const ModalWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="fixed w-full z-20 inset-0 bg-black bg-opacity-70 flex justify-center items-center">
    <div className="bg-neutral-900 rounded-[18px] p-6 shadow-lg w-[600px] mx-6">
      {children}
    </div>
  </div>
);

const AddEmployeeModal = ({
  setShowAddModal,
  handleAddEmployee,
  validationSchema,
  stores,
}: AddEmployeeModalProps) => {
  const translations = useTranslation();
  const required = true;
  
  // Default validation schema if none is provided
  const defaultValidationSchema = Yup.object().shape({
    application_id: Yup.string().required("Required"),
    name: Yup.string()
      .min(3, translations.auth.validation.nameMinLength || "Name must be at least 3 characters")
      .required(translations.auth.validation.nameRequired || "Name is required").matches(/^[a-zA-Z]+$/, translations.auth.validation.nameInvalid || "Name is not valid")  ,
    email: Yup.string()
      .email(translations.auth.validation.invalidEmail || "Invalid email address")
      .required(translations.auth.validation.emailRequired || "Email is required"),
    mobile: Yup.string()
      .matches(/^[0-9+]+$/, translations.auth.validation.mobileInvalid || "Mobile number is not valid")
      .required(translations.auth.validation.mobileRequired || "Mobile number is required"),
    password: Yup.string()
      .min(8, translations.auth.validation.passwordLength || "Password must be at least 8 characters")
      .required(translations.auth.validation.passwordRequired || "Password is required"),
  });
  
  // Use provided validation schema or default
  const formValidationSchema = validationSchema || defaultValidationSchema;
  
  return (
    <ModalWrapper>
      <h2 className="text-xl font-bold mb-4">{translations.employees.addNew}</h2>
      <Formik
        initialValues={{
          name: "",
          email: "",
          mobile: "",
          password: "",
          application_id: "",
        }}
        validationSchema={formValidationSchema}
        onSubmit={handleAddEmployee}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <label className="block mb-2.5">
                {translations.stores.title} {required && <span className="text-[#7E7E7E]">*</span>}
              </label>  
              <Field
                as="select"
                name="application_id"
                className={`px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border ${
                  touched.application_id && errors.application_id 
                    ? "border-red-500" 
                    : "!border-white/10"
                }`}
              >
                <option value="">{translations.stores.title}</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id.toString()}>
                    {store.name}
                  </option>
                ))}
              </Field>
              {touched.application_id && errors.application_id && (
                <div className="text-red-500 text-sm mt-1">{errors.application_id}</div>
              )}
            </div>
            
            <div>
              <FormField
                name="name"
                type="text"
                label={translations.employees.form.name}
                placeholder={translations.employees.form.name}
                required={true}
              />
            </div>
            <div>
              <FormField
                name="email"
                type="email"
                label={translations.employees.form.email}
                placeholder={translations.employees.form.email}
                required={true}
              />
            </div>
            <div>
              <FormField
                name="mobile"
                type="text"
                label={translations.employees.form.mobile}
                placeholder={translations.employees.form.mobile}
                required={true}
              />
            </div>
            <div>
              <FormField
                name="password"
                type="password"
                label={translations.employees.form.password}
                placeholder={translations.employees.form.password}
                required={true}
              />
            </div>
            
            <div className="flex justify-end space-x-4 mt-6 gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#53B4AB] text-black rounded-lg"
              >
                {isSubmitting
                  ? translations.employees.form.buttons?.adding 
                  : translations.employees.form.buttons?.add }
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              >
                {translations.employees.form.buttons?.cancel || "Cancel"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </ModalWrapper>
  );
};

export default AddEmployeeModal;
