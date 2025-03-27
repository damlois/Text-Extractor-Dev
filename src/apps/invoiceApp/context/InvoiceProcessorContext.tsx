import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { DataSourceDetails, ProcessedInvoice } from "../../../types";
import {
  DuplicateInvoiceItemResponse,
  DuplicateInvoicesFileHashMap,
} from "../pages/application/extractionHistory/types";

interface InvoiceProcessorContextProps {
  currentDataSource: DataSourceDetails | undefined;
  setCurrentDataSource: Dispatch<SetStateAction<DataSourceDetails | undefined>>;
  duplicatesMapById: Record<string, DuplicateInvoiceItemResponse> | null;
  setDuplicatesMapById: Dispatch<
    SetStateAction<Record<string, DuplicateInvoiceItemResponse>>
  >;
  duplicateMapByFileHash: DuplicateInvoicesFileHashMap;
  setDuplicatesMapByFileHash: Dispatch<
    SetStateAction<DuplicateInvoicesFileHashMap>
  >;
  duplicatesRefresh: boolean | null;
  setDuplicatesRefresh: Dispatch<SetStateAction<boolean>>;
  duplicatesCount: number;
  setDuplicatesCount: Dispatch<SetStateAction<number>>;
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
    useState<DataSourceDetails | undefined>(undefined);
  const [duplicatesMapById, setDuplicatesMapById] = useState<
    Record<string, DuplicateInvoiceItemResponse>
  >({});
  const [duplicateMapByFileHash, setDuplicatesMapByFileHash] =
    useState<DuplicateInvoicesFileHashMap>({});
  const [duplicatesRefresh, setDuplicatesRefresh] =
    useState<boolean>(false);
  const [duplicatesCount, setDuplicatesCount] = useState(0);

  return (
    <InvoiceProcessorContext.Provider
      value={{
        currentDataSource,
        setCurrentDataSource,
        duplicatesMapById,
        setDuplicatesMapById,
        duplicateMapByFileHash,
        setDuplicatesMapByFileHash,
        duplicatesRefresh,
        setDuplicatesRefresh,
        duplicatesCount,
        setDuplicatesCount,
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
