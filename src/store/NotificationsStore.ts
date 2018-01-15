import { Store, GetterTree, MutationTree, ActionTree, Module } from 'vuex';
import { INotificationState, INotification, INotificationType } from '@types';
import { RootState } from './index';
import { timeout } from '@methods';
import { merge } from 'lodash';

const TIMEOUT = 3000;

const state: INotificationState = {
  notificationCount: 0,
  notificationList: []
}

const getters: GetterTree<INotificationState, RootState> = {}

const mutations: MutationTree<INotificationState> = {
  addAlert(state, alert: INotification) {
    state.notificationList.push(alert);
    state.notificationCount++;
  },
  deleteAlert(state, alert: INotification) {
    var index = state.notificationList.findIndex(element => element.id === alert.id);
    state.notificationList.splice(index, 1);
  }
}

const actions: ActionTree<INotificationState, RootState> = {
  async addNotification({ commit, rootState }, alert: INotification) {
    alert = merge(alert, {
      id: state.notificationCount,
      isNotif: alert.isNotif || false
    })
    commit('addAlert', alert);
    await timeout(TIMEOUT);
    commit('deleteAlert', alert)
  }
}

export const NotificationsModule: Module<INotificationState, RootState> = {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}
