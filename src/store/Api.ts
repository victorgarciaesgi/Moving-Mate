import axios, { AxiosInstance, AxiosPromise, AxiosResponse } from 'axios';

const API_URL = 'http://localhost:8000';

const axios_instance: AxiosInstance = axios.create({
  baseURL: API_URL,
  transformRequest: [
    (data) => {
      try {
        return JSON.stringify(data.data)
      } catch (error) {
        console.log('No data returned from api')
      }
    }
  ],
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

const api_tool = {
  post(path: string, data: any): AxiosPromise {
    data = JSON.parse(JSON.stringify(data))
    console.log(`Calling POST "${path}" with data: `, data)
    return axios_instance.post(path, data);
  },
  get(path: string, data: any): AxiosPromise {
    data = JSON.parse(JSON.stringify(data))
    console.log(`Calling GET "${path}" with data: `, data)
    return axios_instance.get(path, {
      params: data
    });
  }
}
export default api_tool;