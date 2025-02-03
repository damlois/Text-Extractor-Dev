import { useEffect, useState } from "react";
import { Spin } from "antd";
import NoDataSource from "./components/NoDataSource";
import ViewDataSourceDetails from "./ViewDataSourceDetails";
import { invoiceProcessorApi } from "../../../../api/invoice-api";
import { useInvoiceProcessor } from "../../context/InvoiceProcessorContext";

const ConfigureDataSource = () => {
  const [loading, setLoading] = useState(false);

  const { currentDataSource, setCurrentDataSource } = useInvoiceProcessor();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await invoiceProcessorApi.getDataSourceDetails();
        const data = response.data.data;
        setCurrentDataSource(data[data.length - 1]);
      } catch (error) {
        console.error("Error fetching data source details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-start font-inter">
      {loading ? (
        <Spin className="mt-20 mx-auto" size="large" />
      ) : (
        <>
          {currentDataSource ? (
            <ViewDataSourceDetails dataSourceDetails={currentDataSource} />
          ) : (
            <NoDataSource />
          )}
        </>
      )}
    </div>
  );
};

export default ConfigureDataSource;
