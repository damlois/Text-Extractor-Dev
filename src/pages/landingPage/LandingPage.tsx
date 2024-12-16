import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import KeycloakService from '../../service/keycloakService';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showDisplayMsg, setShowDisplayMsg] = useState(false);
  const redirectUrl = process.env.REACT_APP_REDIRECT_URL  
  
  useEffect(() => {
    if (KeycloakService) {
      if (KeycloakService.isLoggedIn()) {
        if (KeycloakService.hasRole(['ADMIN'])) {
          navigate('/home');
        } else {
          setShowDisplayMsg(true);
        }
      } else {
        KeycloakService.doLogin({ redirectUri: redirectUrl });
      }

    }
}, []);

  return <div>{showDisplayMsg && "User Doesn't have role or user's role not yet handled."}</div>;
  
}

export default LandingPage;