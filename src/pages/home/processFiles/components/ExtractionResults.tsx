import { notification, Spin } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import AppButton from "../../../../components/AppButton";
import { useFileProcessor } from "../../../../context/FileProcessorContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../../../components/CustomTable";
import { extractKeyValuePairs } from "../../../../utils";
import { useGetProjectAnalyses } from "../../../../hooks/useFileProcessor";
import LabelTag from "./LabelTag";

const ExtractionResults = () => {
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { currentProject, sessionType } = useFileProcessor();

  const { getProjectAnalyses } = useGetProjectAnalyses();

  useEffect(() => {
    if (!currentProject) {
      navigate("/home");
      notification.error({
        message:
          "Project not found, Create a project or select an existing project",
      });
      return;
    }

    const fetchAnalyses = async () => {
      try {
        if (sessionType === "Existing") {
          setLoading(true);
          const analysesResult = await getProjectAnalyses();
          setLoading(false);
          const resultArray = analysesResult.data
            .map((item: any) =>
              extractKeyValuePairs(item?.results?.per_document || {})
            )
            .flat();
          setResult(resultArray);
        } else {
          const analysesResult =
            currentProject?.analysis_data?.results?.per_document;
          const resultArray = extractKeyValuePairs(analysesResult || {});
          setResult(resultArray);
        }
      } catch (error) {
        setLoading(false);
        notification.error({
          message: "Failed to fetch analyses",
        });
      }
    };

    fetchAnalyses();
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
    <>
      {loading ? (
        <Spin className="mt-20 flex justify-center" size="large" />
      ) : (
        <>
          {result.length ? (
            <div>
              <div
                className="w-full border border-[#F0F0F0] rounded-sm"
                style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}
              >
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
                  <CustomTable
                    dataSource={result}
                    columns={columns}
                    rowKey="id"
                    pagination={result.length > 7 ? { pageSize: 7 } : false}
                    bordered
                    striped
                  />
                </div>
                {sessionType === "Existing" && (
                  <div className="px-6 pb-6 pt-2 font-inter">
                    <p className="text-[16px] font-medium mb-1">Label List</p>
                    <p className="text-[14px]">
                      Below is a compilation of the list of labels selected.
                    </p>
                    <div className="flex flex-wrap gap-4 items-start mt-6">
                      {columns
                        .filter((item) => item.title !== "Document Name")
                        .map((label) => (
                          <LabelTag
                            key={label.key}
                            id={Number(label.key)}
                            name={label.title}
                            style={{ padding: "6px 8px" }}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="mt-20 flex justify-center font-inter text-gray">
              No Field was extracted
            </p>
          )}
        </>
      )}
    </>
  );
};

export default ExtractionResults;
