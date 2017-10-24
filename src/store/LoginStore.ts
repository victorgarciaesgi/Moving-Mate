import { Store, GetterTree, MutationTree, ActionTree, Module } from 'vuex';
import { ILoginState } from '@types';
import { RootState } from './index';
import { capitalize } from '@filters';
import { timeout } from '@methods';
import _ from 'lodash'
import axios from 'axios'

const state: ILoginState = {
  name: null,
  surname: null,
  id: null,
  isLoggedIn: false,
  isAdmin: false,
  status: null,
  showModal: false,
  reset() {
    this.name = null;
    this.surname = null;
    this.id = null;
    this.isLoggedIn = false;
    this.status = null;
  }
}

const getters: GetterTree<ILoginState, RootState> = {
  fullName(state) {
    return capitalize(state.surname) + " " + capitalize(state.name)
  }
}

const mutations: MutationTree<ILoginState> = {
  connectUser(state, userData) {
    state = _.merge(state, userData);
    state.isLoggedIn = true;
  },
  disconnectUser(state, data) {
    state.reset()
  }
}

const actions: ActionTree<ILoginState, RootState> = {
  async connexionRequest({commit, dispatch, rootState}, loginData) {
    await timeout(1000);
    commit('connectUser', {})
    dispatch('NotificationsModule/addNotification', {type: "success", message: "Vous etes connecté (test)"}, {root: true})
    return;
  }
}

export const LoginModule: Module<ILoginState, RootState> = {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}
