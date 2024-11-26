import { notification, Table } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import AppButton from "../../../../components/AppButton";
import { useFileProcessor } from "../../../../context/FileProcessorContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { extractKeyValuePairs } from "../utils";

const ExtractionResults = () => {
  const { currentProject, projects } = useFileProcessor();
  const [result, setResult] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const projectData = projects.find(
      (project) => project.id === currentProject?.id
    );

    if (!projectData) {
      navigate("/home");
      notification.error({
        message: "Project not found, Create a project first",
      });
    }

    console.log(projectData)

    const analysisResult = projectData?.analysis_data.results.per_document;
    const resultArray = extractKeyValuePairs(analysisResult);

    setResult(resultArray);
  }, []);

  const columns =
    result.length > 0
      ? Object.keys(result[0]).map((key) => ({
          title: key.charAt(0).toUpperCase() + key.slice(1),
          dataIndex: key,
          key,
        }))
      : [];

  const downloadAsCSV = () => {
    const csvRows = [];
    const headers = Object.keys(result[0]);
    csvRows.push(headers.join(","));

    for (const row of result) {
      const values = headers.map((header) => row[header]);
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${currentProject?.name?.replace(/\s+/g, "-")}.csv`;

    link.click();
  };

  const downloadAsJSON = () => {
    const jsonString = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${currentProject?.name?.replace(/\s+/g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
