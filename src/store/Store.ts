import Vuex from 'vuex';
import Vue from 'vue';

import { ILoginState, INotificationState, ISearchMovingState, ISignupState} from '@types';
import * as Modules from './Modules';


function loadModules() {
  let modules = {};
  Object.assign(modules, Modules);
  return modules;
}

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: loadModules()
})