import axios from 'axios';
import keycloakService from './keycloakService';

const HttpMethods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
}

const _axios = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});


const configure = () => {
  _axios.interceptors.request.use((config) => {
    const cb = () => {
      console.log(keycloakService.getToken(), 'token');
      
      config.headers.Authorization = `Bearer ${keycloakService.getToken()}`;
      return Promise.resolve(config);
    }
    return keycloakService.updateToken(cb);
  });
}

const getAxiosClient = () => _axios;

const HttpService = {   
  HttpMethods,
  configure,
  getAxiosClient,
}
export default HttpService;