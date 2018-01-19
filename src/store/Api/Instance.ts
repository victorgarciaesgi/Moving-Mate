import axios, { AxiosInstance, AxiosPromise, AxiosResponse, AxiosInterceptorManager } from 'axios';
import LoginModule from '../Modules/LoginStore';
import router from '@src/router'
import * as Types from './ApiTypes';

const API_URL = process.env.API_URL;

axios.interceptors.response.use(
  (response) => {
    console.log(response)
    return response 
  },
  (error) => {
    return Promise.reject(error)
})


const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

const headers = () => {
  let authToken: any = "";
  const userState = LoginModule.state;
  if (userState.isLoggedIn) {
    authToken = { "Authorization": `Bearer ${userState.userToken}`}
  }
  return authToken;
}

async function Request(type: string, path: string, payload: any): Promise<Types.AxiosSuccess | Types.AxiosError> {
  try {
    if (type === 'post'||'put') {
      let response: AxiosResponse = await axiosInstance[type](path, payload, {
        headers: headers()
      })
      console.log(new Types.AxiosSuccess(response.data))
      return new Types.AxiosSuccess(response.data);
    } else {
      let response: AxiosResponse = await axiosInstance[type](path, {
        params: payload,
        headers: headers()
      })
      return new Types.AxiosSuccess(response.data);;
    }
  } 
  catch(error) {
    if (error.response) {
      return new Types.AxiosError(error.response.status);
    } else {
      return new Types.AxiosError(0);
    }
  }
}

export default Request;