import jwtDecode from 'jwt-decode';
import { merge } from 'lodash'
import Api from './Api';
import { Store, GetterTree, MutationTree, ActionTree, Module } from 'vuex';
import { ISignupState } from '@types';
import { RootState } from './index';

export const state: ISignupState = {
  showModal: false,
}

const getters: GetterTree<ISignupState, RootState> = {

}

const mutations: MutationTree<ISignupState> = {
  showSignup(state) {
    state.showModal = true;
  },
  closeModal(state) {
    state.showModal = false;
  }
}

export const actions: ActionTree<ISignupState, RootState> = {
  async signupRequest({commit, dispatch}, loginData) {
    let submitResponse = await Api.post('register', loginData)
    return submitResponse;
  },
}

export const SignupModule: Module<ISignupState, RootState> = {
  state, getters, mutations, actions, namespaced: true
}
