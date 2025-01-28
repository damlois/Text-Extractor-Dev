import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import keycloakService from "../../service/keycloakService";

const LandingPage = () => {
  const navigate = useNavigate();
  const [showDisplayMsg, setShowDisplayMsg] = useState(false);
  const redirectUrl = process.env.REACT_APP_REDIRECT_URL;

  useEffect(() => {
    if (keycloakService) {
      if (keycloakService.isLoggedIn()) {
        if (keycloakService.hasRole(["ADMIN"])) {
          navigate("/home");
        } else {
          setShowDisplayMsg(true);
        }
      } else {
        keycloakService.doLogin({ redirectUri: redirectUrl });
      }
    }
  }, []);

  return (
    <div>
      {showDisplayMsg &&
        "User Doesn't have role or user's role not yet handled."}
    </div>
  );
};

export default LandingPage;
