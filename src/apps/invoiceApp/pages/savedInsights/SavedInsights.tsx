import { useState, useEffect } from "react";
import { Table, Dropdown, Button } from "antd";
import type {TableColumnsType } from "antd";
import { FaEllipsisVertical } from "react-icons/fa6";
import FilterInsightsModal from "./components/FilterInsightsModal";

export interface SavedInsights {
  insightSummary: string;
  created_at: string;
}

const SavedInsights = () => {
  const [loading, setLoading] = useState(false);
  const [savedInsights, setSavedInsights] = useState<SavedInsights[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const data = [
    {
      insightSummary: "Difference in payment terms across invoices",
      created_at: "9th January 2025",
    },
    {
      insightSummary: "Difference in payment terms across invoices",
      created_at: "9th January 2025",
    },
    {
      insightSummary: "Difference in payment terms across invoices",
      created_at: "9th January 2025",
    },
    {
      insightSummary: "Difference in payment terms across invoices",
      created_at: "9th January 2025",
    },
    {
      insightSummary: "Difference in payment terms across invoices",
      created_at: "9th January 2025",
    },
  ];

  const fetchSavedInsights = async (page: number, size: number) => {
    setLoading(true);
    try {
      setSavedInsights(data);
    } catch (error) {
      console.error("Error fetching saved insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilterModal = () => setShowFilterModal(!showFilterModal);

  useEffect(() => {
    fetchSavedInsights(1, 10);
  }, []);

  const savedInsightsColumns: TableColumnsType<SavedInsights> = [
    {
      title: "Saved Insights",
      dataIndex: "insightSummary",
      render: (text: string, record: SavedInsights) => (
        <button className="text-dark-gray text-[14px] font-medium underline text-left">
          {text}
        </button>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      render: (text: string) => (
        <span className="text-[#28373] text-[14px]">{text}</span>
      ),
    },
    {
      title: "",
      key: "actions",
      align: "center" as const,
      render: (_: any, record: SavedInsights) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: (
                  <a onClick={() => alert(`view ${record.insightSummary}`)}>
                    View
                  </a>
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

  const handleTableChange = (pagination: any) => {
    // fetchInvoices(pagination.current, pagination.pageSize);
  };

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
        <Table<SavedInsights>
          rowKey="id"
          columns={savedInsightsColumns}
          dataSource={savedInsights}
          className="invoice-app-table extraction-history-table no-vertical-lines"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
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
