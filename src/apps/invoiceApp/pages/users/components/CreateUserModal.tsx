import { Form, Modal } from "antd";
import { Formik, Field } from "formik";
import AppInput from "../../../../../components/AppInput";
import AppButton from "../../../../../components/AppButton";
import { createUserSchema } from "../validation";
import AppSelect from "../../../../../components/AppSelect";

interface CreateUserModalProps {
  open: boolean;
  onCancel: () => void;
}

const CreateUserModal = ({ open, onCancel }: CreateUserModalProps) => {
  const initialValues = {
    firstName: "",
    lastName: "",
    emailAddress: "",
    role: "",
  };

  const handleSubmit = (values: typeof initialValues) => {
    console.log(values);
    onCancel();
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
            }) => (
              <Form className="grid gap-4" noValidate>
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
                  as={AppSelect}
                  name="role"
                  label="Role"
                  placeholder="Select an Option"
                  value={values.role}
                  options={["Admin", "User"]}
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
                  disabled={!isValid}
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
