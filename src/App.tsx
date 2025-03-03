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

const App = () => {
  return (
    <CombinedProviders>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create-account" element={<SetPassword />} />
          <Route element={<RouteProtector />}>
            <Route element={<PageLayout />}>
              <Route path="/home" element={<ApplicationList />} />
              <Route path="/users" element={<UsersList />} />
              <Route
                path="/invoice-processing"
                element={<InvoiceAppTabSelector />}
              >
                <Route path="data-source" element={<ConfigureDataSource />} />
                <Route
                  path="data-source/create"
                  element={<CreateDataSource />}
                />
                <Route
                  path="data-source/connect-email"
                  element={<ConnectEmail />}
                />
                <Route
                  path="data-source/field-extraction-setup"
                  element={<SetupLabel />}
                />
                <Route
                  path="extraction-history"
                  element={<ExtractionHistory />}
                />
                <Route
                  path="extraction-history/generate-insights"
                  element={<GenerateInsights />}
                />
                <Route path="saved-insights" element={<SavedInsights />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </CombinedProviders>
  );
};

export default App;
