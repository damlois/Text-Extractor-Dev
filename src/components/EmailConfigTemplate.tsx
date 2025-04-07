import { Form } from "antd";
import AppInput from "./AppInput";
import { requiredRule } from "../utils";
import { useState } from "react";
import { showNotification } from "../utils/notification";
import React from "react";
import { invoiceProcessorApi } from "../api/invoice-api";
import { DataSourceDetails } from "../types";
import { useInvoiceProcessor } from "../apps/invoiceApp/context/InvoiceProcessorContext";

interface EmailConfigTemplateProps {
  buttonComponent: (props: { loading: boolean }) => React.ReactNode;
  onSuccessCallback?: (values: Record<string, any>) => void;
  className?: string;
  initialData?: DataSourceDetails | null;
}

const EmailConfigTemplate: React.FC<EmailConfigTemplateProps> = ({
  buttonComponent,
  onSuccessCallback,
  className,
  initialData,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const { setCurrentDataSource } = useInvoiceProcessor();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const response = await invoiceProcessorApi.configureDataSource({
        source_type: "email",
        ...values,
      });

      console.log(response);

      setCurrentDataSource(response.data.data);

      if (onSuccessCallback) {
        onSuccessCallback(values);
      }

      form.resetFields();
    } catch (error: any) {
      showNotification(
        "error",
        error.response?.data?.detail?.startsWith("400:")
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
      rules: [
        requiredRule("Mail Server"),
        {
          pattern: /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message:
            "Please enter a valid mail server (e.g., smtp.gmail.com, mail.company.com)",
        },
      ],
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
          pattern: /^[0-9]{2,5}$/,
          message: "Please enter a valid port number (between 2 to 5 digits).",
        },
      ],
    },
  ];

  return (
    <Form
      onFinish={onFinish}
      layout="vertical"
      initialValues={{
        username: initialData?.username || "",
        password: "",
        server: initialData?.server_name || "",
        port: initialData?.port || "",
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
