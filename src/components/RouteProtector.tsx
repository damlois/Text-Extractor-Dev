import { Navigate, Outlet } from "react-router-dom";
import keycloakService from "../service/keycloakService";
import { useState, useEffect } from "react";
import { Spin } from "antd";

const RouteProtector = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    keycloakService.initKeycloak(() => {
      setIsAuthenticated(keycloakService.isLoggedIn());
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !keycloakService.hasRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RouteProtector;
