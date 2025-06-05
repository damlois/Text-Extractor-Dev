import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import {
  DataSourceDetails,
  DocumentType,
  ProcessedDocument,
} from "../types";
import {
  DuplicateDocumentItemResponse,
  DuplicateDocumentsFileHashMap,
  ItemField,
  RegularField,
} from "../pages/app/extractionHistory/types";
import { processorApi } from "../api";
import { useApplication } from "./ApplicationContext";

interface DocumentProcessorContextProps {
  currentDataSource: DataSourceDetails | undefined;
  setCurrentDataSource: Dispatch<SetStateAction<DataSourceDetails | undefined>>;
  documentsMapById: Record<string, ProcessedDocument>;
  setDocumentsMapById: Dispatch<
    SetStateAction<Record<string, ProcessedDocument>>
  >;
  duplicatesMapById: Record<string, DuplicateDocumentItemResponse> | null;
  setDuplicatesMapById: Dispatch<
    SetStateAction<Record<string, DuplicateDocumentItemResponse>>
  >;
  duplicateMapByFileHash: DuplicateDocumentsFileHashMap;
  setDuplicatesMapByFileHash: Dispatch<
    SetStateAction<DuplicateDocumentsFileHashMap>
  >;
  duplicatesRefresh: boolean | null;
  setDuplicatesRefresh: Dispatch<SetStateAction<boolean>>;
  duplicatesCount: number;
  setDuplicatesCount: Dispatch<SetStateAction<number>>;
  reviewDocument: ProcessedDocument | undefined;
  setReviewDocument: Dispatch<SetStateAction<ProcessedDocument | undefined>>;
  regularFieldsData: RegularField[];
  itemsFieldsData: ItemField[];
  setRegularFieldsData: Dispatch<SetStateAction<RegularField[]>>;
  setItemsFieldsData: Dispatch<SetStateAction<ItemField[]>>;
  loadingDataSource: boolean;
  fetchDataSource: (docType?: DocumentType | null) => Promise<void>;
}

interface DocumentProcessorProviderProps {
  children: ReactNode;
}

const DocumentProcessorContext = createContext<
  DocumentProcessorContextProps | undefined
>(undefined);

export const DocumentProcessorProvider: React.FC<
  DocumentProcessorProviderProps
> = ({ children }) => {
  const [currentDataSource, setCurrentDataSource] = useState<
    DataSourceDetails | undefined
  >(undefined);
  const [documentsMapById, setDocumentsMapById] = useState<
    Record<string, ProcessedDocument>
  >({});
  const [duplicatesMapById, setDuplicatesMapById] = useState<
    Record<string, DuplicateDocumentItemResponse>
  >({});
  const [duplicateMapByFileHash, setDuplicatesMapByFileHash] =
    useState<DuplicateDocumentsFileHashMap>({});
  const [duplicatesRefresh, setDuplicatesRefresh] = useState<boolean>(false);
  const [duplicatesCount, setDuplicatesCount] = useState(0);
  const [reviewDocument, setReviewDocument] = useState<
    ProcessedDocument | undefined
  >();
  const [regularFieldsData, setRegularFieldsData] = useState<RegularField[]>(
    []
  );
  const [itemsFieldsData, setItemsFieldsData] = useState<ItemField[]>([]);

  const [loadingDataSource, setLoadingDataSource] = useState(true);

  const { documentType } = useApplication();

  const fetchDataSource = async (type?: DocumentType | null) => {
    try {
      setLoadingDataSource(true);
      const response = await processorApi.getDataSourceDetails(
        type || documentType
      );
      const data = response.data.data;
      setCurrentDataSource(data[data.length - 1]);
    } catch (error) {
      console.error("Error fetching data source details:", error);
    } finally {
      setLoadingDataSource(false);
    }
  };

  return (
    <DocumentProcessorContext.Provider
      value={{
        currentDataSource,
        setCurrentDataSource,
        documentsMapById,
        setDocumentsMapById,
        duplicatesMapById,
        setDuplicatesMapById,
        duplicateMapByFileHash,
        setDuplicatesMapByFileHash,
        duplicatesRefresh,
        setDuplicatesRefresh,
        duplicatesCount,
        setDuplicatesCount,
        reviewDocument,
        setReviewDocument,
        itemsFieldsData,
        setItemsFieldsData,
        regularFieldsData,
        setRegularFieldsData,
        loadingDataSource,
        fetchDataSource,
      }}
    >
      {children}
    </DocumentProcessorContext.Provider>
  );
};

export const useDocumentProcessor = () => {
  const context = useContext(DocumentProcessorContext);
  if (!context) {
    throw new Error(
      "useDocumentProcessor must be used within a DocumentProcessorProvider"
    );
  }
  return context;
};
