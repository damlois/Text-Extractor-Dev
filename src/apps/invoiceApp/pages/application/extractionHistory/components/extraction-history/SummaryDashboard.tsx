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
import { Spin } from "antd";
import { PERMISSIONS } from "../../../../../constants";
import { usePermission } from "../../../../../context/PermissionContext";

const SummaryDashboard = () => {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [duplicatesLoading, setDuplicatesLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);

  const {userHasPermission} = usePermission();
  const canViewDuplicates = userHasPermission(PERMISSIONS.VIEW_DUPLICATE);

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

    setMetricsLoading(true);
    try {
      const response = await invoiceProcessorApi.getInvoiceMetrics();
      setMetrics(response.data.data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setMetricsLoading(false);
    }
  };

  const handleSSEMessage = (data: any) => {
    setDuplicatesLoading(false);

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
      {!(metricsLoading || duplicatesLoading) ? (
        <>
          <div
            className={`grid space-between flex-wrap sm:grid-cols-1 gap-4 ${
              canViewDuplicates ? "lg:grid-cols-4" : "lg:grid-cols-3"
            } `}
          >
            {canViewDuplicates && (
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
            )}
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
        </>
      ) : (
        <div className="h-[68px] flex justify-center items-center w-full">
          <Spin size="default"></Spin>
        </div>
      )}
    </>
  );
};

export default SummaryDashboard;
