import { useEffect, useRef, useState } from "react";
import MetricCard from "../../../../../../../components/MetricCard";
import { invoiceProcessorApi } from "../../../../../../../api/invoice-api";
import { useNavigate } from "react-router-dom";
import { useInvoiceProcessor } from "../../../../../context/InvoiceProcessorContext";
import {
  DuplicateInvoiceItemResponse,
  DuplicateInvoicesFileHashMap,
  DuplicateInvoicesResponse,
} from "../../types";
import { manageSSE } from "../../../../../../../service/sseClient";
import { showNotification } from "../../../../../../../utils/notification";

const SummaryDashboard = () => {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const {
    setDuplicatesMapById,
    setDuplicatesMapByFileHash,
    duplicatesCount,
    setDuplicatesCount,
  } = useInvoiceProcessor();

  const metricsFetched = useRef(false);
  const sseRef = useRef<{ stop: () => void } | null>(null);

  const fetchMetrics = async () => {
    if (metricsFetched.current) return;
    metricsFetched.current = true;

    setLoading(true);
    try {
      const response = await invoiceProcessorApi.getInvoiceMetrics();
      setMetrics(response.data.data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  const handleSSEMessage = (data: any) => {
    if (data.error) {
      showNotification("error", data.error);
      return;
    }

    let count = 0;
    let invoiceIdMap: Record<string, DuplicateInvoiceItemResponse> = {};

    const fileHashMap = data.duplicates?.reduce(
      (acc: DuplicateInvoicesFileHashMap, item: DuplicateInvoicesResponse) => {
        acc[item.file_hash] = {
          invoices: item.invoices,
          visible: true,
        };

        item.invoices.forEach((invoice) => {
          if (!invoiceIdMap[invoice.id] && invoice.id) {
            invoiceIdMap[invoice.id] = invoice;
          }
        });

        count += item.invoices.length;
        return acc;
      },
      {}
    );

    setLoading(false);

    setDuplicatesMapById(invoiceIdMap);
    setDuplicatesMapByFileHash(fileHashMap);
    setDuplicatesCount(count);
  };

  useEffect(() => {
    fetchMetrics();
    if (!sseRef.current) {
      sseRef.current = manageSSE(
        "/invoices/duplicate-stream",
        handleSSEMessage
      );
    }

    return () => {
      sseRef.current?.stop();
      sseRef.current = null;
    };
  }, []);

  return (
    <>
      {!loading && (
        <div className="grid gap-4 space-between flex-wrap lg:grid-cols-4 sm:grid-cols-1">
          <MetricCard
            key={"duplicate"}
            iconUrl={"/assets/icons/dashboard-failed-icon.svg"}
            status={"Duplicate Invoices"}
            count={String(duplicatesCount)}
            onClick={
              duplicatesCount > 0
                ? () =>
                    navigate("../extraction-history/duplicates", {
                      state: { duplicatesCheckDone: true },
                    })
                : undefined
            }
          />
          {Object.entries(metrics).map(([key, value]) => (
            <MetricCard
              key={key}
              iconUrl={`/assets/icons/dashboard-${
                key.includes("fail") ? "failed" : "success"
              }-icon.svg`}
              status={
                key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")
              }
              count={value.toString()}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default SummaryDashboard;
