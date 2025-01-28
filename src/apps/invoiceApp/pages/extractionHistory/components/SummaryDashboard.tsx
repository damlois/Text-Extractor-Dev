import { useEffect, useState } from "react";
import MetricCard from "../../../../../components/MetricCard";
import { invoiceProcessorApi } from "../../../../../api/invoice-api";

const SummaryDashboard = () => {
  const [metrics, setMetrics] = useState({
    successful: 0,
    failed: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await invoiceProcessorApi.getProcessedInvoices({
          page: 1,
          size: 100,
        });

        const invoices = response.data.data.invoices;

        const successful = invoices.filter(
          (invoice) => invoice.processing_status === "COMPLETED"
        ).length;
        const failed = invoices.filter(
          (invoice) => invoice.processing_status !== "COMPLETED"
        ).length;

        setMetrics({ successful, failed });
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="grid gap-4 space-between flex-wrap lg:grid-cols-2 sm:grid-cols-1">
      <MetricCard
        iconUrl="/assets/icons/dashboard-success-icon.svg"
        status="Successful"
        count={metrics.successful.toString()}
      />
      <MetricCard
        iconUrl="/assets/icons/dashboard-failed-icon.svg"
        status="Failed"
        count={metrics.failed.toString()}
      />
    </div>
  );
};

export default SummaryDashboard;
