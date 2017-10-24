import Vuex from 'vuex';
import Vue from 'vue';

import { ILoginState, INotificationState } from '@types'
import { LoginModule } from './LoginStore'
import { NotificationsModule } from './NotificationsStore'

Vue.use(Vuex);

export interface RootState {
  LoginModule: ILoginState,
  NotificationsModule: INotificationState
}

export const store = new Vuex.Store({
  modules: { 
    LoginModule, 
    NotificationsModule
  }
})