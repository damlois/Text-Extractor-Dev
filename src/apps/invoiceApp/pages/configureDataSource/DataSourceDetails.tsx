import EmailConfigRow from "./components/configurationPanel/EmailConfigRow";
import LabelSetupRow from "./components/configurationPanel/LabelSetupRow";
import DeactivateRow from "./components/configurationPanel/DeactivateRow";

const DataSourceDetails = () => {
  return (
    <div className="w-full border border-[#DBDFEA] rounded-lg py-4 px-6">
      <EmailConfigRow />
      <LabelSetupRow />
      <DeactivateRow />
    </div>
  );
};

export default DataSourceDetails;
