import { PERMISSIONS } from "../apps/invoiceApp/constants";
import { usePermission } from "../apps/invoiceApp/context/PermissionContext";

export const useRouteConfig = () => {
  const { userHasPermission } = usePermission();

  const routeConfig = [
    ...(userHasPermission(PERMISSIONS.VIEW_DATASOURCE)
      ? [
          {
            key: "data-source",
            label: "Data Source Configuration",
            breadcrumbs: [
              { label: "Home", path: "/home" },
              { label: "Data Source Configuration" },
            ],
            nestedRoutes: [
              {
                key: "create",
                label: "Data Source Configuration",
                breadcrumbs: [
                  { label: "Home", path: "/home" },
                  { label: "Data Source Configuration" },
                ],
              },
              {
                key: "connect-email",
                label: "Email Data Source Configuration",
                breadcrumbs: [
                  { label: "Home", path: "/home" },
                  { label: "Data Source Configuration" },
                ],
              },
              {
                key: "field-extraction-setup",
                label: "Email Data Source Configuration",
                breadcrumbs: [
                  { label: "Home", path: "/home" },
                  { label: "Data Source Configuration" },
                ],
              },
            ],
          },
        ]
      : []),
    ...(userHasPermission(PERMISSIONS.VIEW_EXTRACTION_HISTORY)
      ? [
          {
            key: "extraction-history",
            label: "Extraction History",
            breadcrumbs: [
              { label: "Home", path: "/home" },
              {
                label: "Invoice Processing",
                path: "/home/invoice-processing/data-source",
              },
              { label: "Extraction History" },
            ],
            nestedRoutes: [
              {
                key: "duplicates",
                label: "Duplicate Invoices",
                breadcrumbs: [
                  { label: "Home", path: "/home" },
                  {
                    label: "Invoice Processing",
                    path: "/home/invoice-processing/data-source",
                  },
                  {
                    label: "Extraction History",
                    path: "/home/invoice-processing/extraction-history",
                  },
                  { label: "Duplicate Invoices" },
                ],
              },
              {
                key: "generate-insights",
                label: "Preview of Selected Extraction",
                breadcrumbs: [
                  { label: "Home", path: "/home" },
                  {
                    label: "Invoice Processing",
                    path: "/home/invoice-processing/data-source",
                  },
                  {
                    label: "Extraction History",
                    path: "/home/invoice-processing/extraction-history",
                  },
                  { label: "Preview & Generate Insight" },
                ],
              },
            ],
          },
        ]
      : []),
    ...(userHasPermission(PERMISSIONS.VIEW_INSIGHTS)
      ? [
          {
            key: "saved-insights",
            label: "Saved Insights",
            breadcrumbs: [
              { label: "Home", path: "/home" },
              {
                label: "Invoice Processing",
                path: "/home/invoice-processing/data-source",
              },
              { label: "Saved Insights" },
            ],
          },
        ]
      : []),
  ];

  return routeConfig;
};
