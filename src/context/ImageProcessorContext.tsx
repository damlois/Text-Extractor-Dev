import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { PageT } from '../pages/home/processFiles/tabs/imageProcessing/types';

interface ImageProcessorContextProps {
  currentPage: PageT|null;
  setCurrentPage: Dispatch<SetStateAction<PageT|null>>;
}

interface ImageProcessorProviderProps {
  children: ReactNode;
}

const ImageProcessorContext = createContext<ImageProcessorContextProps | undefined>(undefined);

export const ImageProcessorProvider: React.FC<ImageProcessorProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageT | null>(null);

  return (
    <ImageProcessorContext.Provider
      value={{
        currentPage,
        setCurrentPage
      }}
    >
      {children}
    </ImageProcessorContext.Provider>
  );
};

export const useImageProcessor = () => {
  const context = useContext(ImageProcessorContext);
  if (!context) {
    throw new Error('useImageProcessor must be used within a ImageProcessorProvider');
  }
  return context;
};
