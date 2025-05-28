import { useEffect, useState } from "react";
import { Spin } from "antd";
import NoDataSource from "./components/NoDataSource";
import ViewDataSourceDetails from "./ViewDataSourceDetails";
import { useDocumentProcessor } from "../../../context/DocumentProcessorContext";

const ConfigureDataSource = () => {
  const [pageRefresh, setPageRefresh] = useState(false);

  const { currentDataSource, loadingDataSource, fetchDataSource } =
    useDocumentProcessor();

  useEffect(() => {
    fetchDataSource();
  }, [pageRefresh]);

  const refreshPage = () => setPageRefresh(!pageRefresh);

  return (
    <div className="flex flex-col items-start font-inter">
      {loadingDataSource ? (
        <Spin className="mt-20 mx-auto" size="large" />
      ) : (
        <>
          {currentDataSource ? (
            <ViewDataSourceDetails
              dataSourceDetails={currentDataSource}
              refreshPage={refreshPage}
            />
          ) : (
            <NoDataSource />
          )}
        </>
      )}
    </div>
  );
};

export default ConfigureDataSource;
