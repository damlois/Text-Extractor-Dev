import { useEffect, useState } from "react";
import MetricCard from "../../../../../components/MetricCard";
import { invoiceProcessorApi } from "../../../../../api/invoice-api";

const SummaryDashboard = () => {
  const [metrics, setMetrics] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await invoiceProcessorApi.getInvoiceMetrics();
        setMetrics(response.data.data);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="grid gap-4 space-between flex-wrap lg:grid-cols-3 sm:grid-cols-1">
      {Object.entries(metrics).map(([key, value]) => (
        <MetricCard
          key={key}
          iconUrl={`/assets/icons/dashboard-${
            key.includes("fail") ? "failed" : "success"
          }-icon.svg`}
          status={key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
          count={value.toString()}
        />
      ))}
    </div>
  );
};

export default SummaryDashboard;
