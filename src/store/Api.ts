import axios, { AxiosInstance, AxiosPromise, AxiosResponse } from 'axios';

const API_URL = 'http://localhost:8000';

const axios_instance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {'Content-Type': 'multipart/form-data'}
});

const api_tool = {
  async post(path: string, payload: any) {
    payload = JSON.parse(JSON.stringify(payload))
    console.log(`Calling POST "${path}" with data: `, payload);
    let FormObject = new FormData();
    for (var key in payload) {
      FormObject.append(key, payload[key]);
    }
    let response: AxiosResponse = await axios_instance.post(path, FormObject);
    return response.data
  },
  async get(path: string, payload: any) {
    payload = JSON.parse(JSON.stringify(payload))
    console.log(`Calling GET "${path}" with data: `, payload);

    let response: AxiosResponse = await axios_instance.get(path, {
      params: payload
    });
    return response.data
  }
}
export default api_tool;