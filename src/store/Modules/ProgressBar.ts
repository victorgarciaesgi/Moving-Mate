import Vue from 'vue';
import { IProgressState } from '@types';
import { RootState } from '../index';
import { storeBuilder } from "./Store/Store";
const css = require('@css');

const API_URL = "https://geo.api.gouv.fr/communes?boost=population&nom=";

let TIMER = null;
let TIMEOUT = null;
let CUT = null;

//State
const state: IProgressState = {
  percent: 0,
  show: false,
  canSuccess: true,
  duration: 3000,
  height: '2px',
  color: css.mainColor,
  failedColor: css.red1,
}

const b = storeBuilder.module<IProgressState>("ProgressModule", state);
const stateGetter = b.state()

// Getters
namespace Getters {
  export const getters = {
    
  }  
}

// Mutations
namespace Mutations {
  function start(state: IProgressState) {
    clearTimeout(TIMEOUT);
    state.show = true
    state.canSuccess = true
    if (TIMER) {
      clearInterval(TIMER);
      state.percent = 0;
    }
    CUT = 20000 / Math.floor(state.duration)
    TIMER = setInterval(() => {
      Mutations.mutations.increase(CUT * Math.random())
      if (state.percent > 95) {
        Mutations.mutations.finish();
      }
    }, 200)
  }
  function set(state: IProgressState, num: number) {
    state.show = true
    state.canSuccess = true
    state.percent = Math.floor(num)
  }
  function increase(state: IProgressState, num: number) {
    state.percent = state.percent + Math.floor(num)
  }
  function decrease(state: IProgressState, num: number) {
    state.percent = state.percent - Math.floor(num)
  }
  function finish(state: IProgressState) {
    state.percent = 100
    Mutations.mutations.hide()
  }
  function pause(state: IProgressState) {
    clearInterval(TIMER);
  }
  function hide(state: IProgressState) {
    clearInterval(TIMER);
    TIMER = null;
    TIMEOUT = setTimeout(() => {
      state.show = false;
      state.percent = 0;
      Vue.nextTick(() => {
        setTimeout(() => {
          state.percent = 0
        }, 200)
      })
    }, 500)
  }
  function fail(state: IProgressState) {
    state.canSuccess = false
  }

  export const mutations = {
    start: b.commit(start),
    set: b.commit(set),
    finish: b.commit(finish),
    increase: b.commit(increase),
    decrease: b.commit(decrease),
    pause: b.commit(pause),
    hide: b.commit(hide),
    fail: b.commit(fail),
  }
}

// Actions
namespace Actions {
  
  export const actions = {
  }
}

// Module
const ProgressModule = {
  get state() { return stateGetter()},
  getters: Getters.getters,
  mutations: Mutations.mutations,
  actions: Actions.actions
}


export default ProgressModule;


