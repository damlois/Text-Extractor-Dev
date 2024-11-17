import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FileProcessorProvider } from './context/FileProcessorContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import PageLayout from "./components/PageLayout";
import CreateProject from "./pages/home/createProject/CreateProject";
import UploadFiles from "./pages/home/uplaodFiles/UploadFiles";
import ProcessFiles from "./pages/home/processFiles/ProcessFiles";

const queryClient = new QueryClient();

const routes = [
  // { path: "/index", element: <LandingPage />, showLayout: true },
  { path: "/", element: <CreateProject />, showLayout: true },
  { path: "/upload-files", element: <UploadFiles />, showLayout: true },
  { path: "/process-files", element: <ProcessFiles />, showLayout: true },
];

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <FileProcessorProvider>
        <div className="flex flex-col items-center justify-center w-full min-h-screen m-0 p-0">
          <Router>
            <Routes>
              {routes.map(({ path, element, showLayout }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <PageLayout showLayout={showLayout}>{element}</PageLayout>
                  }
                />
              ))}
            </Routes>
          </Router>
        </div>
      </FileProcessorProvider>
    </QueryClientProvider>
  );
};

export default App;
