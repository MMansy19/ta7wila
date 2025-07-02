import { ErrorMessage, Field } from 'formik';

interface FormFieldProps {
  name: string;
  type?: string;
}

const FormField = ({ name, type = 'text' }: FormFieldProps) => {
  return (
    <div>
      <Field
        type={type}
        name={name}
        placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
        className="w-full px-3 py-2.5 bg-[#444444] text-white rounded-[18px]"
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm pt-2"
      />
    </div>
  );
};

export default FormField;