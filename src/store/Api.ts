import { namespace } from 'vuex-class/lib';
import axios, { AxiosInstance, AxiosPromise, AxiosResponse, AxiosInterceptorManager } from 'axios';
import LoginModule from './Modules/LoginStore';
import router from '@src/router'
import { error } from 'util';

export const API_URL = process.env.API_URL;

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

async function Request(type: string, path: string, payload: any): Promise<AxiosSuccess | AxiosError> {
  try {
    if (type === 'post'||'put') {
      let response: AxiosResponse = await axiosInstance[type](path, payload, {
        headers: headers()
      })
      console.log(new AxiosSuccess(response.data))
      return new AxiosSuccess(response.data);
    } else {
      let response: AxiosResponse = await axiosInstance[type](path, {
        params: payload,
        headers: headers()
      })
      return new AxiosSuccess(response.data);;
    }
  } 
  catch(error) {
    console.log(error)
    if (error.response) {
      return new AxiosError(error.response.status);
    } else {
      return new AxiosError(0);
    }
  }
  
}

const headers = () => {
  let authToken: any = "";
  const userState = LoginModule.state;
  if (userState.isLoggedIn) {
    authToken = { "Authorization": `Bearer ${userState.userToken}`}
  }
  return authToken;
}


namespace ApiTool {
  export async function post(path: string, payload: any) {
    return await Request('post', path, payload)
  }
  export async function get(path: string, payload?: any) {
    return await Request('get', path, payload)
  }
  export async function put(path: string, payload: any) {
    return await Request('put', path, payload)
  }
  export async function Delete(path: string, payload: any) {
    return await Request('delete', path, payload)
  }
}
export default ApiTool;




class AxiosSuccess {
  public success: boolean = true;
  public status: number;
  public data: any;

  constructor(data: any) {
    this.data = data;
  }
}

class AxiosError {
  public success: boolean = false;
  public status: number;
  public data: any;

  constructor(status?: number) {
    this.status = status;
  }
}

export type ApiResponse = ApiSuccess|ApiError|ApiWarning;

export class ApiSuccess {
  public success: boolean = true;
  public message: string;
  public data?: any;
  public type?: string = 'success';

  constructor(message?: string, data?: any) {
    this.message = message;
    this.data = data?data:{};
  }
}

export class ApiError {
  public success: boolean = false;
  public message: string;
  public type?: string = 'error';

  constructor(message?: string) {
    this.message = message;
  }
}

export class ApiWarning {
  public success: boolean = false;
  public message: string;
  public type?: string = 'warning';

  constructor(message?: string) {
    this.message = message;
  }
}