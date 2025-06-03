import Keycloak from "keycloak-js";

const getKeycloakConfig = () => {
  return {
    url: process.env.REACT_APP_KEYCLOAK_AUTH_URL,
    realm: process.env.REACT_APP_KEYCLOAK_REALM,
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
    'ssl-required': 'external',
    'public-client': true,
    'confidential-port': 0
  };
};

const _kc = new Keycloak(getKeycloakConfig());

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback) => {
  _kc
    .init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
      pkceMethod: "S256",
      checkLoginIframe: false, 
      enableLogging: false 
    })
    .then((authenticated) => {
      if (authenticated) {
        onAuthenticatedCallback();
        scheduleTokenRefresh();

        // Clean URL hash (prevents blinking effect)
        if (
          window.location.hash.includes("code=") ||
          window.location.hash.includes("session_state=")
        ) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      } else {
        if (!_kc.authenticated) {
          doLogin();
        }
      }
    })
    .catch((error) => {
      console.error('Keycloak initialization error:', error);
    });
};

const doLogin = _kc.login;

const doLogout = _kc.logout;

const getToken = () => _kc.token;

const isLoggedIn = () => !!_kc.token;

const updateToken = (successCallback) =>
  _kc.updateToken(30).then(successCallback).catch(doLogin);

const getUsername = () => _kc.tokenParsed?.preferred_username;

const getFullName = () => _kc.tokenParsed?.name;

const getUserId = () => _kc.tokenParsed?.sub;

const hasRole = (roles) => roles.some((role) => _kc.hasRealmRole(role));

const userAccount = _kc.accountManagement;

const scheduleTokenRefresh = () => {
  setInterval(() => {
    updateToken((refreshed) => {
      if (refreshed) {
        console.log("Token refreshed successfully");
      } else {
        console.warn("Token is still valid");
      }
    });
  }, 60000);
};

const keycloakService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  getUsername,
  getFullName,
  getUserId,
  hasRole,
};

export default keycloakService;
