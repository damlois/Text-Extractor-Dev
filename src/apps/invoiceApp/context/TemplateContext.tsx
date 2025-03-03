import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { invoiceProcessorApi } from "../../../api/invoice-api";
import { TemplateItem } from "../../../types";
import { showNotification } from "../../../utils/notification";

interface TemplateContextProps {
  templateItems: TemplateItem[];
  setTemplateItems: (items: TemplateItem[]) => void;
  loading: boolean;
  fetchTemplate: () => Promise<void>;
  saveTemplate: () => Promise<void>;
}

const TemplateContext = createContext<TemplateContextProps | undefined>(
  undefined
);

export const TemplateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [templateItems, setTemplateItems] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await invoiceProcessorApi.getTemplate();
      setTemplateItems(response.data.data.items);
    } catch {
      showNotification("error", "Failed to load template");
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async () => {
    try {
      setLoading(true);
      await invoiceProcessorApi.updateTemplate(templateItems);
    } catch {
      showNotification("error", "Failed to save template");
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
