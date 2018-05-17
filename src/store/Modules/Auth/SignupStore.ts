import { ISignupState } from '@types';
import Api, { ApiError, ApiSuccess, ApiWarning, ApiResponse } from '../../Api';
import { storeBuilder } from "../Store/Store";
import Paths from '@paths';


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
  async function signupRequest(context, loginData: Object): Promise<ApiResponse> {
    try {
      let { success, status, data } = await Api.post(Paths.SIGNUP, loginData);
      state.requesting = false
      if (success) {
        return new ApiSuccess();
      }
    } catch(err) {
      console.log(err)
      if (err.status === 403) {
        return new ApiError({message: 'Adresse mail déjà utilisée'});
      } else if (err.status === 500) {
        return new ApiWarning({message: `Une erreur s'est produite`});
      } else if (err.status === 0) {
        return new ApiWarning({message: `Vérifiez votre connexion internet`});
      }
    } finally {
      state.requesting = false;
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

