import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { Header } from "../../types";

interface TableHeaderTooltipProps {
  header: Header;
}

const TableHeaderTooltip = ({ header }: TableHeaderTooltipProps) => {
  const headerTooltip = {
    processing_status:
      "This shows the status of the document extraction process",
    confidence:
      "This score reflects the system's confidence in the accuracy of the extracted data at the moment of extraction",
    review_status:
      "This shows the review status of the document: in review, awaiting review, or not available due to processing or extraction failure",
  };
  return (
    <>
      <Tooltip title={headerTooltip[header]}>
        <InfoCircleOutlined className="text-[#00000073] cursor-pointer" />
      </Tooltip>
    </>
  );
};

export default TableHeaderTooltip;
