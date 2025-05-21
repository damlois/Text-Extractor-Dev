import { useState, useEffect, useMemo } from "react";
import { Table, Dropdown, Button } from "antd";
import type { TableColumnsType } from "antd";
import { FaEllipsisVertical } from "react-icons/fa6";
import FilterInsightsModal from "./components/FilterInsightsModal";
import { processorApi } from "../../../api";
import { ChatSessionSummary } from "../../../types";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../../utils/notification";

const SavedInsights = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [allInsights, setAllInsights] = useState<ChatSessionSummary[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [dateFilter, setDateFilter] = useState<{ from?: string; to?: string }>(
    {}
  );

  const fetchSavedInsights = async () => {
    setLoading(true);
    try {
      const response = await processorApi.getChatSessions();
      setAllInsights(response.data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInsights = useMemo(() => {
    if (!dateFilter.from && !dateFilter.to) {
      return allInsights;
    }

    return allInsights.filter((insight) => {
      const insightDate = new Date(insight.created_at);
      const fromDate = dateFilter.from ? new Date(dateFilter.from) : null;
      const toDate = dateFilter.to ? new Date(dateFilter.to) : null;

      if (fromDate && toDate) {
        return insightDate >= fromDate && insightDate <= toDate;
      } else if (fromDate) {
        return insightDate >= fromDate;
      } else if (toDate) {
        return insightDate <= toDate;
      }
      return true;
    });
  }, [allInsights, dateFilter]);

  const handleFilter = (dateFrom?: string, dateTo?: string) => {
    setDateFilter({ from: dateFrom, to: dateTo });
  };

  const toggleFilterModal = () => setShowFilterModal(!showFilterModal);

  useEffect(() => {
    fetchSavedInsights();
  }, []);

  const handleViewSession = (sessionId: string, documentIds: string[]) => {
    navigate("../extraction-history/generate-insights", {
      state: {
        selectedDocumentIds: documentIds,
        sessionId: sessionId,
      },
    });
  };

  const savedInsightsColumns: TableColumnsType<ChatSessionSummary> = [
    {
      title: "Saved Insights",
      dataIndex: "title",
      render: (text: string, record: ChatSessionSummary) => (
        <button
          className="text-dark-gray text-[14px] font-medium underline text-left"
          onClick={() =>
            handleViewSession(record.session_id, record.invoice_ids)
          }
        >
          {text}
        </button>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      render: (text: string) => (
        <span className="text-[#28373] text-[14px]">
          {new Date(text).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      align: "center" as const,
      render: (_: any, record: ChatSessionSummary) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: (
                  <button
                    className="w-full text-left"
                    onClick={() =>
                      handleViewSession(record.session_id, record.invoice_ids)
                    }
                  >
                    View
                  </button>
                ),
              },
            ],
          }}
        >
          <Button
            icon={FaEllipsisVertical({ className: "text-black" })}
            type="link"
            className="py-2 px-3 border border-[#E4E7EC] rounded-lg"
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <div
        className="p-4 border-r border-l border-t border-[#E4E7EC]"
        style={{ borderTop: "2px solid #E4E7EC" }}
      >
        <div className="flex items-center justify-between">
          <img
            src="/assets/images/filter-btn.png"
            alt="Filter"
            className="cursor-pointer"
            onClick={toggleFilterModal}
          />
          {(dateFilter.from || dateFilter.to) && (
            <span className="text-sm text-dark-gray">
              Filtered: {dateFilter.from} - {dateFilter.to}
            </span>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table<ChatSessionSummary>
          rowKey="session_id"
          columns={savedInsightsColumns}
          dataSource={filteredInsights}
          className="invoice-app-table extraction-history-table no-vertical-lines"
          loading={loading}
          pagination={filteredInsights.length > 10 ? { pageSize: 10 } : false}
        />
      </div>
      <FilterInsightsModal
        open={showFilterModal}
        onCancel={toggleFilterModal}
        onFilter={handleFilter}
      />
    </div>
  );
};

export default SavedInsights;
