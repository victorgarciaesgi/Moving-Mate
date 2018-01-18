import { ILoginState, INotificationState, ISearchMovingState, ISignupState} from '@types';

export interface RootState {
  LoginModule: ILoginState,
  NotificationsModule: INotificationState,
  SearchMovingModule: ISearchMovingState
  SignupModule: ISignupState
}

export const DebugMode: boolean = process.env.DEBUG_MODE == 'true';

export * from './Modules'
export {default as EventBus} from './EventBus';
export {default as Api} from './Api';