import { Navigate, Outlet } from "react-router-dom";
import keycloakService from "../service/keycloakService";
import { useState, useEffect } from "react";
import { Spin } from "antd";
import { usePermission } from "../apps/invoiceApp/context/PermissionContext";

const RouteProtector = ({
  requiredPermission,
}: {
  requiredPermission?: string;
}) => {
  const [authCheckDone, setAuthCheckDone] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { loadingUserPermissions, userHasPermission } = usePermission();
  const hasPermission = userHasPermission(requiredPermission || "");

  useEffect(() => {
    keycloakService.initKeycloak(() => {
      setIsAuthenticated(keycloakService.isLoggedIn());
      setAuthCheckDone(true);
    });
  }, []);

  if (!authCheckDone || loadingUserPermissions) {
    return (
      <div className="flex w-full mt-20 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredPermission && !hasPermission) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default RouteProtector;
