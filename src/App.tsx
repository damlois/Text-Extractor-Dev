import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import ApplicationList from "./pages/home/ApplicationList";
import InvoiceAppTabSelector from "./apps/invoiceApp/pages/InvoiceAppTabSelector";
import ConfigureDataSource from "./apps/invoiceApp/pages/configureDataSource";
import ExtractionHistory from "./apps/invoiceApp/pages/extractionHistory";
import SavedInsights from "./apps/invoiceApp/pages/savedInsights";
import CreateDataSource from "./apps/invoiceApp/pages/configureDataSource/CreateDataSource";
import ConnectEmail from "./apps/invoiceApp/pages/configureDataSource/ConnectEmail";
import SetupLabel from "./apps/invoiceApp/pages/configureDataSource/SetUpLabel";
import GenerateInsights from "./apps/invoiceApp/pages/extractionHistory/GenerateInsights";
import CreateAccount from "./pages/createAccount";
import { CombinedProviders } from "./context/CombinedProviders";
import LandingPage from "./pages/landingPage";
import SetUpEmailServer from "./pages/createAccount/SetUpEmailServer";

const App = () => {
  return (
    <CombinedProviders>
      <Router>
        <Routes>
          {/* <Route path="/sign-in" element={<LandingPage />} /> */}
          <Route path="/" element={<CreateAccount />} />
          <Route path="/configure-email" element={<SetUpEmailServer />} />
          <Route element={<PageLayout />}>
            <Route path="/home" element={<ApplicationList />} />

            <Route
              path="/invoice-processing"
              element={<InvoiceAppTabSelector />}
            >
              <Route path="data-source" element={<ConfigureDataSource />} />
              <Route path="data-source/create" element={<CreateDataSource />} />
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
        </Routes>
      </Router>
    </CombinedProviders>
  );
};

export default App;
