import { useTemplate } from "../../../../../../context/TemplateContext";
import { processExtractedContent } from "../../../utils";
import ExtractedItemsTable from "./ExtractedItemsTable";
import { useDocumentProcessor } from "../../../../../../context/DocumentProcessorContext";
import { useEffect } from "react";
import { ReviewStatus } from "../../../types";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import ConfidenceBadge from "../../reviewExtraction/ConfidenceBadge";
import FailedExtraction from "./FailedExtraction";

interface ExtractedContentProps {
  extractedContent: any;
  reviewStatus?: ReviewStatus;
  extractionStatus?: string;
  editorName?: string;
  editTime?: string;
}

interface ExtractedItemDisplayProps {
  field: string;
  value: string;
}

const ExtractedItem = ({ field, value }: ExtractedItemDisplayProps) => {
  return (
    <div className="flex-col gap-1">
      <p className="text-dark-gray text-[13px] font-bold">{field}</p>
      <p className="text-gray text-[12px]">{value}</p>
    </div>
  );
};

const ExtractedContent = ({
  extractedContent,
  reviewStatus,
  extractionStatus,
  editorName,
  editTime,
}: ExtractedContentProps) => {
  const { templateItems, fetchTemplate } = useTemplate();
  const {
    currentDataSource,
    fetchDataSource,
    itemsFieldsData,
    regularFieldsData,
    setItemsFieldsData,
    setRegularFieldsData,
  } = useDocumentProcessor();

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

    const { regularFieldsData, itemsFieldsData } = processExtractedContent(
      extractedContent,
      templateItems
    );

    setItemsFieldsData(itemsFieldsData);
    setRegularFieldsData(regularFieldsData);
  }, []);

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
        {reviewStatus === "in_review" && (
          <div>
            <span className="text-[14px] mr-1">In Review </span>
            {editorName && (
              <>
                <span>by</span>
                <span className="text-[14px] text-[#166534] bg-[#DCFCE7] px-[8px] pt-[2px] pb-[2px] mr-1 rounded-full">
                  {editorName}
                </span>
              </>
            )}
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
      {extractionStatus?.toLowerCase() === "failed" ||
      extractionStatus?.toLowerCase() === "processing" ||
      extractionStatus?.toLowerCase() === "retry_in_progress" ? (
        <FailedExtraction />
      ) : (
        <>
          {!extractedContent ||
          typeof extractedContent !== "object" ||
          Object.keys(extractedContent).length === 0 ? (
            <div className="text-gray text-[12px] p-6">
              No extracted content available.
            </div>
          ) : (
            <div className="p-[18px] border-t border-[#F1F1F1] overflow-y-auto h-[80vh]">
              <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
                {regularFieldsData.map((item) => (
                  <ExtractedItem
                    key={item.field}
                    field={item.field}
                    value={item.value}
                  />
                ))}
              </div>

              {itemsFieldsData.length > 0 && (
                <div className="mt-6 flex flex-col gap-6">
                  {itemsFieldsData.map((itemField, idx) => (
                    <ExtractedItemsTable
                      key={idx}
                      label={itemField.label}
                      itemsFieldData={itemField.data}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExtractedContent;
