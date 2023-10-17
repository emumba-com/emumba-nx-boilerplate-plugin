import React, { FC, InputHTMLAttributes } from "react";
import { Field, ErrorMessage } from "formik";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  wrapperClass?: string;
}

const Input: FC<InputProps> = ({ label, wrapperClass, ...rest }) => {
  return (
    <div className={wrapperClass}>
      {label && <label htmlFor={rest.name}>{label}</label>}
      <Field {...rest} />
      <ErrorMessage name={rest.name} component="span" />
    </div>
  );
};

export default Input;
