import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import keycloakService from "../../service/keycloakService";
import { invoiceProcessorApi } from "../../api/invoice-api";
import { showNotification } from "../../utils/notification";
import { Spin } from "antd";

const LandingPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminThenAuth = async () => {
      try {
        const response = await invoiceProcessorApi.checkOrgHasAdmin();
        const hasAdmin = response.data.data;

        if (!hasAdmin) {
          navigate("/create-account", { state: { fromLandingPage: true } });
        } else {
          keycloakService.initKeycloak(() => {
            navigate("/home");
          });
        }
      } catch (e) {
        showNotification(
          "error",
          "Something went wrong. Please check your internet connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    checkAdminThenAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return null;
};

export default LandingPage;
