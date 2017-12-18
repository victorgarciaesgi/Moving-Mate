import axios, { AxiosInstance, AxiosPromise, AxiosResponse } from 'axios';
import { state } from './LoginStore';

export const API_URL = process.env.API_URL;

const axios_instance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const headers = () => {
  let authToken: any = "";
  if (state.isLoggedIn) {
    authToken = {
      "Authorization": `Bearer ${state.userToken}`
    }
  }
  return authToken;
}

const api_tool = {
  async post(path: string, payload: any) {
    let response: AxiosResponse = await axios_instance.post(path, payload, {
      headers: headers()
    });
    return response.data;
  },
  async get(path: string, payload: any) {
    let response: AxiosResponse = await axios_instance.get(path, {
      params: payload,
      headers: headers()
    });
    return response.data;
  },
  async put(path: string, payload: any) {
    let response: AxiosResponse = await axios_instance.put(path, payload, {
      headers: headers()
    });
    return response.data;
  },
  async delete(path: string, payload: any) {
    let response: AxiosResponse = await axios_instance.delete(path, {
      params: payload,
      headers: headers()
    });
    return response.data;
  },
}
export default api_tool;