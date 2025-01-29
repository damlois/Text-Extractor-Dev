import { useEffect, useState } from "react";
import { Spin } from "antd";
import NoDataSource from "./components/NoDataSource";
import ViewDataSourceDetails from "./ViewDataSourceDetails";
import { invoiceProcessorApi } from "../../../../api/invoice-api";
import { DataSourceDetails } from "../../../../types";

const ConfigureDataSource = () => {
  const [loading, setLoading] = useState(false);
  const [dataSourceDetails, setDataSourceDetails] =
    useState<DataSourceDetails | null>(null);

  const dataSourceId = localStorage.getItem("data_source_id");

  useEffect(() => {
    const fetchData = async () => {
      if (!dataSourceId) return;

      setLoading(true);
      try {
        const response = await invoiceProcessorApi.getDataSourceDetails(
          dataSourceId
        );
        setDataSourceDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching data source details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataSourceId]);

  return (
    <div className="flex flex-col items-start font-inter">
      {loading ? (
        <Spin className="mt-20 mx-auto" size="large" />
      ) : (
        <>
          {dataSourceId ? (
            <ViewDataSourceDetails dataSourceDetails={dataSourceDetails} />
          ) : (
            <NoDataSource />
          )}
        </>
      )}
    </div>
  );
};

export default ConfigureDataSource;
