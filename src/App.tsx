import { FileProcessorProvider } from './context/FileProcessorContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import CreateProject from "./pages/home/createProject/CreateProject";
import UploadFiles from "./pages/home/uplaodFiles/UploadFiles";
import ProcessFiles from "./pages/home/processFiles/ProcessFiles";
import LandingPage from './pages/landingPage';
import ProjectList from './pages/home/projectList/ProjectList';

const routes = [
  { path: "/", element: <LandingPage />, showLayout: false },
  { path: "/home", element: <ProjectList />, showLayout: true },
  { path: "/home/create-project", element: <CreateProject />, showLayout: true },
  { path: "/home/upload-files", element: <UploadFiles />, showLayout: true },
  { path: "/home/process-files", element: <ProcessFiles />, showLayout: true },
];

const App = () => {
  return (
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
  );
};

export default App;
