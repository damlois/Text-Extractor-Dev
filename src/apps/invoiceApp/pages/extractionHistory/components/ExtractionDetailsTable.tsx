import { useLocation } from "react-router-dom";
import DownloadResults from "./DownloadResults";
import CustomTable from "../../../../../components/CustomTable";
import { useEffect, useState, useMemo } from "react";
import { invoiceProcessorApi } from "../../../../../api/invoice-api";
import { ProcessedInvoice } from "../../../../../types";
import { Spin, Modal } from "antd";
import { formatExtractionValue } from "../../../../../utils";
import { camelCase } from "lodash";

const ExtractionDetailsTable = () => {
  const [selectedInvoices, setSelectedInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>();
  const location = useLocation();
  const selectedInvoiceIds = useMemo(
    () => location.state?.selectedInvoiceIds || [],
    [location.state?.selectedInvoiceIds]
  );

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
    return invoices.map(({ file_name, image_data, invoice_data }) => {
      const { sender, receiver, ...filteredInvoiceData } = invoice_data;
      return standardizeInvoice({
        file_name,
        ...filteredInvoiceData,
        raw_data: { file_name, image_data },
      });
    });
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
        setSelectedInvoices(formatInvoiceData(invoices));
      } catch (error) {
        console.error("Error fetching selected invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedInvoices();
  }, [selectedInvoiceIds]);

  const handleFileClick = (raw_data: any) => {
    setSelectedFile(raw_data);
  };

  const closeModal = () => {
    setSelectedFile(null);
  };

  const tableColumns = useMemo(() => {
    if (selectedInvoices.length === 0) return [];

    const sampleInvoice = selectedInvoices[0];
    const commonStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "200px",
      display: "inline-block",
    };

    return Object.keys(sampleInvoice)
      .filter((key) => key !== "rawData")
      .map((key) => ({
        title: key
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/_/g, " ")
          .toUpperCase(),
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
      }));
  }, [selectedInvoices]);

  return (
    <div className="flex gap-4 justify-start items-start w-full">
      <img src="/assets/icons/blue-circle-icon.svg" alt="InterprAIs Logo" />
      <div style={{ width: "-webkit-fill-available" }}>
        <p className="text-[13px] font-normal text-dark-gray mb-4">
          Review the details of your extraction below
        </p>
        <div className="w-full monospace-table">
          {loading ? (
            <Spin spinning={loading}> </Spin>
          ) : (
            <CustomTable
              dataSource={selectedInvoices}
              columns={tableColumns}
              rowKey="id"
              pagination={selectedInvoices.length > 7 ? { pageSize: 7 } : false}
              bordered
              striped
              className="overflow-x-auto mr-[48px]"
            />
          )}
        </div>
        
        <DownloadResults
          result={selectedInvoices.map((invoice) => {
            const { rawData, ...filteredData } = invoice;
            return filteredData;
          })}
        />

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
