import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { Application, DocumentType, TemplateItem } from "../types";
import { getAppTypeFromStorage, setAppTypeInStorage } from "../utils/storage";

interface ApplicationContextProps {
  currentApp: Application | null;
  documentType: DocumentType | null;
  setAppType: (app: Application) => void;
  labels: TemplateItem[] | null;
  setLabels: Dispatch<SetStateAction<TemplateItem[] | null>>;
}

interface ApplicationProviderProps {
  children: ReactNode;
}

const ApplicationContext = createContext<ApplicationContextProps | undefined>(
  undefined
);

export const ApplicationProvider: React.FC<ApplicationProviderProps> = ({
  children,
}) => {
  const [currentApp, setCurrentApp] = useState<Application | null>(null);
  const [labels, setLabels] = useState<TemplateItem[] | null>(null);

  const documentType =
    currentApp === "PURCHASE ORDER" ? "PURCHASE_ORDER" : currentApp;

  useEffect(() => {
    setCurrentApp(getAppTypeFromStorage());
  }, []);

  const setAppType = (app: Application) => {
    setCurrentApp(app);
    setAppTypeInStorage(app);
  };

  return (
    <ApplicationContext.Provider
      value={{
        currentApp,
        documentType,
        labels,
        setLabels,
        setAppType,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error("useApplication must be used within a ApplicationProvider");
  }
  return context;
};
