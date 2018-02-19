import {ActionContext  } from 'vuex';
import { ISignupState } from '@types';
import Api, { ApiError, ApiSuccess, ApiWarning, ApiResponse } from '../Api';
import { RootState } from '../index';
import { timeout } from '@methods';
import { storeBuilder } from "./Store/Store";

type SignupContext = ActionContext<ISignupState, RootState>;

<<<<<<< Updated upstream
=======
const SIGNUP_URL = 'register';

>>>>>>> Stashed changes
//State
const state: ISignupState = {
  showModal: false,
  requesting: false,
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
    let { success, status, data } = await Api.post(SIGNUP_URL, loginData);
    state.requesting = false
    if (success) {
      return new ApiSuccess();
    } else {
      if (status === 401) {
        return new ApiError('Veuillez remplir correctement les champs')
      } else if (status === 404) {
        return new ApiWarning(`Une erreur s'est produite`);
      } else if (status === 0) {
        return new ApiWarning(`Vérifiez votre connexion internet`);
      }
    }
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

