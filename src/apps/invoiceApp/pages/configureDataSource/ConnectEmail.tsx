import { Form } from "antd";
import AppInput from "../../../../components/AppInput";
import AppButton from "../../../../components/AppButton";
import { requiredRule } from "../../../../utils";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useConfigureDataSource } from "../../../../hooks/useInvoiceProcessor";
import { useState } from "react";
import { showNotification } from "../../../../utils/notification";

const ConnectEmail = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { configureDataSource } = useConfigureDataSource();

  const onFinish = async ({
    username,
    password,
    server,
    port,
  }: Record<string, any>) => {
    try {
      setLoading(true);
      const response = await configureDataSource({
        source_type: "email",
        username,
        password,
        server,
        port,
      });
      setLoading(false);
      showNotification("success", "Email connected Successfully");
    } catch (error) {
      setLoading(false);
      showNotification(
        "error",
        "There was an issue connecting your email. Please try again."
      );
    }
  };

  const fields = [
    {
      name: "username",
      type: "text",
      label: "Mail Username",
      placeholder: "invoices@company.com",
      tooltip:
        "Enter the email address you use to access your mailbox. This will be used to configure the data source for invoice extraction",
      rules: [requiredRule("Mail Username")],
    },
    {
      name: "password",
      type: "password",
      label: "Mail Password",
      placeholder: "Mail Password",
      tooltip:
        "Enter the email password you use to access your mailbox. This will be used to configure the data source for invoice extraction",
      rules: [requiredRule("Mail Password")],
    },
    {
      name: "server",
      type: "text",
      label: "Mail Server",
      placeholder: "smtp.gmail.com",
      tooltip: "Enter the mail server used to configure your mailbox.",
      rules: [requiredRule("Mail Server")],
    },
    {
      name: "port",
      type: "text",
      label: "Mail Port Number",
      placeholder: "587",
      tooltip: "Enter the port number used to configure your mailbox.",
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

          <AppButton htmlType="submit" loading={loading}>Connect</AppButton>
        </Form>
      </div>
    </div>
  );
};

export default ConnectEmail;
