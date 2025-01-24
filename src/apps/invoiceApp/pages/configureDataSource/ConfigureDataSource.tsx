import { useEffect, useState } from "react";
import { Spin } from "antd";
import NoDataSource from "./components/features/NoDataSource";
import DataSourceDetails from "./DataSourceDetails";

const ConfigureDataSource = () => {
  const [loading, setLoading] = useState(false);

  const dataSource = true;

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
        <>{dataSource ? <DataSourceDetails /> : <NoDataSource />}</>
      )}
    </div>
  );
};

export default ConfigureDataSource;
