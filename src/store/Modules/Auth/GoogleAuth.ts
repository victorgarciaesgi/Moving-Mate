import jwtDecode from 'jwt-decode';
import { timeout } from '@methods';
import Api, { ApiError, ApiSuccess, ApiWarning, ApiResponse } from '../../Api';
import { storeBuilder } from "../Store/Store";

//State
const state: any = {}

declare var gapi: any;

const b = storeBuilder.module<any>("GoogleAuthModule", state);
const stateGetter = b.state()

// Actions
namespace Actions {
  async function initGapi(): Promise<any> {
    return new Promise((resolve, reject) => {
      gapi.load('auth2', async () => {
        await gapi.auth2.init();
        resolve();
      });
    })
  }
  async function signIn(): Promise<any>{
    return new Promise(async (resolve, reject) => {
      await actions.initGapi();
      await gapi.auth2.getAuthInstance().signIn();
      try {
        const token = await actions.getToken();
        const tokenVerified = await actions.verifyToken(token)
        resolve();
      } catch(e) {
        console.log(e)
        reject();
      }
    })
  }
  async function getToken(): Promise<any>{
    console.log('Verifying Google token...');
    return new Promise(async(resolve, reject) => {
      try { 
        const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
        resolve(token);
      } catch { reject(); }
    });
  }

  async function verifyToken(context, token: string): Promise<any> {
    let decodedToken = await jwtDecode(token);
    console.log(decodedToken);
  }
  
  export const actions = {
    initGapi: b.dispatch(initGapi),
    signIn: b.dispatch(signIn),
    getToken: b.dispatch(getToken),
    verifyToken: b.dispatch(verifyToken)
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

