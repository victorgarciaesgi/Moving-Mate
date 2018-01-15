export * from './LoginState';
export * from './Signup';
export * from './SearchMoving';
export * from './Notifications';


export interface IResponse<T> {
  success?: boolean,
  message?: string,
  type: 'error'|'warning'
  data: T,

}