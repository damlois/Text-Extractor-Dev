import { ReactNode } from "react";
import { InvoiceProcessorProvider } from "./InvoiceProcessorContext";
import { FileProcessorProvider } from "./FileProcessorContext";
import { ImageProcessorProvider } from "./ImageProcessorContext";
import { TemplateProvider } from "./TemplateContext";

export const CombinedProviders = ({ children }: { children: ReactNode }) => {
  return (
    <InvoiceProcessorProvider>
      <FileProcessorProvider>
        <ImageProcessorProvider>
          <TemplateProvider>{children}</TemplateProvider>
        </ImageProcessorProvider>
      </FileProcessorProvider>
    </InvoiceProcessorProvider>
  );
};
