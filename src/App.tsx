import { FileProcessorProvider } from "./context/FileProcessorContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import { ImageProcessorProvider } from "./context/ImageProcessorContext";
import ApplicationList from "./pages/home/applicationList/ApplicationList";
import InvoiceAppTabSelector from "./apps/invoiceProcessing/InvoiceAppTabSelector";
import ConfigureDataSource from "./apps/invoiceProcessing/configureDataSource";
import ExtractionHistory from "./apps/invoiceProcessing/extractionHistory";
import SavedInsights from "./apps/invoiceProcessing/savedInsights";
import CreateDataSource from "./apps/invoiceProcessing/configureDataSource/CreateDataSource";
import LandingPage from "./pages/landingPage";

const App = () => {
  return (
    <FileProcessorProvider>
      <ImageProcessorProvider>
        <div className="flex flex-col items-center justify-center w-full min-h-screen m-0 p-0">
          <Router>
            <PageLayout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<ApplicationList />} />
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
                    path="extraction-history"
                    element={<ExtractionHistory />}
                  />
                  <Route path="saved-insights" element={<SavedInsights />} />
                </Route>
              </Routes>
            </PageLayout>
          </Router>
        </div>
      </ImageProcessorProvider>
    </FileProcessorProvider>
  );
};

export default App;
