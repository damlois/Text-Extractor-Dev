import { Tooltip } from "antd";
import { ProcessedDocument } from "../../../../../../types";
import { EditOutlined, ReloadOutlined } from "@ant-design/icons";

interface ReviewButtonProps {
  record: ProcessedDocument;
  handleReview: (record: ProcessedDocument) => void;
}

const ReviewButton = ({ record, handleReview }: ReviewButtonProps) => {
  const { processing_status } = record;

  const isUnsupportedFile = false;
  const maxRetryReached = false;

  const isDisabled =
    processing_status.toLowerCase() === "processing" ||
    isUnsupportedFile ||
    maxRetryReached;

  const className = `inline-flex items-center gap-1 px-2 py-0.5 border rounded-[4px] w-[77px] transition-colors ${
    isDisabled
      ? "border-[#BFBFBF] text-[#00000040] cursor-not-allowed bg-[#F5F5F5] pointer-events-none"
      : "border-[#006A94] text-[#006A94] hover:bg-[#E6F7FF] cursor-pointer"
  }`;

  const determineTooltipTitle = () => {
    if (maxRetryReached) return "Maximum retry attempt reached";
    if (isUnsupportedFile) return "Cannot retry: Incompatible document type.";
    return null;
  };

  return (
    <>
      {processing_status.toLowerCase() !== "failed" ? (
        <div className={className} onClick={() => handleReview(record)}>
          <EditOutlined />
          <span className="text-[12px]">Review</span>
        </div>
      ) : (
        <Tooltip title={determineTooltipTitle()}>
          <span>
            <div className={className}>
              <ReloadOutlined />
              <span className="text-[12px]">Retry</span>
            </div>
          </span>
        </Tooltip>
      )}
    </>
  );
};

export default ReviewButton;
