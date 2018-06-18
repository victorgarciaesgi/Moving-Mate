import jwtDecode from 'jwt-decode';
import { merge } from 'lodash'
import Api, { ApiError, ApiSuccess, ApiWarning, ApiResponse, addAuthHeaders, removeAuthHeaders, API_URL } from '../../Api';
import NotificationsModule from '../Interface/NotificationsStore';
import router from '@router';
import { ILoginState } from '@types';
import { capitalize } from 'lodash';
import { storeBuilder } from "../Store/Store";
import { JWT } from './TokenStore';
import Paths from '@paths';

const initialState: ILoginState = {
  userInfos: {
    surname: null,
    username: null,
    profile: null,
    name: null,
    id: null,
    avatar: null,
    avatarName: null,
    birthdate: null,
    description: null,
    firstname: null,
    lastname: null,
    isMover: null,
    address: null,
    roles: [],
    phone: null,
    userToken: null,
  },
  sessionChecked: false,
  isLoggedIn: false,
  requesting: false,
  RouteAfter: null,
  showModal: false
}

// State
const state = {...initialState};

const b = storeBuilder.module<ILoginState>('LoginModule', state);
const stateGetter = b.state();


// Getters
namespace Getters {
  const fullName = b.read(function fullName(state): string {
    return state.userInfos.firstname?capitalize(state.userInfos.surname) + " " + capitalize(state.userInfos.name):null;
  })

  const isAdmin = b.read(function isAdmin(state) : boolean {
    return state.userInfos.roles.includes("ROLE_ADMIN");
  })

  const userPicture = b.read(function userPicture(state) : string {
    return state.userInfos.avatar ? API_URL + state.userInfos.avatar.substring(1) : require('@images/user.jpg');
  })

  export const getters = {
    get fullName() { return fullName();},
    get isAdmin() {return isAdmin();},
    get userPicture() {return userPicture();}
  }
}

// Mutations
namespace Mutations {
  function showLogin(state: ILoginState) {
    if(!state.isLoggedIn) {
      state.showModal = true;
    }
  }
  function showLoginRoute(state: ILoginState, route: string) {
    state.showModal = true;
    state.RouteAfter = route;
  }
  function closeModal(state: ILoginState) {
    state.showModal = false;
    state.RouteAfter = null;
  }
  function sessionChecked(state: ILoginState) {
    state.sessionChecked = true;
  }
  function connectUser(state: ILoginState, {userData, token, redirect = null}) {
    state.userInfos = {...state.userInfos, ...userData};
    state.userInfos.userToken = token;
    state.isLoggedIn = true;
    state.showModal = false;
    addAuthHeaders();
    if (state.RouteAfter || redirect) {
      router.push(state.RouteAfter?state.RouteAfter:redirect);
    }
  }

  function updateUserInfos(state: ILoginState, {userData, token}) {
    state.userInfos = {...state.userInfos, ...userData};
    state.userInfos.userToken = token;
    state.isLoggedIn = true;
    state.showModal = false;
    addAuthHeaders();
  }

  function disconnectUser(state: ILoginState) {
    JWT.clear();
    Object.keys(initialState).forEach(key => {
      state[key] = initialState[key]
    });
    state.isLoggedIn = false;
    state.sessionChecked = true;
    removeAuthHeaders();
    if (router.currentRoute.meta.requiresAuth) {
      router.push('/');
      mutations.showLoginRoute(router.currentRoute.fullPath);
    }
    // window.location.reload();
  }

  export const mutations = {
    showLogin: b.commit(showLogin),
    showLoginRoute: b.commit(showLoginRoute),
    closeModal: b.commit(closeModal),
    connectUser: b.commit(connectUser),
    disconnectUser: b.commit(disconnectUser),
    sessionChecked: b.commit(sessionChecked),
    updateUserInfos: b.commit(updateUserInfos)
  }
}


// Actions
namespace Actions {
  async function connexionRequest(context,{loginData, redirect}: {loginData: any, redirect?: string}){
    try {
      state.requesting = true;
      let { success, status, data } = await Api.post(Paths.LOGIN, loginData);
      JWT.set(data);
      LoginModule.actions.connexionSuccess({token: data.token, redirect});
      return new ApiSuccess()
    } catch(err) {
      console.log(err)
      if (err.status === 401) {
        return new ApiError({message: 'Adresse email ou mot de passe incorrect'})
      } else if (err.status === 404 || err.status === 500) {
        return new ApiWarning({message: `Une erreur s'est produite`});
      } else if (err.status === 0) {
        return new ApiWarning({message: `Vérifiez votre connexion internet`});
      }
    } finally {
      state.requesting = false;
    }
  }

  async function connexionSuccess(context, {token, redirect}) {
    let userData = await jwtDecode(token);
    LoginModule.mutations.connectUser({userData, token, redirect});
    NotificationsModule.actions.addNotification({ type: "success", message: `Vous etes connecté en tant que ${capitalize(userData.username)}` })
  }

  function disconnectRequest() {
    LoginModule.mutations.disconnectUser();
    router.push('/');
    NotificationsModule.actions.addNotification({ type: "alert", message: `Vous avez été deconnecté` })
  }

  async function checkUserSession(){
    let {token, refresh_token} = JWT.fetch();
    if (!!token) {
      try {
        let { data } = await Api.checkSession({token, refresh_token});
        JWT.set(data);
        let userData = await jwtDecode(data.token);
        LoginModule.mutations.connectUser({userData, token: data.token});
      } catch(e) {
        Mutations.mutations.disconnectUser();
      }
    } else {
      console.log('User not logged');
    }
    LoginModule.mutations.sessionChecked();
    return;
  }

  async function refreshUserInfos(){
    let {token, refresh_token} = JWT.fetch();
    if (!!token) {
      try {
        let { data } = await Api.checkSession({token, refresh_token});
        JWT.set(data);
        let userData = await jwtDecode(data.token);
        LoginModule.mutations.updateUserInfos({userData, token: data.token});
      } catch(e) {
        Mutations.mutations.disconnectUser();
      }
    }
  }



  export const actions = {
    connexionRequest: b.dispatch(connexionRequest),
    connexionSuccess: b.dispatch(connexionSuccess),
    disconnectRequest: b.dispatch(disconnectRequest),
    checkUserSession: b.dispatch(checkUserSession),
    refreshUserInfos: b.dispatch(refreshUserInfos)
  }
}


// Module
const LoginModule = {
  get state() { return stateGetter() },
  getters: Getters.getters,
  mutations: Mutations.mutations,
  actions: Actions.actions
}


export default LoginModule;

