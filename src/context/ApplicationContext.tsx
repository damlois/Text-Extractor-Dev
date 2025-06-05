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
import { determineDocumentType } from "../utils";

interface ApplicationContextProps {
  currentApp: Application | null;
  documentType: DocumentType | null;
  setAppType: (app: Application) => void;
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
  const documentType = determineDocumentType(currentApp);

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
