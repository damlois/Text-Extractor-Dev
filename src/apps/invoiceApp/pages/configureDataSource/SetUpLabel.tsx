import { ArrowLeftOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import type { TableProps } from "antd";
import { Form, Input, Popconfirm, Table, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";

interface DataType {
  key: string;
  name: string;
  description: string;
}

const originData = Array.from({ length: 5 }).map<DataType>((_, i) => ({
  key: i.toString(),
  name: `Edward ${i}`,
  description: "The choice of the invoice to be made",
}));

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: string;
  record: DataType;
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
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
          <Input />
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
  const [editingKey, setEditingKey] = useState("");

  const navigate = useNavigate();

  const isEditing = (record: DataType) => record.key === editingKey;

  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", description: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataType;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const deleteRow = async (key: React.Key) => {
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);
    newData.splice(index, 1);
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
      title: "Name",
      dataIndex: "name",
      width: "30%",
      editable: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: "60%",
      editable: true,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: DataType) => {
        const editable = isEditing(record);
        return (
          <>
            {editable ? (
              <span>
                <Typography.Link
                  onClick={() => save(record.key)}
                  style={{ marginInlineEnd: 8 }}
                >
                  Save
                </Typography.Link>
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <a>Cancel</a>
                </Popconfirm>
              </span>
            ) : (
              <Typography.Link
                disabled={editingKey !== ""}
                onClick={() => edit(record)}
              >
                Edit
              </Typography.Link>
            )}
            {!editable && <p onClick={() => deleteRow(record.key)}>Delete</p>}
          </>
        );
      },
    },
  ];

  const mergedColumns: TableProps<DataType>["columns"] = columns.map((col) => {
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
    <div className="w-full">
      <div
        className="mt-[10px] text-deep-blue sm:px-[10%] md:px-[5%] cursor-pointer absolute"
        onClick={() => navigate("../data-source/connect-email")}
      >
        <ArrowLeftOutlined className="mr-1" /> Back
      </div>
      <div className="lg:w-5/12 md:w-7/12 sm:w-10/12 mx-auto relative">
        <div className="mb-6">
          <h2 className="text-dark-gray text-[24px] text-center">
            Field Extraction Setup
          </h2>
          <p className="text-gray ">
            Review the field to extract in your invoice or add for a better
            customization
          </p>
        </div>
      </div>
      <Button
        type="primary"
        className="mb-4"
        onClick={addNewRow}
        disabled={!!editingKey}
      >
        Add New
      </Button>
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
        />
      </Form>
    </div>
  );
};

export default SetupLabel;
