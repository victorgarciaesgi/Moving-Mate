import { timeout } from '@methods';
import Api, { ApiError, ApiSuccess, ApiWarning, ApiResponse } from '../../Api';
import { storeBuilder } from "../Store/Store";

//State
const state: any = {}

declare var gapi: any;

const b = storeBuilder.module<any>("GoogleAuthModule", state);
const stateGetter = b.state()

// Getters
namespace Getters {
  export const getters = {}  
}

// Mutations
module Mutations {
  export const mutations = {
  }
}

// Actions
namespace Actions {
  async function initGapi() {
    await new Promise((resolve, reject) => {
      gapi.load('auth2', async () => {
        await gapi.auth2.init();
        resolve();
      });
    })
  }
  async function signIn() {
    await new Promise(async (resolve, reject) => {
      await actions.initGapi();
      await gapi.auth2.getAuthInstance().signIn();
      try {
        const token = await actions.verifyToken();
        
        resolve();
      } catch(e) {
        console.log(e)
        reject();
      }
    })
  }
  async function verifyToken() {
    console.log('Verifying Google token...');
    return await new Promise((resolve, reject) => {
      let token = null;
      try { 
        token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token 
      } catch { reject(); }

      if (!token) { reject(); }
      else {
        try {
          const response = Api.post('login_check', {token});
          console.log(response);
          resolve(token);
        } catch {
          reject(token);
        }
      }
    });
  }
  
  export const actions = {
    initGapi: b.dispatch(initGapi),
    signIn: b.dispatch(signIn),
    verifyToken: b.dispatch(verifyToken)
  }
}

// Module
const GoogleAuthModule = {
  get state() { return stateGetter()},
  getters: Getters.getters,
  mutations: Mutations.mutations,
  actions: Actions.actions
}


export default GoogleAuthModule;

