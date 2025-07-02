import { Field, ErrorMessage } from "formik";

interface InputFieldProps {
  label: string;
  name: string;
  type: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, type }) => (
  <div className="relative space-y-2">
    <label htmlFor={name} className="text-sm text-white">{label}</label>
    <Field
      type={type}
      name={name}
      placeholder={label}
      className="block w-full border-none rounded-lg bg-[#444444] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#53B4AB]"
    />
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
  </div>
);

export default InputField;
