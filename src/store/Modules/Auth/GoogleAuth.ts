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
        await actions.verifyToken();
        // Sign in mutation
        console.log('connected');
        resolve();
      } catch(e) {
        console.log(e)
        reject();
      }
    })
  }
  async function verifyToken() {
    console.log('verifying token...');
    await new Promise((resolve, reject) => {
      let token = null;
      try { 
        token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token 
      } catch (e) { reject(); }
      if (!token) { reject(); }
      else {
        console.log(token);
        // Api.verify(token).then(res => {
        //   console.log('token verified', res);
        //   if (res && res.data && res.data.token_valid) { resolve(res.data.profile); }
        //   else { reject(); }
        // }).catch(err => {
        //   console.log(err);
        //   reject(err);
        // })
        resolve();
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

