import jwtDecode from 'jwt-decode';
import { timeout } from '@methods';
import Api, { ApiError, ApiSuccess, ApiWarning, ApiResponse } from '../../Api';
import { storeBuilder } from "../Store/Store";

//State
const state: any = {}

const b = storeBuilder.module<any>("GoogleAuthModule", state);
const stateGetter = b.state();


// Actions
namespace Actions {

  
  export const actions = {

  }
}

// Module
const GoogleAuthModule = {
  // get state() { return stateGetter()},
  // getters: Getters.getters,
  // mutations: Mutations.mutations,
  actions: Actions.actions
}


export default GoogleAuthModule;

