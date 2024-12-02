import Keycloak from 'keycloak-js';

const kc = new Keycloak('/keycloak.dev.json');

const initkeycloak = (onAuthenticatedCallback) => {
  kc.init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    pkceMethod: 'S256',
  }).then ((auth) => {
    if (!auth) {
      kc.login(); 
      console.log('user not authenticated');
    }
    console.log('user is what!');
    
    onAuthenticatedCallback();


    setInterval(() => {
      kc.updateToken(30).then((refreshed) => {
        if (refreshed) {
          console.log('Token refreshed', new Date());
        }
      }).catch(() => {
        console.error('Failed to refresh token');
        kc.logout();
      });
    }, 60000);
  }).catch((error) => console.error(error));
}

console.log(kc);


const doLogin = kc.login;

const doRegister = kc.register;

const userAccount = kc.accountManagement;

const doLogout = kc.logout;

const getToken = () => kc.token;

const isLoggedIn = () => !!kc.token;

const updateToken = kc.updateToken;

const isTokenExpired = kc.isTokenExpired;

const getUser = () => kc.tokenParsed?.preferred_username;

const getUserAttr = () => kc.tokenParsed;

const getUserName = () => kc.tokenParsed?.given_name;

const hasRole = (roles) => roles.some((role) => kc.hasRealmRole(role));

const keycloakService = {
  initkeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  getUserAttr,
  getUser,
  getUserName,
  hasRole,
  doRegister,
  userAccount,
  isTokenExpired,
};

export default keycloakService;
