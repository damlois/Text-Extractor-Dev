import { Form } from "antd";
import AppInput from "../../../../components/AppInput";
import AppButton from "../../../../components/AppButton";
import { requiredRule } from "../../../../utils";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const ConnectEmail = () => {
  const navigate = useNavigate();

  const onFinish = (formData: Record<string, any>) => {
    console.log("Form values:", formData);
    navigate("../data-source/field-extraction-setup");
  };

  const fields = [
    {
      name: "username",
      type: "text",
      label: "Mail Username",
      placeholder: "Mail Username",
      tooltip: "Provide your email username",
      rules: [requiredRule("Mail Username")],
    },
    {
      name: "password",
      type: "password",
      label: "Mail Password",
      placeholder: "Mail Password",
      tooltip: "Provide your email password",
      rules: [requiredRule("Mail Password")],
    },
    {
      name: "server",
      type: "text",
      label: "Mail Server",
      placeholder: "Mail Server",
      tooltip: "Provide the mail server address",
      rules: [requiredRule("Mail Server")],
    },
    {
      name: "portNumber",
      type: "text",
      label: "Mail Port Number",
      placeholder: "Mail Port Number",
      tooltip: "Provide the mail port number",
      rules: [
        requiredRule("Mail Port Number"),
        {
          pattern: /^[0-9]+$/,
          message: "Port Number must be a valid number",
        },
      ],
    },
  ];

  return (
    <div className="w-full">
      <div
        className="mt-[10px] text-deep-blue sm:px-[10%] md:px-[5%] cursor-pointer absolute"
        onClick={() => navigate("../data-source/create")}
      >
        <ArrowLeftOutlined className="mr-1" /> Back
      </div>
      <div className="lg:w-5/12 md:w-7/12 sm:w-10/12 mx-auto relative">
        <h2 className="text-dark-gray text-[24px] mb-6 text-center">
          Add Your Email Credentials
        </h2>

        <Form
          onFinish={onFinish}
          layout="vertical"
          initialValues={{
            username: "",
            password: "",
            server: "",
            portNumber: "",
          }}
        >
          {fields.map((field) => (
            <Form.Item key={field.name} name={field.name} rules={field.rules}>
              <AppInput
                type={field.type}
                label={field.label}
                placeholder={field.placeholder}
                tooltip={field.tooltip}
                required
              />
            </Form.Item>
          ))}

          <AppButton htmlType="submit">Connect</AppButton>
        </Form>
      </div>
    </div>
  );
};

export default ConnectEmail;
