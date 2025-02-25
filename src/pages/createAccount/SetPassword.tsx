import { Formik, Form, Field } from "formik";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import { setPasswordSchema } from "./validation";
import { useState } from "react";
import ConfirmEmailPrompt from "./ConfirmEmailPrompt";

const SetPassword = () => {
  const [showConfirmationPrompt, setShowConfirmationPrompt] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");

  const initialValues = {
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = (values: typeof initialValues) => {
    console.log("Form Data:", values);
    setShowConfirmationPrompt(true);
    setEmailAddress(values.emailAddress);
  };

  return (
    <>
      {!showConfirmationPrompt ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full sm:w-[90%] md:w-[30%] text-center">
            <img
              src="/assets/images/logo.png"
              className="mb-6 w-fit mx-auto"
              alt="Logo"
            />
            <p className="text-dark-gray font-medium text-[24px] mb-2">
              Welcome to InterprAIs
            </p>
            <p className="text-gray mb-6">
              Complete your setup by filling in your details.
            </p>

            <Formik
              initialValues={initialValues}
              validationSchema={setPasswordSchema}
              onSubmit={handleSubmit}
              validateOnChange={true}
            >
              {({
                handleChange,
                handleBlur,
                values,
                errors,
                isValid,
                setFieldTouched,
              }) => (
                <Form className="grid gap-4 mt-6" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      as={AppInput}
                      name="firstName"
                      type="text"
                      label="First Name"
                      placeholder="Enter first name"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={(e: any) => {
                        handleBlur(e);
                        setFieldTouched("firstName", true);
                      }}
                      error={errors.firstName}
                      className="w-full"
                    />
                    <Field
                      as={AppInput}
                      name="lastName"
                      type="text"
                      label="Last Name"
                      placeholder="Enter last name"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={(e: any) => {
                        handleBlur(e);
                        setFieldTouched("lastName", true);
                      }}
                      error={errors.lastName}
                      className="w-full"
                    />
                  </div>

                  <Field
                    as={AppInput}
                    name="emailAddress"
                    type="email"
                    label="Email Address"
                    placeholder="Enter email address"
                    value={values.emailAddress}
                    onChange={handleChange}
                    onBlur={(e: any) => {
                      handleBlur(e);
                      setFieldTouched("emailAddress", true);
                    }}
                    error={errors.emailAddress}
                  />

                  <Field
                    as={AppInput}
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={(e: any) => {
                      handleBlur(e);
                      setFieldTouched("password", true);
                    }}
                    error={errors.password}
                    bottomText="Must be 8+ characters with uppercase, lowercase & special character."
                  />

                  <Field
                    as={AppInput}
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="Enter your password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={(e: any) => {
                      handleBlur(e);
                      setFieldTouched("confirmPassword", true);
                    }}
                    error={errors.confirmPassword}
                  />

                  <AppButton
                    htmlType="submit"
                    className="w-full h-[40px] mt-6"
                    disabled={!isValid}
                  >
                    Sign Up
                  </AppButton>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      ) : (
        <ConfirmEmailPrompt emailAddress={emailAddress} />
      )}
    </>
  );
};

export default SetPassword;
