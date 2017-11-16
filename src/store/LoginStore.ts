import jwtDecode from 'jwt-decode';
import _ from 'lodash'
import Api from './Api';
import { Store, GetterTree, MutationTree, ActionTree, Module } from 'vuex';
import { ILoginState } from '@types';
import { RootState } from './index';
import { capitalize } from '@filters';
import { timeout } from '@methods';

const state: ILoginState = {
  name: null,
  surname: null,
  username: null,
  id: null,
  isLoggedIn: false,
  isAdmin: false,
  status: null,
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
  fullName(state) {
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
      console.log('Requiring Auth verification...')
      let loginResponse = await Api.post('login_check', loginData)
      console.log(loginResponse);
      if (loginResponse.token) {
        localStorage.setItem('access_token', loginResponse.token);
        let userData = await jwtDecode(loginResponse.token);
        commit('connectUser', userData);
        dispatch('NotificationsModule/addNotification', {type: "success", message: `Vous etes connecté en tant que ${userData.username}`}, {root: true})
        return { success: true };
      } else {
        return {success: false, type: 'error', message: 'Adresse email ou mot de passe incorrect' };
      }
    } catch (error) {
      console.log(error);
      return {success: false, type: 'warning', message: 'Impossible de se connecter, vérifiez votre connexion internet' };
    }
  },
  async disconnectRequest({commit, dispatch, rootState}) {
    localStorage.removeItem('access_token');
    commit('disconnectUser');
    dispatch('NotificationsModule/addNotification', {type: "success", message: `Vous avez été deconnecté`}, {root: true})
  },
  async checkUserSession({commit, dispatch, rootState}) {
    console.log('Checking user Auth...');
    if (!!localStorage.getItem("access_token")) {
      commit('connectUser', jwtDecode(localStorage.getItem("access_token")));
    } else {
      console.log('User not logged');
    }
  }
}

export const LoginModule: Module<ILoginState, RootState> = {
  state, getters, mutations, actions, namespaced: true
}
