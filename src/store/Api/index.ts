import Request from './Instance';
export * from './ApiTypes';
import axios from 'axios';
export {addAuthHeaders, removeAuthHeaders, API_URL} from './Instance';
import {AlgoliaSearch} from './AlgoliaController';
import Paths from '@paths'


const algoliaApi = new AlgoliaSearch();
export namespace ApiTool {
  export async function post(path: string, payload?: any) {
    return await Request('post', path, payload)
  }
  export async function postFormData(path: string, payload?: any) {
    return await Request('postFormData', path, payload)
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
  export async function AlgoliaMoving(fields: {text: string, lat: number, lng: number}) {
    return await algoliaApi.searchMoving(fields);
  }
  export async function AlgoliaMovers(fields: {text: string, lat: number, lng: number}) {
    return await algoliaApi.searchMovers(fields);
  }
  export async function checkSession({token, refresh_token}) {
    return await axios.post(process.env.API_URL + Paths.TOKEN_REFRESH, {
      refresh_token
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }
}
export default ApiTool;