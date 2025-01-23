import { FileProcessorProvider } from "./FileProcessorContext";
import { ImageProcessorProvider } from "./ImageProcessorContext";
import { InvoiceProcessorProvider } from "./InvoiceProcessorContext";

export const CombinedProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <FileProcessorProvider>
      <InvoiceProcessorProvider>
        <ImageProcessorProvider>{children}</ImageProcessorProvider>
      </InvoiceProcessorProvider>
    </FileProcessorProvider>
  );
};
