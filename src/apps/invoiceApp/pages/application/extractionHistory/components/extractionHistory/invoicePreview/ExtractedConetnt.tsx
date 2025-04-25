import { camelCase } from "lodash";
import { formatExtractionValue } from "../../../../../../../../utils";
import { useTemplate } from "../../../../../../context/TemplateContext";
import { standardizeInvoice } from "../../../utils";
import ExtractedItemsTable from "./ExtractedItemsTable";
import { useInvoiceProcessor } from "../../../../../../context/InvoiceProcessorContext";
import { useEffect } from "react";

interface ExtractedContentProps {
  extractedContent: any;
}

interface ExtractedItemDisplayProps {
  field: string;
  value: string;
}

interface ItemsFieldData {
  label: string;
  data: any[];
}

const ExtractedItem = ({ field, value }: ExtractedItemDisplayProps) => {
  return (
    <div className="flex-col gap-1">
      <p className="text-dark-gray text-[13px] font-bold">{field}</p>
      <p className="text-gray text-[12px]">{value}</p>
    </div>
  );
};

const ExtractedContent = ({ extractedContent }: ExtractedContentProps) => {
  const { templateItems, fetchTemplate } = useTemplate();
  const { currentDataSource, fetchDataSource } = useInvoiceProcessor();

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

  const displayExtractedContent = () => {
    if (!extractedContent || typeof extractedContent !== "object") {
      return (
        <div className="text-gray text-[12px]">
          No extracted content available.
        </div>
      );
    }

    const regularFieldsData: React.ReactNode[] = [];
    const itemsFieldsData: ItemsFieldData[] = [];

    const standardizedExtractionContent = standardizeInvoice(extractedContent);

    templateItems.forEach(({ label }) => {
      const value = standardizedExtractionContent[camelCase(label)];

      if (
        (label.toLowerCase().includes("item") ||
          label.toLowerCase().includes("description") ||
          label.toLowerCase().includes("material")) &&
        Array.isArray(value)
      ) {
        itemsFieldsData.push({ label, data: value });
      } else {
        let displayValue = formatExtractionValue(value);
        regularFieldsData.push(
          <ExtractedItem key={label} field={label} value={displayValue} />
        );
      }
    });

    return (
      <>
        <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
          {regularFieldsData}
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
      </>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between gap-4 px-[18px] py-[12px] text-[16px] text-dark-gray bg-[#F9FAFB] rounded-t-[8px]">
        <p className="font-bold">Extracted Content</p>
        <div>
          <span className="text-[14px] mr-1">QA Passed By:</span>
          <span className="text-[14px] text-[#166534] bg-[#DCFCE7] px-[8px] pt-[2px] pb-[2px] mr-1 rounded-full">
            Ann Paul
          </span>
          <span className="text-[12px]">2:00pm, 12/4/2025</span>
        </div>
      </div>
      <div className="p-[18px] border-t border-[#F1F1F1] overflow-y-auto h-[80vh]">
        {displayExtractedContent()}
      </div>
    </div>
  );
};

export default ExtractedContent;
