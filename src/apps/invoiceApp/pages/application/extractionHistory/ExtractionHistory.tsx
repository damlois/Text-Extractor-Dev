import ExtractionHistoryTable from "./components/extraction-history/ExtractionHistoryTable";
import SummaryDashboard from "./components/extraction-history/SummaryDashboard";

const ExtractionHistory = () => {
  return (
    <div className="flex flex-col gap-6">
      <SummaryDashboard />
      <ExtractionHistoryTable />
    </div>
  );
};

export default ExtractionHistory;
