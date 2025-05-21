import { createContext, ReactNode, useContext, useState } from "react";
import { processorApi } from "../../../api";
import { TemplateItem } from "../../../types";
import { handleError } from "../../../utils/notification";
import { useDocumentProcessor } from "./DocumentProcessorContext";

interface TemplateContextProps {
  templateItems: TemplateItem[];
  setTemplateItems: (items: TemplateItem[]) => void;
  loading: boolean;
  fetchTemplate: () => Promise<void>;
  saveTemplate: (dataSourceId?: string) => Promise<void>;
}

const TemplateContext = createContext<TemplateContextProps | undefined>(
  undefined
);

export const TemplateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [templateItems, setTemplateItems] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(false);

  const { currentDataSource } = useDocumentProcessor();

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await processorApi.getTemplate(
        currentDataSource?.id
      );
      setTemplateItems(response.data.data.items);
    } catch (error) {
      handleError(error, "Template");
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async () => {
    try {
      setLoading(true);
      await processorApi.updateTemplate(
        currentDataSource?.id,
        templateItems
      );
    } catch (error) {
      handleError("error", "Template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TemplateContext.Provider
      value={{
        templateItems,
        setTemplateItems,
        loading,
        fetchTemplate,
        saveTemplate,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }
  return context;
};
