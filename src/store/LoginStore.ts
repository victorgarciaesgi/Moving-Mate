import jwtDecode from 'jwt-decode';
import { merge } from 'lodash'
import Api from './Api';
import { Store, GetterTree, MutationTree, ActionTree, Module } from 'vuex';
import { ILoginState } from '@types';
import { RootState } from './index';
import { capitalize } from '@filters';

const LOGIN_URL = "login_check";

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
  showModal: false,
  reset() {
    this.name = null;
    this.username = null;
    this.surname = null;
    this.id = null;
    this.isLoggedIn = false;
    this.isAdmin = false,
    this.status = null;
    this.showModal = false;
  }
}

const getters: GetterTree<ILoginState, RootState> = {
  fullName(state): string {
    return capitalize(state.surname) + " " + capitalize(state.name)
  }
}

const mutations: MutationTree<ILoginState> = {
  showLogin(state, modal) {
    state.showModal = true;
  },
  closeModal( modal) {
    state.showModal = false;
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
  async connexionRequest({commit, dispatch}, loginData) {
    let { token } = await Api.post(LOGIN_URL, loginData);
    if (token) {
      localStorage.setItem('access_token', token);
      dispatch('connexionSuccess', token);
      return { success: true };
    } else {
      return {success: false, type: 'error', message: 'Adresse email ou mot de passe incorrect' };
    }
  },
  async connexionSuccess({commit, dispatch}, token: string) {
    let userData = await jwtDecode(token);
    userData = merge(userData, {userToken: token});
    commit('connectUser', userData);
    dispatch('NotificationsModule/addNotification', {type: "success", message: `Vous etes connecté en tant que ${capitalize(userData.username)}`}, {root: true})
  },
  disconnectRequest({commit, dispatch}) {
    localStorage.removeItem('access_token');
    commit('disconnectUser');
    dispatch('NotificationsModule/addNotification', {type: "success", message: `Vous avez été deconnecté`}, {root: true})
  },
  checkUserSession({commit, dispatch}) {
    let token = localStorage.getItem("access_token");
    if (!!token) {
      dispatch('connexionSuccess', token);
    } else {
      console.log('User not logged');
    }
  }
}

function fetchTokens() {
  
}

export const LoginModule: Module<ILoginState, RootState> = {
  state, getters, mutations, actions, namespaced: true
}
