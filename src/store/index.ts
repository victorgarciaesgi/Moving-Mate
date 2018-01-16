import { ILoginState, INotificationState, ISearchMovingState, ISignupState} from '@types';

export interface RootState {
  LoginModule: ILoginState,
  NotificationsModule: INotificationState,
  SearchMovingModule: ISearchMovingState
  SignupModule: ISignupState
}

export {store} from './Store';
export {default as EventBus} from './EventBus';
export {default as Api} from './Api';
