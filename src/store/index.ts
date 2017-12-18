import Vuex from 'vuex';
import Vue from 'vue';

import { ILoginState, INotificationState, ISearchMovingState } from '@types';
import { LoginModule } from './LoginStore';
import { NotificationsModule } from './NotificationsStore';
import { SearchMovingModule } from './SearchMoving';
export {default as EventBus} from './EventBus';

Vue.use(Vuex);

export interface RootState {
  LoginModule: ILoginState,
  NotificationsModule: INotificationState,
  SearchMovingModule: ISearchMovingState
}

export const store = new Vuex.Store({
  modules: { 
    LoginModule, 
    NotificationsModule,
    SearchMovingModule
  }
})