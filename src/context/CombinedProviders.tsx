import { ReactNode } from "react";
import { DocumentProcessorProvider } from "../pages/app/context/DocumentProcessorContext";
import { ApplicationProvider } from "./ApplicationContext";
import { TemplateProvider } from "../pages/app/context/TemplateContext";
import { PermissionProvider } from "../pages/app/context/PermissionContext";

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
