import Request from './Instance';
export * from './ApiTypes';

export namespace ApiTool {
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