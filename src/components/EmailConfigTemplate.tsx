import { Form } from "antd";
import AppInput from "./AppInput";
import { requiredRule } from "../utils";
import { useState } from "react";
import { handleError } from "../utils/notification";
import React from "react";
import { processorApi } from "../api";
import { DataSourceDetails } from "../types";
import { useDocumentProcessor } from "../pages/app/context/DocumentProcessorContext";
import { useApplication } from "../context/ApplicationContext";

interface EmailConfigTemplateProps {
  buttonComponent: (props: { loading: boolean }) => React.ReactNode;
  onSuccessCallback?: (values: Record<string, any>) => void;
  className?: string;
  initialData?: DataSourceDetails | null;
  flowType: "ADD_NEW" | "UPDATE";
}

const EmailConfigTemplate: React.FC<EmailConfigTemplateProps> = ({
  buttonComponent,
  onSuccessCallback,
  className,
  initialData,
  flowType,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const { setCurrentDataSource } = useDocumentProcessor();
  const { currentApp } = useApplication();

  const onFinish = async (values: any) => {
    const data = {
      source_type: "email",
      ...values,
    };

    try {
      setLoading(true);
      if (flowType === "ADD_NEW") {
        const response = await processorApi.configureDataSource(data);
        setCurrentDataSource(response.data.data);
      }

      if (flowType === "UPDATE") {
        await processorApi.updateDataSource(
          initialData?.id as string,
          data
        );
      }

      if (onSuccessCallback) {
        onSuccessCallback(values);
      }

      form.resetFields();
    } catch (error: any) {
      handleError(error, "Data Source");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "username",
      type: "text",
      label: "Mail Username",
      placeholder: `invoices@company.com`,
      tooltip: `Enter the email address you use to access your mailbox. This will be used to configure the data source for ${currentApp?.toLowerCase()} extraction`,
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
      tooltip: `Enter the email password you use to access your mailbox. This will be used to configure the data source for ${currentApp?.toLowerCase()} extraction`,
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
