import { useEffect, useRef, useState } from "react";
import MetricCard from "../../../../../../components/MetricCard";
import { processorApi } from "../../../../../../api";
import { useNavigate } from "react-router-dom";
import { useDocumentProcessor } from "../../../../context/DocumentProcessorContext";
import {
  DuplicateDocumentItemResponse,
  DuplicateDocumentsFileHashMap,
} from "../../../types";
import { manageSSE } from "../../../../../../service/sseClient";
import { showNotification } from "../../../../../../utils/notification";
import { Spin } from "antd";
import { PERMISSIONS } from "../../../../constants/permissions";
import { usePermission } from "../../../../context/PermissionContext";
import { useApplication } from "../../../../../../context/ApplicationContext";

const SummaryDashboard = () => {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [duplicatesLoading, setDuplicatesLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);

  const { userHasPermission } = usePermission();
  const canViewDuplicates = userHasPermission(PERMISSIONS.VIEW_DUPLICATE);

  const navigate = useNavigate();
  const {
    setDuplicatesMapById,
    setDuplicatesMapByFileHash,
    duplicatesCount,
    setDuplicatesCount,
  } = useDocumentProcessor();

  const { documentType } = useApplication();

  const metricsFetched = useRef(false);
  const sseRef = useRef<{ stop: () => void } | null>(null);

  const fetchMetrics = async () => {
    if (metricsFetched.current) return;
    metricsFetched.current = true;

    setMetricsLoading(true);
    try {
      const response = await processorApi.getDocumentMetrics(documentType);
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
    let documentIdMap: Record<string, DuplicateDocumentItemResponse> = {};

    const fileHashMap = data.duplicates?.reduce(
      (acc: DuplicateDocumentsFileHashMap, item: any) => {
        const updatedDocuments = item.invoices
          .map((document: any) => {
            const { status, ...rest } = document;
            const updatedDocument = {
              ...rest,
              processing_status:
                status.toLowerCase() === "completed" ? "successful" : status,
            };

            if (!documentIdMap[document.id] && document.id) {
              documentIdMap[document.id] = updatedDocument;
            }

            return updatedDocument;
          })
          .sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );

        acc[item.file_hash] = {
          documents: updatedDocuments,
          visible: true,
        };

        count += item.invoices.length;
        return acc;
      },
      {}
    );

    setDuplicatesMapById(documentIdMap);
    setDuplicatesMapByFileHash(fileHashMap);
    setDuplicatesCount(count);
  };

  useEffect(() => {
    fetchMetrics();
    if (!sseRef.current) {
      sseRef.current = manageSSE(
        `/invoices/duplicate-stream?document_type=${documentType}`,
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
                status={"Duplicates"}
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
                  (
                    key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/_/g, " ")
                  ).split(" ")[0]
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
