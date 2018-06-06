import axios, { AxiosInstance, AxiosPromise, AxiosResponse, AxiosInterceptorManager } from 'axios';
import LoginModule from '../Modules/Auth/LoginStore';
import router from '@src/router';
import {clone} from 'lodash';
import * as Types from './ApiTypes';

const API_URL = process.env.API_URL;
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(response)
    return response
  },
  (error) => {
    console.log(error.response.status)
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

async function Request(type: string, path: string, payload: any, noAuth?: boolean): Promise<Types.AxiosSuccess | Types.AxiosError> {
  try {
    console.log(`Axios Request [${type}]:`, axiosInstance.defaults);
    if (type === 'post' || type === 'put') {
      let response: AxiosResponse = await axiosInstance[type](path, payload, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      console.log(new Types.AxiosSuccess(response.data));
      return new Types.AxiosSuccess(response.data);
    } else if (type === 'get' || type === 'delete') {
      let response: AxiosResponse = await axiosInstance[type](path, {
        params: payload,
        headers: {"Content-Type": "application/json"}
      })
      return new Types.AxiosSuccess(response.data);
    } else if (type == 'postFormData') {
      console.log('ok')
      let response: AxiosResponse = await axiosInstance.post(path, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return new Types.AxiosSuccess(response.data);
    }
  }
  catch (error) {
    if (error.response) {
      return Promise.reject(new Types.AxiosError(error.response.status, error.response.data));
    } else {
      return Promise.reject(new Types.AxiosError(0));
    }
  }
}

export default Request;