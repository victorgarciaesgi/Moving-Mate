import { ILoginState, INotificationState, IMovingState, ISignupState,
IProgressState, IGlobalState} from '@types';
import {Route} from 'vue-router';

export interface RootState {
  LoginModule: ILoginState,
  NotificationsModule: INotificationState,
  MovingModule: IMovingState,
  SignupModule: ISignupState,
  GlobalModule: IGlobalState,
  route: Route;
}

// export const DebugMode: boolean = process.env.DEBUG_MODE == true;
export const DebugMode = false;
console.log(DebugMode);

export * from './Modules'
export {default as EventBus} from './EventBus';
export {default as Api} from './Api';