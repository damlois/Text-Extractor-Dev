import { ReactNode } from "react";
import { InvoiceProcessorProvider } from "../apps/invoiceApp/context/InvoiceProcessorContext";
import { FileProcessorProvider } from "./FileProcessorContext";
import { TemplateProvider } from "../apps/invoiceApp/context/TemplateContext";
import { PermissionProvider } from "../apps/invoiceApp/context/PermissionContext";

export const CombinedProviders = ({ children }: { children: ReactNode }) => {
  return (
    <InvoiceProcessorProvider>
      <FileProcessorProvider>
        <PermissionProvider>
          <TemplateProvider>{children}</TemplateProvider>
        </PermissionProvider>
      </FileProcessorProvider>
    </InvoiceProcessorProvider>
  );
};
