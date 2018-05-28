export * from './LoginState';
export * from './Signup';
export * from './MovingState';
export * from './MoverState';
export * from './Notifications';
export * from './ProgressBar.d';
export * from './GlobalState.d';
export * from './GoogleMaps.d';
export * from './AlertState.d';
export * from './UserTypes.d';


export interface IResponse<T> {
  success?: boolean,
  message?: string,
  type: 'error'|'warning'
  data: T,
}

export interface ITab {
  title: string,
  icon?: any,
  condition?: boolean,
  childs?: boolean,
  to: {
    name: string,
    params: {
      [x:string]: any
    }
  }
}