import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { DataSourceDetails, User } from "../../../types";

interface InvoiceProcessorContextProps {
  currentDataSource: DataSourceDetails | null;
  setCurrentDataSource: Dispatch<SetStateAction<DataSourceDetails | null>>;
}

interface InvoiceProcessorProviderProps {
  children: ReactNode;
}

const InvoiceProcessorContext = createContext<
  InvoiceProcessorContextProps | undefined
>(undefined);

export const InvoiceProcessorProvider: React.FC<
  InvoiceProcessorProviderProps
> = ({ children }) => {
  const [currentDataSource, setCurrentDataSource] =
    useState<DataSourceDetails | null>(null);
  return (
    <InvoiceProcessorContext.Provider
      value={{
        currentDataSource,
        setCurrentDataSource,
      }}
    >
      {children}
    </InvoiceProcessorContext.Provider>
  );
};

export const useInvoiceProcessor = () => {
  const context = useContext(InvoiceProcessorContext);
  if (!context) {
    throw new Error(
      "useInvoiceProcessor must be used within an InvoiceProcessorProvider"
    );
  }
  return context;
};
