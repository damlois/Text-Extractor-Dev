import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { Application, TemplateItem } from "../types";

interface ApplicationContextProps {
  currentApp: Application | null;
  setCurrentApp: Dispatch<SetStateAction<Application | null>>;
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

  return (
    <ApplicationContext.Provider
      value={{
        currentApp,
        setCurrentApp,
        labels,
        setLabels,
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
