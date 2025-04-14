"use client";
import { useTranslation } from "@/context/translation-context";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Store } from "./types";

interface AddEmployeeModalProps {
  setShowAddModal: (show: boolean) => void;
  handleAddEmployee: (values: any) => void;
  validationSchema: Yup.AnySchema;
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
        validationSchema={validationSchema}
        onSubmit={handleAddEmployee}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <Field
              as="select"
              name="application_id"
              className="w-full px-3 py-2.5 bg-[#444444] text-white rounded-[18px]"
            >
              <option value="">{translations.stores.title}</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id.toString()}>
                  {store.name}
                </option>
              ))}
            </Field>
            <div>
              <Field
                type="text"
                name="name"
                placeholder={translations.employees.form.name}
                className="w-full px-3 py-2.5 bg-[#444444] text-white rounded-[18px]"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm pt-2"
              />
            </div>
            <div>
              <Field
                type="email"
                name="email"
                placeholder={translations.employees.form.email}
                className="w-full px-3 py-2.5 bg-[#444444] text-white rounded-[18px]"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm pt-2"
              />
            </div>
            <div>
              <Field
                type="text"
                name="mobile"
                placeholder={translations.employees.form.mobile}
                className="w-full px-3 py-2.5 bg-[#444444] text-white rounded-[18px]"
              />
              <ErrorMessage
                name="mobile"
                component="div"
                className="text-red-500 text-sm pt-2"
              />
            </div>
            <div>
              <Field
                type="password"
                name="password"
                placeholder={translations.employees.form.password}
                className="w-full px-3 py-2.5 bg-[#444444] text-white rounded-[18px]"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm pt-2"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-[18px] mr-2"
              >
                {translations.employees.form.buttons.cancel}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#53B4AB] hover:bg-[#479d94] text-black px-4 py-2 rounded-[18px]"
              >
                {isSubmitting ? translations.employees.form.buttons.adding : translations.employees.form.buttons.add}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </ModalWrapper>
  );
};

export default AddEmployeeModal;
