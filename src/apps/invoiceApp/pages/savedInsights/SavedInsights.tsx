import { useState, useEffect } from "react";
import { Table, Dropdown, Button } from "antd";
import type { TableColumnsType } from "antd";
import { FaEllipsisVertical } from "react-icons/fa6";
import FilterInsightsModal from "./components/FilterInsightsModal";
import { invoiceProcessorApi } from "../../../../api/invoice-api";
import { ChatSessionSummary } from "../../../../types";
import { useNavigate } from "react-router-dom";

const SavedInsights = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [savedInsights, setSavedInsights] = useState<ChatSessionSummary[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const fetchSavedInsights = async () => {
    setLoading(true);
    try {
      const response = await invoiceProcessorApi.getChatSessions();
      setSavedInsights(response.data.data);
    } catch (error) {
      console.error("Error fetching saved insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilterModal = () => setShowFilterModal(!showFilterModal);

  useEffect(() => {
    fetchSavedInsights();
  }, []);

  const handleViewSession = (sessionId: string, invoiceIds: string[]) => {
    navigate("../extraction-history/generate-insights", {
      state: {
        selectedInvoiceIds: invoiceIds,
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
            icon={<FaEllipsisVertical className="text-black" />}
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
        <img
          src="/assets/images/filter-btn.png"
          alt="Filter"
          className="cursor-pointer"
          onClick={toggleFilterModal}
        />
      </div>
      <div className="overflow-x-auto">
        <Table<ChatSessionSummary>
          rowKey="session_id"
          columns={savedInsightsColumns}
          dataSource={savedInsights}
          className="invoice-app-table extraction-history-table no-vertical-lines"
          loading={loading}
          pagination={savedInsights.length > 10 ? { pageSize: 10 } : false}
        />
      </div>
      <FilterInsightsModal
        open={showFilterModal}
        onCancel={toggleFilterModal}
      />
    </div>
  );
};

export default SavedInsights;
