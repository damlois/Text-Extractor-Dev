import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import PageLayout from "./components/PageLayout";
import CreateProject from "./pages/home/createProject";
import UploadFiles from "./pages/home/uplaodFiles";
import ProcessFiles from "./pages/home/processFiles";

const routes = [
  // { path: "/index", element: <LandingPage />, showLayout: true },
  { path: "/", element: <CreateProject />, showLayout: true },
  { path: "/upload-files", element: <UploadFiles />, showLayout: true },
  { path: "/process-files", element: <ProcessFiles />, showLayout: true },
];

const App = () => {
  return (
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
  );
};

export default App;
