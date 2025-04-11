import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import ApplicationList from "./pages/home/ApplicationList";
import InvoiceAppTabSelector from "./apps/invoiceApp/pages/application/InvoiceAppTabSelector";
import ConfigureDataSource from "./apps/invoiceApp/pages/application/configureDataSource";
import ExtractionHistory from "./apps/invoiceApp/pages/application/extractionHistory";
import SavedInsights from "./apps/invoiceApp/pages/application/savedInsights";
import CreateDataSource from "./apps/invoiceApp/pages/application/configureDataSource/CreateDataSource";
import ConnectEmail from "./apps/invoiceApp/pages/application/configureDataSource/ConnectEmail";
import SetupLabel from "./apps/invoiceApp/pages/application/configureDataSource/SetUpLabel";
import GenerateInsights from "./apps/invoiceApp/pages/application/extractionHistory/GenerateInsights";
import { CombinedProviders } from "./context/CombinedProviders";
import LandingPage from "./pages/landingPage";
import SetPassword from "./pages/createAccount/SetPassword";
import UsersList from "./apps/invoiceApp/pages/users";
import RouteProtector from "./components/RouteProtector";
import RolesList from "./apps/invoiceApp/pages/roles";
import ViewDuplicates from "./apps/invoiceApp/pages/application/extractionHistory/components/duplicates/ViewDuplicates";
import { PERMISSIONS } from "./apps/invoiceApp/constants";
import ForbiddenPage from "./apps/invoiceApp/pages/ForbiddenPage";

const App = () => {
  return (
    <CombinedProviders>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create-account" element={<SetPassword />} />

          <Route element={<PageLayout />}>
            <Route path="/home" element={<RouteProtector />}>
              <Route index element={<ApplicationList />} />
            </Route>

            <Route
              path="/users"
              element={
                <RouteProtector requiredPermission={PERMISSIONS.VIEW_USER} />
              }
            >
              <Route index element={<UsersList />} />
            </Route>

            <Route
              path="/roles"
              element={
                <RouteProtector requiredPermission={PERMISSIONS.VIEW_ROLE} />
              }
            >
              <Route index element={<RolesList />} />
            </Route>

            <Route
              path="/home/invoice-processing"
              element={<InvoiceAppTabSelector />}
            >
              <Route
                path="data-source"
                element={
                  <RouteProtector
                    requiredPermission={PERMISSIONS.VIEW_DATASOURCE}
                  />
                }
              >
                <Route index element={<ConfigureDataSource />} />
              </Route>

              <Route
                path="data-source/create"
                element={
                  <RouteProtector
                    requiredPermission={PERMISSIONS.ADD_DATASOURCE}
                  />
                }
              >
                <Route index element={<CreateDataSource />} />
              </Route>

              <Route
                path="data-source/connect-email"
                element={
                  <RouteProtector
                    requiredPermission={PERMISSIONS.ADD_DATASOURCE}
                  />
                }
              >
                <Route index element={<ConnectEmail />} />
              </Route>

              <Route
                path="data-source/field-extraction-setup"
                element={<RouteProtector />}
              >
                <Route index element={<SetupLabel />} />
              </Route>

              <Route
                path="extraction-history"
                element={
                  <RouteProtector
                    requiredPermission={PERMISSIONS.VIEW_EXTRACTION_HISTORY}
                  />
                }
              >
                <Route index element={<ExtractionHistory />} />
              </Route>

              <Route
                path="extraction-history/duplicates"
                element={
                  <RouteProtector
                    requiredPermission={PERMISSIONS.VIEW_DUPLICATE}
                  />
                }
              >
                <Route index element={<ViewDuplicates />} />
              </Route>

              <Route
                path="extraction-history/generate-insights"
                element={
                  <RouteProtector
                    requiredPermission={PERMISSIONS.GENERATE_INSIGHT}
                  />
                }
              >
                <Route index element={<GenerateInsights />} />
              </Route>

              <Route
                path="saved-insights"
                element={
                  <RouteProtector
                    requiredPermission={PERMISSIONS.VIEW_INSIGHTS}
                  />
                }
              >
                <Route index element={<SavedInsights />} />
              </Route>
            </Route>
          </Route>

          <Route path="/403" element={<ForbiddenPage />} />
        </Routes>
      </Router>
    </CombinedProviders>
  );
};

export default App;
