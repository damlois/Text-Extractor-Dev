import { useEffect, useMemo, useState } from "react";
import { useDocumentProcessor } from "../../../../../context/DocumentProcessorContext";
import { useTemplate } from "../../../../../context/TemplateContext";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import AppInput from "../../../../../components/AppInput";
import EditExtractedItemsTable from "./EditExtractedItemsTable";
import { ItemField, RegularField } from "../../types";
import ConfidenceBadge from "./ConfidenceBadge";

interface EditExtractedContentProps {
  extractedContent: any;
  reviewStatus?: string;
  editorName?: string;
  editTime?: string;
  onEdit: (editedFields: any) => void;
}

const EditExtractedContent = ({
  extractedContent,
  reviewStatus,
  editorName,
  editTime,
  onEdit,
}: EditExtractedContentProps) => {
  const [editedRegularFields, setEditedRegularFields] = useState<
    RegularField[] | null
  >(null);
  const [editedItemFields, setEditedItemFields] = useState<ItemField[] | null>(
    null
  );

  const { templateItems, fetchTemplate } = useTemplate();
  const {
    currentDataSource,
    fetchDataSource,
    regularFieldsData,
    itemsFieldsData,
  } = useDocumentProcessor();

  const displayedRegularFields = editedRegularFields ?? regularFieldsData;
  const displayedItemFields = editedItemFields ?? itemsFieldsData;

  const mergedFields = useMemo(() => {
    const regularFieldsObject = displayedRegularFields.reduce(
      (acc, { field, value }) => ({ ...acc, [field]: value }),
      {}
    );
    const itemFieldsObject = displayedItemFields.reduce((acc, item) => {
      acc[item.label] = item.data;
      return acc;
    }, {} as Record<string, any>);
    return { ...regularFieldsObject, ...itemFieldsObject };
  }, [displayedRegularFields, displayedItemFields]);

  const updateRegularFieldValue = (field: string, value: string) => {
    setEditedRegularFields((prevFields) => {
      const base = prevFields ?? regularFieldsData;
      return base.map((item) =>
        item.field === field ? { ...item, value } : item
      );
    });
  };

  const updateItemFieldValue = (
    itemIndex: number,
    rowIndex: number,
    key: string,
    value: string
  ) => {
    setEditedItemFields((prevItems) => {
      const base = prevItems ?? itemsFieldsData;
      return base.map((item, index) => {
        if (index !== itemIndex) return item;
        const data = item.data;
        let newData: any = [];
        const isArray = Array.isArray(data);
        const isArrayOfObjects =
          isArray &&
          data.length > 0 &&
          typeof data[0] === "object" &&
          !Array.isArray(data[0]);
        const isArrayOfStrings =
          isArray && data.length > 0 && typeof data[0] === "string";
        const isNumericKeyedObject =
          !isArray &&
          typeof data === "object" &&
          Object.keys(data).every((key) => /^\d+$/.test(key));
        if (isArrayOfObjects) {
          newData = data.map((row: any, rIndex: number) => {
            if (rIndex !== rowIndex) return row;
            const originalCell = row[key];
            return {
              ...row,
              [key]:
                typeof originalCell === "object" &&
                originalCell !== null &&
                "value" in originalCell
                  ? { ...originalCell, value }
                  : value,
            };
          });
        } else if (isArrayOfStrings) {
          newData = data.map((item: string, i: number) =>
            i === rowIndex ? value : item
          );
        } else if (isNumericKeyedObject) {
          newData = {
            ...data,
            [rowIndex]: value,
          };
        }
        return { ...item, data: newData };
      });
    });
  };

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onEdit(mergedFields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mergedFields]);

  if (!extractedContent || typeof extractedContent !== "object") {
    return (
      <div className="h-full flex items-center justify-center text-gray text-[12px] p-6">
        No extracted content available.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between gap-4 px-[18px] py-[12px] text-[16px] text-dark-gray bg-[#F9FAFB] rounded-t-[8px]">
        <p className="font-bold">Extracted Content</p>
        {reviewStatus === "reviewed" && (
          <div>
            <span className="text-[14px] mr-1">QA Passed </span>
            {editorName && (
              <>
                <span>by</span>
                <span className="text-[14px] text-[#166534] bg-[#DCFCE7] px-[8px] pt-[2px] pb-[2px] mr-1 rounded-full">
                  {editorName}
                </span>
              </>
            )}
            {editTime && <span className="text-[12px]">{editTime}</span>}
          </div>
        )}
        {reviewStatus === "pending" &&
          extractedContent?.overall_confidence?.score && (
            <div>
              <span className="text-[14px] mr-1">Confidence Level:</span>
              <Tooltip title={extractedContent?.overall_confidence?.reason}>
                <InfoCircleOutlined className="text-[#00000073] cursor-pointer mr-2" />
              </Tooltip>
              <ConfidenceBadge
                confidence={extractedContent?.overall_confidence?.score}
              />
            </div>
          )}
      </div>

      <div className="p-[18px] border-t border-[#F1F1F1] overflow-y-auto h-[80vh] flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {displayedRegularFields.map(({ field, value, confidence }) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-dark-gray text-[13px] font-bold">
                {field}
                {confidence && <ConfidenceBadge confidence={confidence} />}
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
          {displayedItemFields.map((item, itemIndex) => (
            <EditExtractedItemsTable
              key={itemIndex}
              label={item.label}
              confidence={item.confidence}
              itemsFieldData={item.data}
              onCellChange={(rowIndex, key, value) =>
                updateItemFieldValue(itemIndex, rowIndex, key, value)
              }
              onDataUpdate={(updatedData) =>
                setEditedItemFields((prevItems) => {
                  const base = prevItems ?? itemsFieldsData;
                  return base.map((itm, idx) =>
                    idx === itemIndex ? { ...itm, data: updatedData } : itm
                  );
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditExtractedContent;
