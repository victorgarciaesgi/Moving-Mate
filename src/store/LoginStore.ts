import jwtDecode from 'jwt-decode';
import _ from 'lodash'
import axios from 'axios'
import { disconnect } from 'cluster';
import { Store, GetterTree, MutationTree, ActionTree, Module } from 'vuex';
import { ILoginState } from '@types';
import { RootState } from './index';
import { capitalize } from '@filters';
import { timeout } from '@methods';

const API_URL = 'http://localhost:8000/'
const LOGIN_URL = API_URL + 'login_check'
const SIGNUP_URL = API_URL + 'users/'

const state: ILoginState = {
  name: null,
  surname: null,
  id: null,
  isLoggedIn: false,
  isAdmin: false,
  status: null,
  showConnexion: false,
  showInscription: false,
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
      let loginResponse = await axios.post(LOGIN_URL, loginData);
      loginResponse = loginResponse.data;
      if (loginResponse.data.success) {
        localStorage.setItem('id_token', loginResponse.data.id_token);
        localStorage.setItem('access_token', loginResponse.data.access_token);
        let userData = jwtDecode(loginResponse.data.id_token);
        commit('connectUser', userData);
        dispatch('NotificationsModule/addNotification', {type: "success", message: `Vous etes connecté en tant que ${userData.name}`}, {root: true})
        return {success: true };
      } else {
        return {success: false, type: 'error', message: 'Adresse email ou mot de passe incorrect' };
      }
    } catch (error) {
      return {success: false, type: 'warning', message: 'Impossible de se connecter, vérifiez votre connexion internet' };
    }
  },
  async disconnectRequest({commit, dispatch, rootState}) {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    commit('disconnectUser');
  },
  async checkUserSession({commit, dispatch, rootState}) {
    console.log('Checking user Auth...');
    if (!!localStorage.getItem("id_token") && !!localStorage.getItem("access_token")){
      commit('connectUser', jwtDecode(localStorage.getItem("id_token")));
    } else {
      console.log('User not logged');
    }
  }
}

export const LoginModule: Module<ILoginState, RootState> = {
  state, getters, mutations, actions, namespaced: true
}
