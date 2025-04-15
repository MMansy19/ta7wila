import { useTranslation } from "@/context/translation-context";
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import FormField from '../Shared/FormField';
import { User } from './types';

interface EditEmployeeModalProps {
  setShowEditModal: (show: boolean) => void;
  handleUpdateUser: (values: User) => void;
  validationSchema: Yup.AnySchema;
  selectedUser: User;
}

const ModalWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="fixed w-full z-20 inset-0 bg-black bg-opacity-70 flex justify-center items-center">
    <div className="bg-neutral-900 rounded-[18px] p-6 shadow-lg w-[600px] mx-6">
      {children}
    </div>
  </div>
);

const EditEmployeeModal = ({
  setShowEditModal,
  handleUpdateUser,
  validationSchema,
  selectedUser
}: EditEmployeeModalProps) => {
  const translations = useTranslation();
  const required = true;
  
  return (
    <ModalWrapper>
      <h2 className="text-xl font-bold mb-4">{translations.employees.title}</h2>
      <Formik
        initialValues={selectedUser}
        validationSchema={validationSchema}
        onSubmit={handleUpdateUser}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <FormField
                name="application_id"
                label={translations.stores.title}
                required={required}
                className="w-full px-3 py-2.5 bg-[#444444] text-white rounded-[18px]"
              />
            </div>
            <div>
              <FormField
                name="name"
                placeholder={translations.employees.form.name}
                required={required}
                className="w-full px-3 py-2.5 bg-[#444444] text-white rounded-[18px]"
              />
            </div>
            <div>
              <FormField
                name="email"
                placeholder={translations.employees.form.email}
                required={required}
                className="w-full px-3 py-2.5 bg-[#444444] text-white rounded-[18px]"
              />
            </div>
            <div>
              <FormField
                name="mobile"
                placeholder={translations.employees.form.mobile}
                required={required}
                className="w-full px-3 py-2.5 bg-[#444444] text-white rounded-[18px]"
              />
            </div>
            <div>
              <FormField
                name="password"
                type="password"
                placeholder={translations.employees.form.password}
                required={required}
                className="w-full px-3 py-2.5 bg-[#444444] text-white rounded-[18px]"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-[18px]"
                onClick={() => setShowEditModal(false)}
              >
                {translations.employees.form.buttons.cancel}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#53B4AB] hover:bg-[#479d94] text-black px-4 py-2 rounded-[18px]"
              >
                {isSubmitting ? translations.employees.form.buttons.updating : translations.employees.form.buttons.update}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </ModalWrapper>
  );
};

export default EditEmployeeModal;