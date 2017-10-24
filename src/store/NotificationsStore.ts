import { Store, GetterTree, MutationTree, ActionTree, Module } from 'vuex';
import { INotificationState, INotification, INotificationType } from '@types';
import { RootState } from './index';
import { capitalize } from '@filters';
import { timeout } from '@methods';
import _ from 'lodash'
import axios from 'axios'

const state: INotificationState = {
  notificationCount: 0,
  notificationList: []
}

const getters: GetterTree<INotificationState, RootState> = {

}

const mutations: MutationTree<INotificationState> = {
  addAlert(state, alert: INotification) {
    state.notificationList.push(alert);
  },
  deleteAlert(state, alert: INotification) {
    var index = state.notificationList.findIndex(element => element.id === alert.id);
    state.notificationList.splice(index, 1);
  }
}

const actions: ActionTree<INotificationState, RootState> = {
  async addNotification({commit, rootState}, alert: INotification) {
    alert = _.merge(alert, {
      id: state.notificationCount,
      isNotif: alert.isNotif || false
    })
    state.notificationCount++;
    commit('addAlert', alert);
    await timeout(5000);
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
