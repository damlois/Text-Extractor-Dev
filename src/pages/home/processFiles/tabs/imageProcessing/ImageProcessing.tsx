import { useEffect } from "react";
import DisplayImages from "./components/DisplayImages";
import { useImageProcessor } from "../../../../../context/ImageProcessorContext";
import ImagesChat from "./components/ImagesChat";
import InitialQuery from "./components/InitialQuery";

const AnalyzeImage: React.FC = () => {
  const { currentPage, setCurrentPage } = useImageProcessor();

  useEffect(() => {
    setCurrentPage("ImagesDisplay");
  }, []);

  return (
    <>
      {currentPage === "ImagesDisplay" ? (
        <DisplayImages />
      ) : currentPage === "InitialQuery" ? (
        <InitialQuery />
      ) : (
        <ImagesChat />
      )}
    </>
  );
};

export default AnalyzeImage;
