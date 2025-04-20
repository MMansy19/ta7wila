import { ErrorMessage, Field } from 'formik';
import React from 'react';



interface FormFieldProps {
  name: string;
  type?: string;
  placeholder?: string;
  label?: string;
  className?: string;
  required?: boolean;
  autoComplete?: string;
  autoCorrect?: string;
  min?: number;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  type = 'text',
  placeholder,
  label,
  className = 'px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10 ',
  required = false,
  autoComplete = 'off',
  autoCorrect = 'off',
  min = 0,
  
}) => {
  return (
    <div className=" mb-4">
      {label && (
        <label className="block  mb-2.5">
          {label} {required && <span className="text-[#7E7E7E]">*</span>}
        </label>
      )}
      <Field
        name={name}
        type={type}
        placeholder={placeholder}
        className={className}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        min={min}
    
      />
      <ErrorMessage name={name} component="div" className="text-red-500 !text-sm mt-1" />
    </div>
  );
};

export default FormField; 