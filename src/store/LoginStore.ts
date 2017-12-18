import jwtDecode from 'jwt-decode';
import { merge } from 'lodash'
import Api from './Api';
import { Store, GetterTree, MutationTree, ActionTree, Module } from 'vuex';
import { ILoginState } from '@types';
import { RootState } from './index';
import { capitalize } from '@filters';
import { timeout } from '@methods';

export const state: ILoginState = {
  name: null,
  surname: null,
  username: null,
  profilePicture: null,
  id: null,
  isLoggedIn: false,
  isAdmin: false,
  status: null,
  userToken: null,
  showConnexion: false,
  showInscription: false,
  reset() {
    this.name = null;
    this.username = null;
    this.surname = null;
    this.id = null;
    this.isLoggedIn = false;
    this.isAdmin = false,
    this.status = null;
    this.showConnexion = false;
    this.showInscription = false;
  }
}

const getters: GetterTree<ILoginState, RootState> = {
  fullName(state): string {
    return capitalize(state.surname) + " " + capitalize(state.name)
  }
}

const mutations: MutationTree<ILoginState> = {
  showModal(state, modal) {
    state[modal] = true;
  },
  closeModal(state, modal) {
    state[modal] = false;
  },
  connectUser(state, userData) {
    state = merge(state, userData);
    state.isLoggedIn = true;
  },
  disconnectUser(state, data) {
    state.reset()
  }
}

export const actions: ActionTree<ILoginState, RootState> = {
  async submitRequest({commit, dispatch, rootState}, loginData) {
    let loginResponse = await Api.post('register/confirmed', loginData)
  },
  async connexionRequest({commit, dispatch, rootState}, loginData) {
    let loginResponse = await Api.post('login_check', loginData);
    if (loginResponse.token) {
      localStorage.setItem('access_token', loginResponse.token);
      dispatch('connexionSuccess', loginResponse.token);
      return { success: true };
    } else {
      return {success: false, type: 'error', message: 'Adresse email ou mot de passe incorrect' };
    }
  },
  async connexionSuccess({commit, dispatch, rootState}, token) {
    let userData = await jwtDecode(token);
    userData = merge(userData, token);
    commit('connectUser', userData);
    dispatch('NotificationsModule/addNotification', {type: "success", message: `Vous etes connecté en tant que ${capitalize(userData.username)}`}, {root: true})
  },
  async disconnectRequest({commit, dispatch, rootState}) {
    localStorage.removeItem('access_token');
    commit('disconnectUser');
    dispatch('NotificationsModule/addNotification', {type: "success", message: `Vous avez été deconnecté`}, {root: true})
  },
  async checkUserSession({commit, dispatch, rootState}) {
    let token = localStorage.getItem("access_token");
    if (!!token) {
      dispatch('connexionSuccess', token);
    } else {
      console.log('User not logged');
    }
  }
}

export const LoginModule: Module<ILoginState, RootState> = {
  state, getters, mutations, actions, namespaced: true
}
