import Vuex from 'vuex';
import Vue from 'vue';

import { ILoginState, INotificationState, ISearchMovingState, ISignupState} from '@types';
export {default as EventBus} from './EventBus';
export {default as Api} from './Api';

import { LoginModule } from './Modules';
import { NotificationsModule } from './NotificationsStore';
import { SearchMovingModule } from './SearchMoving';
import { SignupModule } from './SignupStore';


Vue.use(Vuex);

export interface RootState {
  LoginModule: ILoginState,
  NotificationsModule: INotificationState,
  SearchMovingModule: ISearchMovingState
  SignupModule: ISignupState
}

export const store = new Vuex.Store({
  modules: { 
    LoginModule, 
    NotificationsModule,
    SearchMovingModule,
    SignupModule
  }
})