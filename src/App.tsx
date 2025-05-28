import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import PageLayout from "./components/PageLayout";
import ApplicationList from "./pages/home/ApplicationList";
import InvoiceAppTabSelector from "./pages/app/TabSelector";
import ConfigureDataSource from "./pages/app/configureDataSource";
import ExtractionHistory from "./pages/app/extractionHistory";
import SavedInsights from "./pages/app/savedInsights";
import CreateDataSource from "./pages/app/configureDataSource/CreateDataSource";
import ConnectEmail from "./pages/app/configureDataSource/ConnectEmail";
import SetupLabel from "./pages/app/configureDataSource/SetUpLabel";
import GenerateInsights from "./pages/app/extractionHistory/GenerateInsights";
import { CombinedProviders } from "./context/CombinedProviders";
import LandingPage from "./pages/landingPage";
import SetPassword from "./pages/createAccount/SetPassword";
import UsersList from "./pages/users";
import RolesList from "./pages/roles";
import ViewDuplicates from "./pages/app/extractionHistory/components/duplicates/ViewDuplicates";
import { PERMISSIONS } from "./constants/permissions";
import ForbiddenPage from "./pages/ForbiddenPage";
import ReviewExtractedContent from "./pages/app/extractionHistory/components/reviewExtraction";
import RouteProtector from "./components/RouteProtector";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<LandingPage />} />
      <Route path="/create-account" element={<SetPassword />} />

      <Route element={<PageLayout />}>
        <Route
          path="/home"
          element={
            <RouteProtector>
              <ApplicationList />
            </RouteProtector>
          }
        />

        <Route
          path="/users"
          element={
            <RouteProtector requiredPermission={PERMISSIONS.VIEW_USER}>
              <UsersList />
            </RouteProtector>
          }
        />

        <Route
          path="/roles"
          element={
            <RouteProtector requiredPermission={PERMISSIONS.VIEW_ROLE}>
              <RolesList />
            </RouteProtector>
          }
        />

        <Route path="/home/document-processing" element={<InvoiceAppTabSelector />}>
          <Route
            path="data-source"
            element={
              <RouteProtector requiredPermission={PERMISSIONS.VIEW_DATASOURCE}>
                <ConfigureDataSource />
              </RouteProtector>
            }
          />
          <Route
            path="data-source/create"
            element={
              <RouteProtector requiredPermission={PERMISSIONS.ADD_DATASOURCE}>
                <CreateDataSource />
              </RouteProtector>
            }
          />
          <Route
            path="data-source/connect-email"
            element={
              <RouteProtector requiredPermission={PERMISSIONS.ADD_DATASOURCE}>
                <ConnectEmail />
              </RouteProtector>
            }
          />
          <Route
            path="data-source/field-extraction-setup"
            element={<RouteProtector>
              <SetupLabel />
            </RouteProtector>}
          />
          <Route
            path="extraction-history"
            element={
              <RouteProtector requiredPermission={PERMISSIONS.VIEW_EXTRACTION_HISTORY}>
                <ExtractionHistory />
              </RouteProtector>
            }
          />
          <Route
            path="extraction-history/duplicates"
            element={
              <RouteProtector requiredPermission={PERMISSIONS.VIEW_DUPLICATE}>
                <ViewDuplicates />
              </RouteProtector>
            }
          />
          <Route
            path="extraction-history/generate-insights"
            element={
              <RouteProtector requiredPermission={PERMISSIONS.GENERATE_INSIGHT}>
                <GenerateInsights />
              </RouteProtector>
            }
          />
           <Route
            path="extraction-history/review"
            element={
              <RouteProtector requiredPermission={PERMISSIONS.EDIT_EXTRACTION}>
                <ReviewExtractedContent />
              </RouteProtector>
            }
          />
          <Route
            path="saved-insights"
            element={
              <RouteProtector requiredPermission={PERMISSIONS.VIEW_INSIGHTS}>
                <SavedInsights />
              </RouteProtector>
            }
          />
        </Route>
      </Route>
      <Route path="/403" element={<ForbiddenPage />} />
    </Route>
  )
);

const App = () => {
  return (
    <CombinedProviders>
      <RouterProvider router={router} />
    </CombinedProviders>
  );
};

export default App;
