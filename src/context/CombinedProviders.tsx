import { ReactNode } from "react";
import { DocumentProcessorProvider } from "./DocumentProcessorContext";
import { ApplicationProvider } from "./ApplicationContext";
import { TemplateProvider } from "./TemplateContext";
import { PermissionProvider } from "./PermissionContext";

export const CombinedProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ApplicationProvider>
      <DocumentProcessorProvider>
        <PermissionProvider>
          <TemplateProvider>{children}</TemplateProvider>
        </PermissionProvider>
      </DocumentProcessorProvider>
    </ApplicationProvider>
  );
};
