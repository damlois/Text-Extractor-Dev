import { useLocation, useNavigate } from "react-router-dom";
import DownloadResults from "./DownloadResults";
import CustomTable from "../../../../../../../components/CustomTable";
import { useEffect, useState, useMemo } from "react";
import { formatExtractionValue } from "../../../../../../../utils";
import { camelCase } from "lodash";
import { useInvoiceProcessor } from "../../../../../context/InvoiceProcessorContext";
import AppButton from "../../../../../../../components/AppButton";
import InvoicePreviewModal from "../extraction-history/invoicePreview/InvoicePreviewModal";
import { useTemplate } from "../../../../../context/TemplateContext";
import { formatInvoiceData } from "../../utils";

const ExtractionDetailsTable = () => {
  const [selectedInvoices, setSelectedInvoices] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<any>();

  const location = useLocation();
  const navigate = useNavigate();

  const selectedInvoiceIds = useMemo(
    () => location.state?.selectedInvoiceIds,
    [location.state?.selectedInvoiceIds]
  );

  const { templateItems, fetchTemplate } = useTemplate();
  const { currentDataSource, fetchDataSource, invoicesMapById } =
    useInvoiceProcessor();

  const removeFields = (obj: unknown): unknown => {
    const fieldsToRemove = new Set([
      "image_data",
      "email_metadata",
      "created_at",
      "id",
      "processing_status",
      "status",
    ]);

    if (Array.isArray(obj)) {
      return obj.map(removeFields);
    } else if (typeof obj === "object" && obj !== null) {
      let newObj: Record<string, unknown> = {};
      for (const key in obj) {
        if (!fieldsToRemove.has(key)) {
          newObj[key] = removeFields(obj[key as keyof typeof obj]);
        }
      }
      return newObj;
    }
    return obj;
  };


  useEffect(() => {
    const fetchData = async () => {
      if (
        selectedInvoiceIds?.length === 0 ||
        !invoicesMapById ||
        (Object.keys(invoicesMapById)).length === 0
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

      const selectedInvoicesData = selectedInvoiceIds.map(
        (id: string) => invoicesMapById[id]
      );

      setOriginalData(removeFields(selectedInvoicesData));
      setSelectedInvoices(formatInvoiceData(selectedInvoicesData));
      setLoading(false);
    };

    fetchData();
  }, [selectedInvoiceIds, currentDataSource, , invoicesMapById]);

  const handleFileClick = (raw_data: any) => {
    setSelectedFile(raw_data);
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
                onClick={() => handleFileClick(record.rawData)}
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

  const downloadOriginalData = () => {
    const jsonString = JSON.stringify(originalData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `extraction-history.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex gap-4 justify-start items-start w-full">
      <img src="/assets/icons/blue-circle-icon.svg" alt="InterprAIs Logo" />
      <div style={{ width: "-webkit-fill-available" }}>
        <p className="text-[13px] font-normal text-dark-gray mb-4">
          Review the details of your extraction below
        </p>
        
        <div className="w-full monospace-table">
          <CustomTable
            dataSource={selectedInvoices}
            columns={tableColumns}
            rowKey="id"
            pagination={selectedInvoices.length > 6 ? { pageSize: 6 } : false}
            bordered
            striped
            className="overflow-x-auto mr-[48px]"
            loading={loading || tableColumns.length === 0}
          />
        </div>

        {!loading && (
          <div className="flex gap-4 w-full justify-between items-center">
            <DownloadResults
              result={selectedInvoices.map((invoice) => {
                const { rawData, ...filteredData } = invoice;
                const filteredResult = templateItems?.reduce<
                  Record<string, any>
                >((acc, { label }) => {
                  const key = camelCase(label);
                  if (filteredData[key]) {
                    acc[key] = filteredData[key];
                  }
                  return acc;
                }, {});
                return filteredResult;
              })}
            />
            <div className="mr-10">
              <AppButton
                onClick={downloadOriginalData}
                children=""
                width="fit-content"
                variant="secondary"
              />
            </div>
          </div>
        )}

        <InvoicePreviewModal
          open={!!selectedFile}
          onCancel={closeModal}
          invoiceDetails={selectedFile}
        />
      </div>
    </div>
  );
};

export default ExtractionDetailsTable;
