import { useEffect, useState } from "react";
import MetricCard from "../../../../../../components/MetricCard";
import { invoiceProcessorApi } from "../../../../../../api/invoice-api";
import { useNavigate } from "react-router-dom";

const SummaryDashboard = () => {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const navigate = useNavigate();

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
    <div className="grid gap-4 space-between flex-wrap lg:grid-cols-4 sm:grid-cols-1">
      <MetricCard
        key={"duplicate"}
        iconUrl={`/assets/icons/dashboard-failed-icon.svg`}
        status={"Duplicate Invoices"}
        count={"6"}
        onClick={() => navigate("/")}
      />
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
