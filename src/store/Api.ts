import { namespace } from 'vuex-class/lib';
import axios, { AxiosInstance, AxiosPromise, AxiosResponse } from 'axios';
import { store } from './index';

console.log(store)

export const API_URL = process.env.API_URL;

// const userState = store.state['LoginModule']

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  transformResponse(response) {
    console.log(JSON.parse(response));
    return JSON.parse(response);
  }
});

const headers = () => {
  let authToken: any = "";
  // if (userState.isLoggedIn) {
  //   authToken = {
  //     "Authorization": `Bearer ${userState.userToken}`
  //   }
  // }
  return authToken;
}

namespace ApiTool {
  export async function post(path: string, payload: any) {
    let response: AxiosResponse = await axiosInstance.post(path, payload, {
      headers: headers()
    })
    return response.data;
  }
  export async function get(path: string, payload?: any) {
    let response: AxiosResponse = await axiosInstance.get(path, {
      params: payload,
      headers: headers()
    });
    return response.data;
  }
  export async function put(path: string, payload: any) {
    let response: AxiosResponse = await axiosInstance.put(path, payload, {
      headers: headers()
    });
    return response.data;
  }
  export async function Delete(path: string, payload: any) {
    let response: AxiosResponse = await axiosInstance.delete(path, {
      params: payload,
      headers: headers()
    });
    return response.data;
  }
}
export default ApiTool;