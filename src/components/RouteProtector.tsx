import { Navigate, Outlet } from "react-router-dom";
import keycloakService from "../service/keycloakService";

const RouteProtector = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  if (!keycloakService.isLoggedIn()) {
    return <Navigate to="/" replace />; // Redirect to LandingPage
  }

  if (allowedRoles && !keycloakService.hasRole(allowedRoles)) {
    return <Navigate to="/" replace />; // Redirect if user lacks permissions
  }

  return <Outlet />;
};

export default RouteProtector;
