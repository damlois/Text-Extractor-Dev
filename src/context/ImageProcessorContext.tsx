import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { PageT } from "../pages/home/processFiles/tabs/imageProcessing/types";
import { ImageData } from "../types";

interface ImageProcessorContextProps {
  currentPage: PageT | null;
  selectedImage: ImageData | null;
  currentSessionId: string | null;
  setCurrentPage: Dispatch<SetStateAction<PageT | null>>;
  setSelectedImage: Dispatch<SetStateAction<ImageData | null>>;
  setCurrentSessionId: Dispatch<SetStateAction<string | null>>;
}

interface ImageProcessorProviderProps {
  children: ReactNode;
}

const ImageProcessorContext = createContext<
  ImageProcessorContextProps | undefined
>(undefined);

export const ImageProcessorProvider: React.FC<ImageProcessorProviderProps> = ({
  children,
}) => {
  const [currentPage, setCurrentPage] = useState<PageT | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  return (
    <ImageProcessorContext.Provider
      value={{
        currentPage,
        selectedImage,
        currentSessionId,
        setCurrentPage,
        setSelectedImage,
        setCurrentSessionId,
      }}
    >
      {children}
    </ImageProcessorContext.Provider>
  );
};

export const useImageProcessor = () => {
  const context = useContext(ImageProcessorContext);
  if (!context) {
    throw new Error(
      "useImageProcessor must be used within a ImageProcessorProvider"
    );
  }
  return context;
};
