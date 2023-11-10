import React, { FC } from "react";
import { Formik, Form as FormikForm, FormikProps } from "formik";

export type classNameType = string;
export type childrenType = React.ReactNode;

export interface IFormProps {
  defaultValues?: any;
  children?: childrenType;
  onSubmit?: any;
  validationSchema?: any;
  className?: classNameType;
}

const Form: FC<IFormProps> = ({
  defaultValues,
  children,
  onSubmit,
  validationSchema,
  ...rest
}) => {
  return (
    <Formik
      initialValues={defaultValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnBlur={false}
    >
      {(props: FormikProps<any>) => (
        <FormikForm {...rest}>
          <div>
            {children}
          </div>
        </FormikForm>
      )}
    </Formik>
  );
};

export default Form;
