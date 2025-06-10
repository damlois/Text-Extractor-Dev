import { TableColumnsType } from "antd";
import { ProcessedDocument } from "../../../../../../types";
import FileName from "./FileName";
import ExtractionStatusItem from "./ExtractionStatusItem";
import TableHeaderTooltip from "./TableHeaderTooltip";
import ConfidenceIndicator from "./ConfidenceIndicator";
import ReviewStatusBadge from "./ReviewStatusBadge";
import ReviewButton from "./ReviewButton";
import { StatusType } from "../../../types";
import { formatDateTime } from "../../../../../../utils";

export const getExtractionHistoryColumns = (
  canPerformAction: boolean,
  canEditExtraction: boolean,
  canRetryExtraction: boolean,
  canGenerateInsights: boolean,
  confidenceSortOptions: string[],
  setConfidenceSort: (option: string) => void,
  handleDocumentReview: (record: ProcessedDocument) => void
): TableColumnsType<ProcessedDocument> => [
  {
    title: "File Name",
    dataIndex: "file_name",
    render: (_: any, record: ProcessedDocument) => <FileName record={record} />,
  },
  {
    title: "Sender",
    dataIndex: "email_metadata",
    render: (data: { sender_email: string }) => (
      <span className="text-dark-gray text-[14px] font-medium">
        {data.sender_email}
      </span>
    ),
  },
  {
    title: "Date",
    dataIndex: "created_at",
    render: (text: string) => (
      <span className="text-[#28373] text-[14px]">{formatDateTime(text)}</span>
    ),
  },
  {
    title: (
      <div className="flex items-center gap-1">
        <span>Status</span>
        <TableHeaderTooltip header="processing_status" />
      </div>
    ),
    dataIndex: "processing_status",
    render: (text: string) => (
      <ExtractionStatusItem type={text.toLowerCase() as StatusType} />
    ),
  },
  {
    title: (
      <div className="flex items-center gap-1 cursor-pointer">
        <div className="flex">
          <img src="/assets/icons/arrow-down.svg" alt="arrow-down" />
          <img src="/assets/icons/arrow-up.svg" alt="arrow-up" />
        </div>
        <span>Confidence</span>
        <TableHeaderTooltip header="confidence" />
      </div>
    ),
    dataIndex: "overall_confidence",
    render: (_: any, record: ProcessedDocument) => (
      <ConfidenceIndicator record={record} />
    ),
  },
  {
    title: (
      <div className="flex items-center gap-1">
        <span>Review Status</span>
        <TableHeaderTooltip header="review_status" />
      </div>
    ),
    dataIndex: "review_status",
    render: (_: any, record: ProcessedDocument) => (
      <div className="min-w-[90px]">
        <ReviewStatusBadge record={record} />
      </div>
    ),
  },
  ...(canPerformAction
    ? [
        {
          title: "",
          render: (_: any, record: ProcessedDocument) => (
            <ReviewButton
              record={record}
              handleReview={handleDocumentReview}
              hasEditPermission={canEditExtraction}
              hasRetryPermission={canRetryExtraction}
            />
          ),
        },
      ]
    : []),
];
