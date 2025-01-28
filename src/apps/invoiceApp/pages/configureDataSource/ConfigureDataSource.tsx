import { useEffect, useState } from "react";
import { Spin } from "antd";
import NoDataSource from "./components/NoDataSource";
import ViewDataSourceDetails from "./ViewDataSourceDetails";

const ConfigureDataSource = () => {
  const [loading, setLoading] = useState(false);

  const dataSourceExists = localStorage.getItem("data_source_id");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-start font-inter">
      {loading ? (
        <Spin className="mt-20" size="large" />
      ) : (
        <>{dataSourceExists ? <ViewDataSourceDetails /> : <NoDataSource />}</>
      )}
    </div>
  );
};

export default ConfigureDataSource;
