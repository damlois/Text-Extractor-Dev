import { useState, useEffect } from "react";
import { fileProcessorApi } from "../api/api";
import { useFileProcessor } from "../context/FileProcessorContext";

export const useCurrentUser = () => {
  const { setCurrentUser } = useFileProcessor();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fileProcessorApi.getCurrentUser().then((res) => {
      setCurrentUser(res.data);
      setLoading(false);
    });
  }, [setCurrentUser]);

  return { loading };
};
