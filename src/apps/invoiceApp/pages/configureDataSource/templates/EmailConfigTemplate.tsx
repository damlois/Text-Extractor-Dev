import { Form } from "antd";
import AppInput from "../../../../../components/AppInput";
import { requiredRule } from "../../../../../utils";
import { useState } from "react";
import { showNotification } from "../../../../../utils/notification";
import React from "react";
import { invoiceProcessorApi } from "../../../../../api/invoice-api";

interface EmailConfigTemplateProps {
  buttonComponent: (props: { loading: boolean }) => React.ReactNode;
  onSuccessCallback?: (values: Record<string, any>) => void;
  className?: string;
  initialEmail?: string;
}

const EmailConfigTemplate: React.FC<EmailConfigTemplateProps> = ({
  buttonComponent,
  onSuccessCallback,
  className,
  initialEmail,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await invoiceProcessorApi.configureDataSource({
        source_type: "email",
        ...values,
      });

      if (onSuccessCallback) {
        onSuccessCallback(values);
      }

      form.resetFields();
    } catch (error: any) {
      showNotification(
        "error",
        error.response.data.detail.startsWith("400:")
          ? "Incorrect email credentials. Please check and try again"
          : "There was an issue connecting your email. Please try again."
      );
    } finally {
      setLoading(false);
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
      rules: [
        requiredRule("Mail Username"),
        {
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Please enter a valid username",
        },
      ],
    },
    {
      name: "password",
      type: "password",
      label: "Mail Password",
      placeholder: "password",
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
    <Form
      onFinish={onFinish}
      layout="vertical"
      initialValues={{
        username: initialEmail || "",
        password: "",
        server: "",
        port: "",
      }}
    >
      <div className={className}>
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
      </div>
      {buttonComponent({ loading })}
    </Form>
  );
};

export default EmailConfigTemplate;
