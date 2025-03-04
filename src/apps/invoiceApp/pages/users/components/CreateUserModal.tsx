import { Form, Modal } from "antd";
import { Formik, Field } from "formik";
import AppInput from "../../../../../components/AppInput";
import AppButton from "../../../../../components/AppButton";
import { createUserSchema } from "../validation";
import AppSelect from "../../../../../components/AppSelect";
import { useState } from "react";
import { User } from "../../../../../types";
import { invoiceProcessorApi } from "../../../../../api/invoice-api";
import { showNotification } from "../../../../../utils/notification";

interface CreateUserModalProps {
  open: boolean;
  onCancel: () => void;
  refreshPage: () => void;
}

const CreateUserModal = ({
  open,
  onCancel,
  refreshPage,
}: CreateUserModalProps) => {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    role: "",
  };

  const handleSubmit = async ({
    first_name,
    last_name,
    email,
    role,
  }: typeof initialValues) => {
    console.log("here");
    const data: User = {
      first_name,
      last_name,
      email,
      is_invited: true,
      username: email,
      password: email,
      role,
    };

    try {
      setLoading(true);
      await invoiceProcessorApi.createUser(data);

      showNotification("success", "An invite has been sent to the user");
      refreshPage();
      onCancel();
    } catch (error: any) {
      showNotification(
        "error",
        error.response?.data?.detail?.startsWith("400:")
          ? "User already exists with the same email address"
          : "Something went wrong. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      className="app-modal"
      style={{ minWidth: "30%" }}
    >
      <div>
        <div className="text-[20px] font-bold p-6 border-b border-0.5 border-[#cfc1c1]">
          Add a User
        </div>
        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={createUserSchema}
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
              setFieldValue,
              touched,
            }) => (
              <Form className="grid gap-4" noValidate>
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
                  as={AppSelect}
                  name="role"
                  label="Role"
                  placeholder="Select an Option"
                  value={values.role}
                  options={["admin"]}
                  onSelectionChange={(value: any) =>
                    setFieldValue("role", value)
                  }
                  onBlur={(e: any) => {
                    handleBlur(e);
                    setFieldTouched("role", true);
                  }}
                  error={errors.role}
                />

                <AppButton
                  htmlType="submit"
                  className="w-full h-[40px] mt-6"
                  disabled={!isValid || Object.keys(touched).length === 0}
                  loading={loading}
                  onClick={() => handleSubmit(values)}
                >
                  Create User
                </AppButton>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Modal>
  );
};

export default CreateUserModal;
