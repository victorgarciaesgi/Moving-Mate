import Request from './Instance';
export * from './ApiTypes';
export {addAuthHeaders, removeAuthHeaders} from './Instance';

export namespace ApiTool {
  export async function post(path: string, payload: any, noAuth?: boolean) {
    return await Request('post', path, payload, noAuth)
  }
  export async function get(path: string, payload?: any, noAuth?: boolean) {
    return await Request('get', path, payload, noAuth)
  }
  export async function put(path: string, payload: any, noAuth?: boolean) {
    return await Request('put', path, payload, noAuth)
  }
  export async function Delete(path: string, payload: any, noAuth?: boolean) {
    return await Request('delete', path, payload, noAuth)
  }
}
export default ApiTool;