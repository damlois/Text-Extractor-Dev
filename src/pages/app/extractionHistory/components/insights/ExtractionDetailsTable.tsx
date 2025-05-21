import { useLocation, useNavigate } from "react-router-dom";
import DownloadResults from "./DownloadResults";
import CustomTable from "../../../../../components/CustomTable";
import { useEffect, useState, useMemo } from "react";
import { formatExtractionValue } from "../../../../../utils";
import { camelCase } from "lodash";
import { useDocumentProcessor } from "../../../context/DocumentProcessorContext";
import DocumentPreviewModal from "../extractionHistory/documentPreview/DocumentPreviewModal";
import { useTemplate } from "../../../context/TemplateContext";
import {
  extractCsvData,
  extractJsonData,
  formatDocumentData,
} from "../../utils";
import { ProcessedDocument } from "../../../../../types";
import { processorApi } from "../../../../../api";

const ExtractionDetailsTable = () => {
  const [selectedDocuments, setSelectedDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<ProcessedDocument | null>();

  const location = useLocation();
  const navigate = useNavigate();

  const selectedDocumentIds = useMemo(
    () => location.state?.selectedDocumentIds,
    [location.state?.selectedDocumentIds]
  );

  const isSavedInsights = useMemo(
    () => location.state?.sessionId,
    [location.state?.sessionId]
  );

  const { templateItems, fetchTemplate } = useTemplate();
  const { currentDataSource, fetchDataSource, documentsMapById } =
    useDocumentProcessor();

  useEffect(() => {
    const fetchData = async () => {
      if (
        selectedDocumentIds?.length === 0 ||
        !documentsMapById ||
        Object.keys(documentsMapById).length === 0
      ) {
        navigate("../extraction-history");
        return;
      }

      if (!currentDataSource) {
        await fetchDataSource();
      }

      if (currentDataSource && (!templateItems || templateItems.length === 0)) {
        await fetchTemplate();
      }

      if (isSavedInsights) {
        // const fetchSelectedDocuments = async () => {
        if (selectedDocumentIds.length === 0) return;
        setLoading(true);
        try {
          const response = await processorApi.getBatchDocumentDetails(
            selectedDocumentIds
          );
          setSelectedDocuments(formatDocumentData(response.data.data));
        } catch (error) {
          console.error("Error fetching selected documents:", error);
        } finally {
          setLoading(false);
        }
        // };
        // fetchSelectedDocuments();
      } else {
        const selectedDocumentsData = selectedDocumentIds.map(
          (id: string) => documentsMapById[id]
        );

        setSelectedDocuments(formatDocumentData(selectedDocumentsData));
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedDocumentIds, currentDataSource, , documentsMapById]);

  const handleFileClick = (document: ProcessedDocument) => {
    setSelectedFile(document);
  };

  const closeModal = () => {
    setSelectedFile(null);
  };

  const tableColumns = useMemo(() => {
    if (templateItems?.length === 0) return [];

    const commonStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "200px",
      display: "inline-block",
    };

    return [{ label: "FILE NAME" }, ...(templateItems ?? [])]?.map(
      ({ label }: { label: string }) => {
        const key = camelCase(label);

        return {
          title: label.toUpperCase(),
          dataIndex: key,
          key,
          render: (value: any, record: any) =>
            key === "fileName" ? (
              <span
                style={{
                  ...commonStyle,
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                title={value}
                onClick={() => handleFileClick(record)}
              >
                {value}
              </span>
            ) : (
              <span style={commonStyle} title={formatExtractionValue(value)}>
                {formatExtractionValue(value)}
              </span>
            ),
        };
      }
    );
  }, [templateItems]);

  return (
    <div className="flex gap-4 justify-start items-start w-full">
      <img src="/assets/icons/blue-circle-icon.svg" alt="InterprAIs Logo" />
      <div style={{ width: "-webkit-fill-available" }}>
        <p className="text-[13px] font-normal text-dark-gray mb-4">
          Review the details of your extraction below
        </p>

        <div className="w-full monospace-table">
          <CustomTable
            dataSource={selectedDocuments}
            columns={tableColumns}
            rowKey="id"
            pagination={selectedDocuments.length > 6 ? { pageSize: 6 } : false}
            bordered
            striped
            className="overflow-x-auto mr-[48px]"
            loading={loading || tableColumns.length === 0}
          />
        </div>

        {!loading && (
          <DownloadResults
            jsonData={extractJsonData(selectedDocuments, templateItems)}
            csvData={extractCsvData(selectedDocuments, templateItems)}
          />
        )}

        {selectedFile?.id && (
          <DocumentPreviewModal
            open={!!selectedFile}
            onCancel={closeModal}
            documentDetails={documentsMapById[selectedFile?.id]}
          />
        )}
      </div>
    </div>
  );
};

export default ExtractionDetailsTable;
