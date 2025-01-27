import EmailConfigRow from "./components/configurationDetailsPanel/EmailConfigRow";
import LabelSetupRow from "./components/configurationDetailsPanel/LabelSetupRow";
import DeactivateRow from "./components/configurationDetailsPanel/DeactivateRow";

const ViewDataSourceDetails = () => {
  return (
    <div className="w-full border border-[#DBDFEA] rounded-lg py-4 px-6">
      <EmailConfigRow />
      <LabelSetupRow />
      <DeactivateRow />
    </div>
  );
};

export default ViewDataSourceDetails;
