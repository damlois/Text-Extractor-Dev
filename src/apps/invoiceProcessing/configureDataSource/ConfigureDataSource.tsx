import { useEffect, useState } from "react";
import { Spin } from "antd";
import NoDataSource from "./components/NoDataSource";

const ConfigureDataSource = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-start font-inter">
      <div className="flex flex-col items-center w-full p-6">
        {loading ? (
          <Spin className="mt-20" size="large" />
        ) : (
          <>{false ? <>Configuration Data!</> : <NoDataSource />}</>
        )}
      </div>
    </div>
  );
};

export default ConfigureDataSource;
