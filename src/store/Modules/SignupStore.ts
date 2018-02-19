import {ActionContext  } from 'vuex';
import { ISignupState } from '@types';
import Api, { ApiError, ApiSuccess, ApiWarning, ApiResponse } from '../Api';
import { RootState } from '../index';
import { timeout } from '@methods';
import { storeBuilder } from "./Store/Store";

type SignupContext = ActionContext<ISignupState, RootState>;

//State
const state: ISignupState = {
  showModal: false,
}

const b = storeBuilder.module<ISignupState>("SignupModule", state);
const stateGetter = b.state()

// Getters
namespace Getters {
  export const getters = {
    
  }  
}

// Mutations
namespace Mutations {
  function showSignup(state) {
    state.showModal = true;
  }
  function closeModal(state) {
    state.showModal = false;
  }

  export const mutations = {
    showSignup: b.commit(showSignup),
    closeModal: b.commit(closeModal),
  }
}

// Actions
namespace Actions {
  async function signupRequest(context:SignupContext, loginData: Object) {
    let submitResponse = await Api.post('register', loginData)
    return submitResponse;
  }

  export const actions = {
    signupRequest: b.dispatch(signupRequest),
  }
}

// Module
const SignupModule = {
  get state() { return stateGetter()},
  getters: Getters.getters,
  mutations: Mutations.mutations,
  actions: Actions.actions
}


export default SignupModule;

