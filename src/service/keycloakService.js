import Keycloak from "keycloak-js";
const _kc = new Keycloak('/keycloak.dev.json');


/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback) => {
  _kc.init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    pkceMethod: 'S256',
  })
    .then((authenticated) => {
      if (authenticated) {
      onAuthenticatedCallback();
      scheduleTokenRefresh();
      } else {
        doLogin();
      }
    })
};

const doLogin = _kc.login;

const doLogout = _kc.logout;

const getToken = () => _kc.token;

const isLoggedIn = () => !!_kc.token;

const updateToken = (successCallback) =>
  _kc.updateToken(30)
    .then(successCallback)
    .catch(doLogin);

const getUsername = () => _kc.tokenParsed?.preferred_username;

const getFullName = () => _kc.tokenParsed?.name;

const hasRole = (roles) => roles.some((role) => _kc.hasRealmRole(role));

const userAccount = _kc.accountManagement;


const scheduleTokenRefresh = () => {
  setInterval(() => {
    updateToken((refreshed) => {
      if (refreshed) {
        console.log('Token refreshed successfully');
      } else {
        console.warn('Token is still valid');
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
  hasRole,
};

export default keycloakService;