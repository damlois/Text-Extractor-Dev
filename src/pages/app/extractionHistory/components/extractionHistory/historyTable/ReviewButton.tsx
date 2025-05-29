import { Tooltip, Spin } from "antd";
import { ProcessedDocument } from "../../../../../../types";
import { EditOutlined, ReloadOutlined } from "@ant-design/icons";
import { processorApi } from "../../../../../../api";
import { handleError } from "../../../../../../utils/notification";
import { useState } from "react";

interface ReviewButtonProps {
  record: ProcessedDocument;
  canEdit: boolean;
  canRetry: boolean;
  handleReview: (record: ProcessedDocument) => void;
}

const ReviewButton = ({
  record,
  canEdit,
  canRetry,
  handleReview,
}: ReviewButtonProps) => {
  const { processing_status, is_unsupported_file, retry_status } = record;
  const [loading, setLoading] = useState(false);

  const isProcessing = processing_status.toLowerCase() === "processing";

  const isRetryDisabled =
    isProcessing || is_unsupported_file || !retry_status || !canRetry;

  const isReviewDisabled = isProcessing || !canEdit;

  const getClassName = (isDisabled: boolean) =>
    `inline-flex items-center justify-center gap-1 px-2 py-0.5 border rounded-[4px] w-[77px] transition-colors ${
      isDisabled || loading
        ? "border-[#BFBFBF] text-[#00000040] cursor-not-allowed bg-[#F5F5F5] pointer-events-none"
        : "border-[#006A94] text-[#006A94] hover:bg-[#E6F7FF] cursor-pointer"
    }`;

  const determineRetryTooltipTitle = () => {
    if (!canRetry) return "You do not have permission to retry extraction";
    if (is_unsupported_file) return "Cannot retry: Incompatible document type.";
    if (!retry_status) return "Maximum retry attempt reached";
    return null;
  };

  const handleRetry = async (documentId: string) => {
    setLoading(true);
    try {
      const response = await processorApi.retryExtraction(documentId, {
        invoice_id: documentId,
        max_retries: 3,
      });
      console.log(response);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {processing_status.toLowerCase() !== "failed" ? (
        <Tooltip
          title={
            !canEdit
              ? "You do not have permission to review documents"
              : undefined
          }
        >
          <span>
            <div
              className={getClassName(isReviewDisabled)}
              onClick={
                !isReviewDisabled ? () => handleReview(record) : undefined
              }
            >
              <EditOutlined />
              <span className="text-[12px]">Review</span>
            </div>
          </span>
        </Tooltip>
      ) : (
        <Tooltip title={determineRetryTooltipTitle()}>
          <span>
            <div
              className={getClassName(isRetryDisabled)}
              onClick={
                !isRetryDisabled ? () => handleRetry(record.id) : undefined
              }
            >
              {loading ? (
                <Spin size="small" />
              ) : (
                <>
                  <ReloadOutlined />
                  <span className="text-[12px]">Retry</span>
                </>
              )}
            </div>
          </span>
        </Tooltip>
      )}
    </>
  );
};

export default ReviewButton;
