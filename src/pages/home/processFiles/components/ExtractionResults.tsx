import { Table } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import AppButton from "../../../../components/AppButton";

interface ExtractionResultsProps {
  result: any;
}

const ExtractionResults = ({ result }: ExtractionResultsProps) => {
  const columns =
    result.length > 0
      ? Object.keys(result[0]).map((key) => ({
          title: key.charAt(0).toUpperCase() + key.slice(1),
          dataIndex: key,
          key,
        }))
      : [];

  const downloadAsCSV = () => {
    console.log("download as CSV clicked");
  };

  const downloadAsJSON = () => {
    console.log("download as CSV clicked");
  };

  return (
    <div className="w-full border border-[#F0F0F0] rounded-sm">
      <div className="flex justify-between py-4 px-6 border-b border-[#F0F0F0]">
        <div className="text-dark-gray text-[16px] font-medium">
          Extract Preview
        </div>
        <div className="flex gap-2">
          <AppButton
            children={
              <div>
                <DownloadOutlined className="mr-2" />
                CSV
              </div>
            }
            width="fit-content"
            onClick={downloadAsCSV}
            className="p-1"
            variant="secondary"
          />
          <AppButton
            children={
              <div>
                <DownloadOutlined className="mr-2" />
                JSON
              </div>
            }
            width="fit-content"
            onClick={downloadAsJSON}
            className="p-1"
            variant="secondary"
          />
        </div>
      </div>
      <div className="p-6">
        <Table
          dataSource={result}
          columns={columns}
          rowKey="id"
          pagination={result.length > 6 ? { pageSize: 6 } : false}
          className="rounded-lg bg-white border border-[#F0F0F0]"
        />
      </div>
    </div>
  );
};

export default ExtractionResults;
