import axios, { AxiosInstance, AxiosPromise, AxiosResponse, AxiosInterceptorManager } from 'axios';
import LoginModule from '../Modules/LoginStore';
import router from '@src/router'
import * as Types from './ApiTypes';

const API_URL = process.env.API_URL;
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(response)
    return response
  },
  (error) => {
    console.log('Request Error: ', error.response);
    return Promise.reject(error)
  }
)

export const addAuthHeaders = () => {
  axiosInstance.defaults.headers.Authorization = `Bearer ${LoginModule.state.userInfos.userToken}`;
};

export const removeAuthHeaders = () => {
  delete axiosInstance.defaults.headers.Authorization;
};

async function Request(type: string, path: string, payload: any): Promise<Types.AxiosSuccess | Types.AxiosError> {
  try {
    console.log('Axios Headers:', axiosInstance.defaults, type)
    if (type === 'post' || type === 'put') {
      let response: AxiosResponse = await axiosInstance[type](path, payload)
      console.log(new Types.AxiosSuccess(response.data))
      return new Types.AxiosSuccess(response.data);
    } else {
      let response: AxiosResponse = await axiosInstance[type](path, {
        params: payload,
      })
      return new Types.AxiosSuccess(response.data);
    }
  }
  catch (error) {
    if (error.response) {
      let message = error.response.data.message || error.response.data.error.message;
      return Promise.reject(new Types.AxiosError(error.response.status, message));
    } else {
      return Promise.reject(new Types.AxiosError(0));
    }
  }
}

export default Request;