import { PERMISSIONS } from "../pages/app/constants/permissions";
import { usePermission } from "../pages/app/context/PermissionContext";

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
                path: "/home/document-processing/data-source",
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
                    path: "/home/document-processing/data-source",
                  },
                  {
                    label: "Extraction History",
                    path: "/home/document-processing/extraction-history",
                  },
                  { label: "Duplicate Invoices" },
                ],
              },
              {
                key: "review",
                hideTabAndTitle: true,
                breadcrumbs: [
                  {
                    label: "Extraction History",
                    path: "/home/document-processing/extraction-history",
                  },
                  { label: "Review Content" },
                ],
              },
              {
                key: "generate-insights",
                label: "Preview of Selected Extraction",
                breadcrumbs: [
                  { label: "Home", path: "/home" },
                  {
                    label: "Invoice Processing",
                    path: "/home/document-processing/data-source",
                  },
                  {
                    label: "Extraction History",
                    path: "/home/document-processing/extraction-history",
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
                path: "/home/document-processing/data-source",
              },
              { label: "Saved Insights" },
            ],
          },
        ]
      : []),
  ];

  return routeConfig;
};
