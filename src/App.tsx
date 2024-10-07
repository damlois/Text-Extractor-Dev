import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import PageLayout from "./components/PageLayout";

const routes = [{ path: "/", element: <LandingPage />, showNavBar: true }];

const App = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen m-0 p-0">
      <Router>
        <Routes>
          {routes.map(({ path, element, showNavBar }) => (
            <Route
              key={path}
              path={path}
              element={
                <PageLayout showNavBar={showNavBar}>{element}</PageLayout>
              }
            />
          ))}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
