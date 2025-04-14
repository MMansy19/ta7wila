import { useTranslation } from "@/context/translation-context";
import { ErrorMessage, Field, Form } from 'formik';
import { Store } from './types';

interface EmployeeFormProps {
  setShowModal: (show: boolean) => void;
  isSubmitting: boolean;
  stores: Store[];
  isEdit: boolean;
}

const EmployeeForm = ({
  setShowModal,
  isSubmitting,
  stores,
  isEdit
}: EmployeeFormProps) => {
  const translations = useTranslation();
  
  return (
    <Form className="space-y-4">
      {!isEdit && (
        <Field as="select" name="application_id" className="w-full px-3 py-2.5 bg-[#444444] text-white rounded-[18px]">
          <option value="">{translations.stores.title}</option>
          {stores.map((store: Store) => (
            <option key={store.id} value={store.id.toString()}>
              {store.name}
            </option>
          ))}
        </Field>
      )}
      
      {['name', 'email', 'mobile', 'password'].map((field) => (
        <div key={field}>
          <Field
            type={field === 'password' ? 'password' : 'text'}
            name={field}
            placeholder={translations.employees.form[field as keyof typeof translations.employees.form]}
            className="w-full px-3 py-2.5 bg-[#444444] text-white rounded-[18px]"
          />
          <ErrorMessage
            name={field}
            component="div"
            className="text-red-500 text-sm pt-2"
          />
        </div>
      ))}

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => setShowModal(false)}
          className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-[18px] mr-2"
        >
          {translations.employees.form.buttons.cancel}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#53B4AB] hover:bg-[#479d94] text-black px-4 py-2 rounded-[18px]"
        >
          {isSubmitting 
            ? (isEdit ? translations.employees.form.buttons.updating : translations.employees.form.buttons.adding) 
            : (isEdit ? translations.employees.form.buttons.update : translations.employees.form.buttons.add)}
        </button>
      </div>
    </Form>
  );
};

export default EmployeeForm;