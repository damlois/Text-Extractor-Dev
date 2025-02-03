import { useLocation } from "react-router-dom";
import DownloadResults from "./DownloadResults";
import CustomTable from "../../../../../components/CustomTable";
import { constructTableColumns } from "../../../../../utils";
import { useEffect, useState, useMemo } from "react";
import { invoiceProcessorApi } from "../../../../../api/invoice-api";
import { ProcessedInvoice } from "../../../../../types";
import { Spin } from "antd";

interface DisplayInvoice
  extends Pick<
    ProcessedInvoice,
    "id" | "file_name" | "processing_status" | "created_at" | "invoice_data"
  > {}

const ExtractionDetailsTable = () => {
  const [selectedInvoices, setSelectedInvoices] = useState<DisplayInvoice[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const selectedInvoiceIds = useMemo(
    () => location.state?.selectedInvoiceIds || [],
    [location.state?.selectedInvoiceIds]
  );

  const formatInvoiceData = (
    invoices: ProcessedInvoice[]
  ): DisplayInvoice[] => {
    return invoices.map(
      ({ id, file_name, processing_status, created_at, invoice_data }) => ({
        id,
        file_name,
        processing_status,
        created_at: new Date(created_at).toLocaleDateString(),
        invoice_data,
      })
    );
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
              dataSource={[selectedInvoices]}
              columns={
                selectedInvoices.length > 0
                  ? constructTableColumns(selectedInvoices)
                  : []
              }
              rowKey="id"
              pagination={selectedInvoices.length > 7 ? { pageSize: 7 } : false}
              bordered
              striped
              className="overflow-x-auto mr-[48px]"
            />
          )}
        </div>
        <DownloadResults result={selectedInvoices} />
      </div>
    </div>
  );
};

export default ExtractionDetailsTable;
