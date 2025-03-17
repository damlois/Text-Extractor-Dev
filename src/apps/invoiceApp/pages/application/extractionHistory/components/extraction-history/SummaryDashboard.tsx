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

const SummaryDashboard = () => {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const {
    setDuplicatesMapById,
    setDuplicatesMapByFileHash,
    setDuplicatesCheckDone,
    duplicatesCount,
    setDuplicatesCount,
  } = useInvoiceProcessor();

  const metricsFetched = useRef(false);
  const eventSourceRef = useRef<EventSource | null>(null);

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

  const initializeSSE = () => {
    setDuplicatesCheckDone(false);

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    eventSourceRef.current = new EventSource(
      `${process.env.REACT_APP_INVOICE_API_URL}/invoices/duplicate-stream`
    );

    eventSourceRef.current.onmessage = (event) => {
      try {
        let message = event.data.trim();

        if (message.includes("[DONE]")) {
          message = message.replace("[DONE]", "").trim();
        }

        if (!message || !message.startsWith("data: ")) {
          return;
        }

        const jsonString = message.replace(/^data: /, "").trim();
        const data = JSON.parse(jsonString);

        if (data?.duplicates) {
          let count = 0;
          let invoiceIdMap: Record<string, DuplicateInvoiceItemResponse> = {};

          const fileHashMap = data.duplicates.reduce(
            (
              acc: DuplicateInvoicesFileHashMap,
              item: DuplicateInvoicesResponse
            ) => {
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

          setDuplicatesMapById(invoiceIdMap);
          setDuplicatesMapByFileHash(fileHashMap);
          setDuplicatesCount(count);
        }
      } catch (error) {
        eventSourceRef.current?.close();
      } finally {
        setLoading(false);
        setDuplicatesCheckDone(true);
      }
    };

    eventSourceRef.current.onerror = (error) => {
      eventSourceRef.current?.close();
      setLoading(false);
    };
  };

  useEffect(() => {
    fetchMetrics();
    initializeSSE();

    return () => {
      eventSourceRef.current?.close();
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
              metrics.duplicate_invoices > 0
                ? () => navigate("../extraction-history/duplicates")
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
