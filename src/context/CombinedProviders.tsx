import { ReactNode } from "react";
import { InvoiceProcessorProvider } from "../apps/invoiceApp/context/InvoiceProcessorContext";
import { FileProcessorProvider } from "./FileProcessorContext";
import { TemplateProvider } from "../apps/invoiceApp/context/TemplateContext";

export const CombinedProviders = ({ children }: { children: ReactNode }) => {
  return (
    <InvoiceProcessorProvider>
      <FileProcessorProvider>
        <TemplateProvider>{children}</TemplateProvider>
      </FileProcessorProvider>
    </InvoiceProcessorProvider>
  );
};
