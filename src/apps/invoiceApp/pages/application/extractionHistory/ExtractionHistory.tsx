import ExtractionHistoryTable from "./components/extraction-history/historyTable";
import SummaryDashboard from "./components/extraction-history/summaryDashboard";

const ExtractionHistory = () => {
  return (
    <div className="flex flex-col gap-6">
      <SummaryDashboard />
      <ExtractionHistoryTable />
    </div>
  );
};

export default ExtractionHistory;
