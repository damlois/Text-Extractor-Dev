import { useEffect, useState } from "react";
import { useInvoiceProcessor } from "../../../../../context/InvoiceProcessorContext";
import { useTemplate } from "../../../../../context/TemplateContext";
import { useNavigate } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import AppInput from "../../../../../../../components/AppInput";
import EditExtractedItemsTable from "./EditExtractedItemsTable";
import { RegularField } from "../../types";

interface UpdatedItemField {
  label: string;
  data: Record<string, any>;
}

interface EditExtractedContentProps {
  extractedContent: any;
}

const EditExtractedContent = ({
  extractedContent,
}: EditExtractedContentProps) => {
  const [updatedRegularFields, setUpdatedRegularFields] = useState<
    RegularField[]
  >([]);
  const [updatedItemFields, setUpdatedItemsFields] = useState<
    UpdatedItemField[]
  >([]);

  const navigate = useNavigate();
  const { templateItems, fetchTemplate } = useTemplate();
  const {
    currentDataSource,
    fetchDataSource,
    regularFieldsData,
    itemsFieldsData,
  } = useInvoiceProcessor();

  useEffect(() => {
    const handleFetchTemplate = async () => {
      if (!currentDataSource) {
        await fetchDataSource();
      }
      if (currentDataSource && (!templateItems || templateItems.length === 0)) {
        await fetchTemplate();
      }
    };

    handleFetchTemplate();
  }, []);

  useEffect(() => {
    setUpdatedRegularFields(regularFieldsData);
    setUpdatedItemsFields(itemsFieldsData);
  }, [regularFieldsData, itemsFieldsData]);

  const updateRegularFieldValue = (field: string, value: string) => {
    setUpdatedRegularFields((prevFields) =>
      prevFields.map((item) =>
        item.field === field ? { ...item, value } : item
      )
    );
  };

  const updateItemFieldValue = (
    itemIndex: number,
    rowIndex: number,
    key: string,
    value: string
  ) => {
    setUpdatedItemsFields((prevItems) =>
      prevItems.map((item, index) => {
        if (index !== itemIndex) return item;

        const data = item.data;

        if (Array.isArray(data)) {
          if (typeof data[0] === "object" && data[0] !== null) {
            const newData = data.map((row, rIndex) => {
              if (rIndex !== rowIndex) return row;

              const originalCell = row[key];

              if (
                originalCell &&
                typeof originalCell === "object" &&
                "value" in originalCell
              ) {
                return {
                  ...row,
                  [key]: {
                    ...originalCell,
                    value: value,
                  },
                };
              } else {
                return {
                  ...row,
                  [key]: value,
                };
              }
            });
            return { ...item, data: newData };
          }

          if (typeof data[0] === "string") {
            const newData = data.map((item, index) =>
              index === rowIndex ? value : item
            );
            return { ...item, data: newData };
          }
        }

        if (typeof data === "object" && data !== null) {
          const keys = Object.keys(data);
          if (keys.every((k) => /^\d+$/.test(k))) {
            const newData = { ...data, [rowIndex]: value };
            return { ...item, data: newData };
          }
        }

        return item;
      })
    );
  };

  if (!extractedContent || typeof extractedContent !== "object") {
    return (
      <div className="h-full flex items-center justify-center text-gray text-[12px]">
        No extracted content available.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between gap-4 px-[18px] py-[12px] text-[16px] text-dark-gray bg-[#F9FAFB] rounded-t-[8px]">
        <p className="font-bold">Extracted Content</p>
        <div>
          <span className="text-[14px] mr-1">Confidence Level:</span>
          <Tooltip title="This confidence level (80%) means the system is fairly certain about the accuracy of the extracted data, 4 out of 5 required fields were matched accurately based on format, structure, and position in the document.">
            <InfoCircleOutlined className="text-[#00000073] cursor-pointer mr-2" />
          </Tooltip>
          <span className="text-[14px] text-[#166534] bg-[#DCFCE7] px-[8px] pt-[2px] pb-[2px] mr-1 rounded-full">
            80%
          </span>
        </div>
      </div>

      <div className="p-[18px] border-t border-[#F1F1F1] overflow-y-auto h-[80vh] flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {updatedRegularFields.map(({ field, value, confidence }) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-dark-gray text-[13px] font-bold">
                {field}
                <span className="text-[10px] text-[#166534] bg-[#DCFCE7] px-[8px] pt-[2px] pb-[2px] ml-[6px] rounded-full">
                  80%
                </span>
              </label>
              <AppInput
                type="text"
                value={value || ""}
                onChange={(e) => updateRegularFieldValue(field, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          {updatedItemFields.map((item, itemIndex) => (
            <EditExtractedItemsTable
              key={itemIndex}
              label={item.label}
              itemsFieldData={item.data}
              onCellChange={(rowIndex, key, value) =>
                updateItemFieldValue(itemIndex, rowIndex, key, value)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditExtractedContent;
