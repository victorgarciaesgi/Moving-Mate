import { disconnect } from 'cluster';
import { Store, GetterTree, MutationTree, ActionTree, Module } from 'vuex';
import { IProgressState } from '@types';
import { RootState } from '../index';

const API_URL = "https://geo.api.gouv.fr/communes?boost=population&nom=";

const state: IProgressState = {
  error: false,
  lenght: 0
}

const getters: GetterTree<IProgressState, RootState> = {
  
}

const mutations: MutationTree<IProgressState> = {
  
}

const actions: ActionTree<IProgressState, RootState> = {
  
}

export const ProgressBar: Module<IProgressState, RootState> = {
  state, getters, mutations, actions, namespaced: true
}
