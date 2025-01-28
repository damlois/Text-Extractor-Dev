import React, { useState } from "react";
import { Form, Input, Popconfirm, Table, Typography } from "antd";
import AppButton from "../../../../../components/AppButton";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { useTemplate } from "../../../../../context/TemplateContext";
import {
  LabelInfo,
  EditableCellProps,
  LabelSetupTemplateProps,
} from "../../../../../types";
import { showNotification } from "../../../../../utils/notification";

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

const LabelSetupTemplate = ({
  buttonComponent,
  onSuccessCallback,
  className,
}: LabelSetupTemplateProps) => {
  const [form] = Form.useForm();
  const {
    templateItems,
    setTemplateItems,
    loading: templateLoading,
  } = useTemplate();
  const [editingKey, setEditingKey] = useState<string>("");

  const getTableData = (): LabelInfo[] => {
    return templateItems.map((item, index) => ({
      key: index.toString(),
      label: item.label,
      description: item.description,
    }));
  };

  const isEditing = (record: LabelInfo): boolean => record.key === editingKey;

  const edit = (record: Partial<LabelInfo> & { key: React.Key }) => {
    form.setFieldsValue({ label: "", description: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: string) => {
    try {
      const row = (await form.validateFields()) as LabelInfo;
      const newData = getTableData();
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        newData.splice(index, 1, { ...newData[index], ...row });
        setTemplateItems(
          newData.map(({ label, description }) => ({ label, description }))
        );
        setEditingKey("");
      }
    } catch {
      showNotification("error", "Validation failed");
    }
  };

  const deleteRow = (key: string) => {
    const newData = getTableData().filter((item) => item.key !== key);
    setTemplateItems(
      newData.map(({ label, description }) => ({ label, description }))
    );
    setEditingKey("");
  };

  const addNewRow = () => {
    if (editingKey) return;

    const newData = getTableData();
    const newKey = newData.length.toString();
    const newRow: LabelInfo = {
      key: newKey,
      label: "",
      description: "",
    };
    setTemplateItems([...templateItems, { label: "", description: "" }]);
    edit(newRow);
  };

  const columns = [
    {
      title: "Field Name",
      dataIndex: "label",
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
      render: (_: any, record: LabelInfo) => {
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
                  <button className="text-blue-500 hover:underline">
                    Cancel
                  </button>
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
      onCell: (record: LabelInfo) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <div className={`${className} mb-3`}>
        <div className="flex gap-2 items-center font-medium text-base text-dark-gray">
          <p>Check out some recommendations</p>
          <img src="/assets/icons/insight.svg" alt="Insight icon" />
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
        <div className="overflow-x-auto">
          <Form form={form} component={false}>
            <Table<LabelInfo>
              components={{
                body: { cell: EditableCell },
              }}
              bordered
              dataSource={getTableData()}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={{ onChange: cancel }}
              className="invoice-app-table"
              loading={templateLoading}
            />
          </Form>
        </div>
      </div>
      <div onClick={onSuccessCallback}>
        {buttonComponent({loading: templateLoading})}
      </div>
    </>
  );
};

export default LabelSetupTemplate;
