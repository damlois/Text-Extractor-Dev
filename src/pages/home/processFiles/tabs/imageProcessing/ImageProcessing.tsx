import { useEffect } from "react";
import DisplayImages from "./components/DisplayImages";
import QueryImage from "./components/QueryImage";
import { useImageProcessor } from "../../../../../context/ImageProcessorContext";

const AnalyzeImage: React.FC = () => {
  const { currentPage, setCurrentPage } = useImageProcessor();

  useEffect(() => {
    setCurrentPage("ImagesDisplay");
  }, []);

  return (
    <>{currentPage === "ImagesDisplay" ? <DisplayImages /> : <QueryImage />}</>
  );
};

export default AnalyzeImage;
