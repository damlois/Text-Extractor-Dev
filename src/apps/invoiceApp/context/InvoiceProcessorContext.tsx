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
import { invoiceProcessorApi } from "../../../api/invoice-api";

interface InvoiceProcessorContextProps {
  currentDataSource: DataSourceDetails | undefined;
  setCurrentDataSource: Dispatch<SetStateAction<DataSourceDetails | undefined>>;
  invoicesMapById: Record<string, ProcessedInvoice>;
  setInvoicesMapById: Dispatch<
    SetStateAction<Record<string, ProcessedInvoice>>
  >;
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
  loadingDataSource: boolean;
  fetchDataSource: () => Promise<void>;
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
  const [currentDataSource, setCurrentDataSource] = useState<
    DataSourceDetails | undefined
  >(undefined);
  const [invoicesMapById, setInvoicesMapById] = useState<
    Record<string, ProcessedInvoice>
  >({});
  const [duplicatesMapById, setDuplicatesMapById] = useState<
    Record<string, DuplicateInvoiceItemResponse>
  >({});
  const [duplicateMapByFileHash, setDuplicatesMapByFileHash] =
    useState<DuplicateInvoicesFileHashMap>({});
  const [duplicatesRefresh, setDuplicatesRefresh] = useState<boolean>(false);
  const [duplicatesCount, setDuplicatesCount] = useState(0);
  const [loadingDataSource, setLoadingDataSource] = useState(true);

  const fetchDataSource = async () => {
    try {
      setLoadingDataSource(true);
      const response = await invoiceProcessorApi.getDataSourceDetails();
      const data = response.data.data;
      setCurrentDataSource(data[data.length - 1]);
    } catch (error) {
      console.error("Error fetching data source details:", error);
    } finally {
      setLoadingDataSource(false);
    }
  };

  return (
    <InvoiceProcessorContext.Provider
      value={{
        currentDataSource,
        setCurrentDataSource,
        invoicesMapById,
        setInvoicesMapById,
        duplicatesMapById,
        setDuplicatesMapById,
        duplicateMapByFileHash,
        setDuplicatesMapByFileHash,
        duplicatesRefresh,
        setDuplicatesRefresh,
        duplicatesCount,
        setDuplicatesCount,
        loadingDataSource,
        fetchDataSource,
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
