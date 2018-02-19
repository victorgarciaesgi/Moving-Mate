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
  }
)


const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

export const addAuthHeaders = () => {
  axiosInstance.defaults.headers.Authorization = `Bearer ${LoginModule.state.userInfos.userToken}`;
};

export const removeAuthHeaders = () => {
  delete axiosInstance.defaults.headers.Authorization;
  console.log(axiosInstance.defaults);
};

async function Request(type: string, path: string, payload: any): Promise<Types.AxiosSuccess | Types.AxiosError> {
  try {
    console.log(axiosInstance.defaults)
    if (type === 'post' || 'put') {
      let response: AxiosResponse = await axiosInstance[type](path, payload)
      console.log(new Types.AxiosSuccess(response.data))
      return new Types.AxiosSuccess(response.data);
    } else {
      let response: AxiosResponse = await axiosInstance[type](path, {
        params: payload,
      })
      return new Types.AxiosSuccess(response.data);;
    }
  }
  catch (error) {
    if (error.response) {
      return new Types.AxiosError(error.response.status);
    } else {
      return new Types.AxiosError(0);
    }
  }
}

export default Request;