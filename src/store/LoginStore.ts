import jwtDecode from 'jwt-decode';
import _ from 'lodash'
import axios from 'axios'
import { disconnect } from 'cluster';
import { Store, GetterTree, MutationTree, ActionTree, Module } from 'vuex';
import { ILoginState } from '@types';
import { RootState } from './index';
import { capitalize } from '@filters';
import { timeout } from '@methods';

const API_URL = 'http://localhost:3001/'
const LOGIN_URL = API_URL + 'login/'
const SIGNUP_URL = API_URL + 'users/'

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
    try {
      let loginResponse = await axios.post(LOGIN_URL, loginData);
      loginResponse = loginResponse.data;
      if (loginResponse.data.success) {
        localStorage.setItem('id_token', loginResponse.data.id_token);
        localStorage.setItem('access_token', loginResponse.data.access_token);
        let userData = jwtDecode(loginResponse.data.id_token);
        commit('connectUser', userData);
        dispatch('NotificationsModule/addNotification', {type: "success", message: `Vous etes connecté en tant que ${userData.name}`}, {root: true})

      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  },
  async disconnectRequest({commit, dispatch, rootState}) {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    commit('disconnectUser');
  },
  async checkUserSession({commit, dispatch, rootState}) {

  }
}

export const LoginModule: Module<ILoginState, RootState> = {
  state, getters, mutations, actions, namespaced: true
}
