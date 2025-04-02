import { useLocation } from "react-router-dom";
import DownloadResults from "./DownloadResults";
import CustomTable from "../../../../../../../components/CustomTable";
import { useEffect, useState, useMemo } from "react";
import { invoiceProcessorApi } from "../../../../../../../api/invoice-api";
import { ProcessedInvoice } from "../../../../../../../types";
import { Modal } from "antd";
import { formatExtractionValue } from "../../../../../../../utils";
import { camelCase } from "lodash";
import { useFileProcessor } from "../../../../../../../context/FileProcessorContext";
import { useInvoiceProcessor } from "../../../../../context/InvoiceProcessorContext";
import AppButton from "../../../../../../../components/AppButton";

const ExtractionDetailsTable = () => {
  const [selectedInvoices, setSelectedInvoices] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>();
  const location = useLocation();
  const selectedInvoiceIds = useMemo(
    () => location.state?.selectedInvoiceIds || [],
    [location.state?.selectedInvoiceIds]
  );

  const { labels, setLabels } = useFileProcessor();
  const { currentDataSource } = useInvoiceProcessor();

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
  const standardizeInvoice = (
    invoice: Record<string, any>
  ): Record<string, any> => {
    return Object.keys(invoice).reduce<Record<string, any>>((acc, key) => {
      const formattedKey = camelCase(key);
      acc[formattedKey] = invoice[key] ?? "N/A";
      return acc;
    }, {});
  };

  const formatInvoiceData = (invoices: ProcessedInvoice[]) => {
    return invoices.map(({ file_name, image_data, extracted_content }) => {
      return standardizeInvoice({
        file_name,
        ...extracted_content,
        raw_data: { file_name, image_data },
      });
    });
  };

  const fetchLabels = async () => {
    const response = await invoiceProcessorApi.getTemplate(
      currentDataSource?.id
    );
    setLabels(response.data.data.items);
  };

  useEffect(() => {
    const fetchSelectedInvoices = async () => {
      if (selectedInvoiceIds.length === 0) return;

      setLoading(true);
      try {
        const response = await invoiceProcessorApi.getBatchInvoiceDetails(
          selectedInvoiceIds
        );
        const invoices = response.data.data;
        setOriginalData(removeFields(invoices));
        setSelectedInvoices(formatInvoiceData(invoices));
      } catch (error) {
        console.error("Error fetching selected invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    !labels && fetchLabels();
    fetchSelectedInvoices();
  }, [selectedInvoiceIds]);

  const handleFileClick = (raw_data: any) => {
    setSelectedFile(raw_data);
  };

  const closeModal = () => {
    setSelectedFile(null);
  };

  const tableColumns = useMemo(() => {
    if (labels?.length === 0) return [];

    const commonStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "200px",
      display: "inline-block",
    };

    return [{ label: "FILE NAME" }, ...(labels ?? [])]?.map(
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
  }, [labels]);

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
            columns={tableColumns || []}
            rowKey="id"
            pagination={selectedInvoices.length > 6 ? { pageSize: 6 } : false}
            bordered
            striped
            className="overflow-x-auto mr-[48px]"
            loading={loading}
          />
        </div>

        {!loading && (
          <div className="flex gap-4 w-full justify-between items-center">
            <DownloadResults
              result={selectedInvoices.map((invoice) => {
                const { rawData, ...filteredData } = invoice;
                const filteredResult = labels?.reduce<Record<string, any>>(
                  (acc, { label }) => {
                    const key = camelCase(label);
                    if (filteredData[key]) {
                      acc[key] = filteredData[key];
                    }
                    return acc;
                  },
                  {}
                );
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

        <Modal
          title={selectedFile?.file_name}
          open={!!selectedFile}
          onCancel={closeModal}
          footer={null}
          width={700}
        >
          <div className="p-6">
            <div>
              <img
                src={`data:image/jpeg;base64,${selectedFile?.image_data}`}
                alt="Invoice Preview"
                className="w-full rounded"
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ExtractionDetailsTable;
