import EmailConfigRow from "./components/configurationDetailsPanel/EmailConfigRow";
import LabelSetupRow from "./components/configurationDetailsPanel/LabelSetupRow";
import DeactivateRow from "./components/configurationDetailsPanel/DeactivateRow";
import { DataSourceDetails } from "../../../types";

interface ViewDataSourceDetailsProps {
  dataSourceDetails: DataSourceDetails | null;
  refreshPage: () => void;
}

const ViewDataSourceDetails = ({
  dataSourceDetails,
  refreshPage,
}: ViewDataSourceDetailsProps) => {
  return (
    <div className="w-full border border-[#DBDFEA] rounded-lg py-4 px-6">
      <EmailConfigRow
        dataSourceDetails={dataSourceDetails}
        refreshPage={refreshPage}
      />
      <LabelSetupRow
        refreshPage={refreshPage}
      />
      <DeactivateRow
        dataSourceDetails={dataSourceDetails}
        refreshPage={refreshPage}
      />
    </div>
  );
};

export default ViewDataSourceDetails;
