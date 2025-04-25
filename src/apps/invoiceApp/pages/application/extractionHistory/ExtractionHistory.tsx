import ExtractionHistoryTable from "./components/extractionHistory/historyTable";
import SummaryDashboard from "./components/extractionHistory/summaryDashboard";

const ExtractionHistory = () => {
  return (
    <div className="flex flex-col gap-6">
      <SummaryDashboard />
      <ExtractionHistoryTable />
    </div>
  );
};

export default ExtractionHistory;
