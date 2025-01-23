import { ArrowLeftOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Form, Input, Popconfirm, Table, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import AppButton from "../../../../components/AppButton";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";

interface DataType {
  key: string;
  name: string;
  description: string;
}

const originData: DataType[] = Array.from({ length: 5 }).map((_, i) => ({
  key: i.toString(),
  name: `Date`,
  description: "The date on the invoice",
}));

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: keyof DataType;
  title: string;
  inputType: "text";
  record: DataType;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  record,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          <Input placeholder={`Enter ${title.toLowerCase()} here...`} />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const SetupLabel: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<DataType[]>(originData);
  const [editingKey, setEditingKey] = useState<string>("");

  const navigate = useNavigate();

  const isEditing = (record: DataType): boolean => record.key === editingKey;

  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", description: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: string) => {
    try {
      const row = (await form.validateFields()) as DataType;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const deleteRow = (key: string) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
    setEditingKey("");
  };

  const addNewRow = () => {
    if (editingKey) return;

    const newKey = (data.length + 1).toString();
    const newRow: DataType = {
      key: newKey,
      name: "",
      description: "",
    };
    setData([...data, newRow]);
    edit(newRow);
  };

  const columns = [
    {
      title: "Field Name",
      dataIndex: "name",
      width: "30%",
      editable: true,
    },
    {
      title: "Field Description",
      dataIndex: "description",
      width: "60%",
      editable: true,
    },
    {
      title: "...",
      dataIndex: "operation",
      align: "center" as const,
      render: (_: any, record: DataType) => {
        const editable = isEditing(record);
        return (
          <div className="flex gap-3 items-center justify-center">
            {editable ? (
              <span>
                <Typography.Link
                  onClick={() => save(record.key)}
                  style={{ marginInlineEnd: 8 }}
                  className="text-deep-blue"
                >
                  Save
                </Typography.Link>
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <a>Cancel</a>
                </Popconfirm>
              </span>
            ) : (
              <Typography.Link
                disabled={!!editingKey}
                onClick={() => edit(record)}
              >
                <FaRegEdit className="text-[18px] text-deep-blue" />
              </Typography.Link>
            )}
            {!editable && (
              <Typography.Link onClick={() => deleteRow(record.key)}>
                <RiDeleteBinLine className="text-[18px] text-[#EA4335]" />
              </Typography.Link>
            )}
          </div>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div className="w-full relative">
      <div
        className="mt-[10px] text-deep-blue px-[0] cursor-pointer absolute"
        onClick={() => navigate("../data-source/connect-email")}
      >
        <ArrowLeftOutlined className="mr-6" /> Back
      </div>
      <div className="lg:w-4/12 md:w-7/12 sm:w-10/12 mx-auto relative">
        <div className="mb-6">
          <h2 className="text-dark-gray text-[24px] text-center">
            Field Extraction Setup
          </h2>
          <p className="text-gray text-center ">
            Review the field to extract in your invoice or add for better
            customization
          </p>
        </div>
      </div>
      <div className="flex gap-2 items-center font-medium text-base text-dark-gray">
        <p>Check out some recommendations</p>
        <img src="/assets/icons/insight.svg" />
      </div>
      <div className="flex justify-between w-full gap-4 flex-wrap items-center mb-6">
        <p>Click the + icon to add a new field</p>
        <AppButton
          variant="secondary"
          children="+ Add New field"
          width="fit-content"
          className="mr-0"
          onClick={addNewRow}
          disabled={!!editingKey}
        />
      </div>
      <Form form={form} component={false}>
        <Table<DataType>
          components={{
            body: { cell: EditableCell },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ onChange: cancel }}
          className="label-setup-form"
        />
      </Form>
    </div>
  );
};

export default SetupLabel;
