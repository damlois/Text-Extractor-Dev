import { Formik, Form, Field } from "formik";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import { setPasswordSchema } from "./validation";
import { useEffect, useState } from "react";
import { showNotification } from "../../utils/notification";
import { invoiceProcessorApi } from "../../api/invoice-api";
import { User } from "../../types";
import keycloakService from "../../service/keycloakService";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";

const SetPassword = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const checkAdminExists = async () => {
    if (location.state?.fromLandingPage) {
      setIsRedirecting(false);
      return;
    }

    try {
      setPageLoading(true);
      const response = await invoiceProcessorApi.checkOrgHasAdmin();
      const hasAdmin = response.data.data;

      if (!hasAdmin) {
        setIsRedirecting(false);
      } else {
        keycloakService.initKeycloak(() => {
          navigate("/home");
        });
      }
    } catch (e) {
      showNotification(
        "error",
        "Something went wrong. Please check your internet connection and try again."
      );
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    checkAdminExists();
  }, []);

  const handleSubmit = async ({
    first_name,
    last_name,
    email,
    password,
  }: typeof initialValues) => {
    setSubmitLoading(true);

    const data: User = {
      first_name,
      last_name,
      email,
      password,
      is_invited: false,
      username: email,
      role: "admin",
    };

    try {
      await invoiceProcessorApi.createUser(data);
      showNotification(
        "success",
        "Registration done successfully, Proceed to log in",
        undefined,
        2
      );
      setIsRedirecting(true);
      keycloakService.initKeycloak(() => {
        navigate("/home");
      });
    } catch (error: any) {
      showNotification(
        "error",
        error.response?.data?.detail?.startsWith("400:")
          ? "User already exists with the same email address"
          : "Something went wrong. Please check your internet connection and try again."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  if (isRedirecting) return null;

  return (
    <>
      {!pageLoading ? (
        <>
          <div
            className="flex items-center justify-center min-h-screen p-4"
            style={{
              backgroundImage: "url('/assets/images/background.png')",
            }}
          >
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
                        name="first_name"
                        type="text"
                        label="First Name"
                        placeholder="Enter first name"
                        value={values.first_name}
                        onChange={handleChange}
                        onBlur={(e: any) => {
                          handleBlur(e);
                          setFieldTouched("first_name", true);
                        }}
                        error={errors.first_name}
                        className="w-full"
                      />
                      <Field
                        as={AppInput}
                        name="last_name"
                        type="text"
                        label="Last Name"
                        placeholder="Enter last name"
                        value={values.last_name}
                        onChange={handleChange}
                        onBlur={(e: any) => {
                          handleBlur(e);
                          setFieldTouched("last_name", true);
                        }}
                        error={errors.last_name}
                        className="w-full"
                      />
                    </div>

                    <Field
                      as={AppInput}
                      name="email"
                      type="email"
                      label="Email Address"
                      placeholder="Enter email address"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={(e: any) => {
                        handleBlur(e);
                        setFieldTouched("email", true);
                      }}
                      error={errors.email}
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
                      loading={submitLoading}
                    >
                      Sign Up
                    </AppButton>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </>
      ) : (
        <div className="flex w-full h-screen items-center justify-center">
          <Spin size="large"></Spin>
        </div>
      )}
    </>
  );
};

export default SetPassword;
