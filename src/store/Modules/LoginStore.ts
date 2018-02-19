import jwtDecode from 'jwt-decode';
import { merge } from 'lodash'
import Api, { ApiError, ApiSuccess, ApiWarning, ApiResponse, addAuthHeaders, removeAuthHeaders } from '../Api';
import NotificationsModule from './NotificationsStore';
import router from '@router';
import { ActionContext } from 'vuex';
import { ILoginState } from '@types';
import { RootState } from '../index';
import { capitalize } from 'lodash';
import { storeBuilder } from "./Store/Store";
import { JWT } from '../TokenStore'

type LoginContext = ActionContext<ILoginState, RootState>;
const LOGIN_URL = "login_check";

// State
const state: ILoginState = {
  userInfos: {
    surname: null,
    username: null,
    profile: null,
    name: null,
    id: null,
    roles: [],
    status: null,
    userToken: null,
  },
  sessionChecked: false,
  isLoggedIn: false,
  requesting: false,
  RouteAfter: null,
  showModal: false,
  reset() {
    this.userInfos = {
      name: null,
      username: null,
      surname: null,
      id: null,
      profile: null,
      roles: [],
      status: null,
      userToken: null
    },
    this.showModal = false,
    this.isLoggedIn = false;
  }
}

const b = storeBuilder.module<ILoginState>('LoginModule', state);
const stateGetter = b.state();


// Getters
namespace Getters {
  const fullName = b.read(function fullName(state: ILoginState): string {
    return capitalize(state.userInfos.surname) + " " + capitalize(state.userInfos.name);
  })

  const isAdmin = b.read(function isAdmin(state: ILoginState) : boolean {
    return state.userInfos.roles.includes("ROLE_ADMIN");
  })

  const userPicture = b.read(function userPicture(state: ILoginState) : string {
    return state.userInfos.profile || require('@images/user.jpg');;
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
    state.showModal = true;
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
  function connectUser(state: ILoginState, {userData, token}) {
    state.userInfos = merge(state.userInfos, userData);
    state.userInfos.userToken = token;
    state.isLoggedIn = true;
    addAuthHeaders();
    if (state.RouteAfter) {
      router.push(state.RouteAfter);
    }
  }
  function disconnectUser(state: ILoginState) {
    state.reset();
    removeAuthHeaders();
    router.push('/');
  }

  export const mutations = {
    showLogin: b.commit(showLogin),
    showLoginRoute: b.commit(showLoginRoute),
    closeModal: b.commit(closeModal),
    connectUser: b.commit(connectUser),
    disconnectUser: b.commit(disconnectUser),
    sessionChecked: b.commit(sessionChecked),
  }
}


// Actions
namespace Actions {
  async function connexionRequest(context: LoginContext, loginData: Object): Promise<ApiResponse> {
    state.requesting = true;
    let { success, status, data } = await Api.post(LOGIN_URL, loginData);
    state.requesting = false;
    if (success) {
      JWT.set(data.token);
      LoginModule.actions.connexionSuccess(data.token);
      return new ApiSuccess();
    } else {
      if (status === 401) {
        return new ApiError('Adresse email ou mot de passe incorrect')
      } else if (status === 404) {
        return new ApiWarning(`Une erreur s'est produite`);
      } else if (status === 0) {
        return new ApiWarning(`Vérifiez votre connexion internet`);
      }
    }
  }
  async function connexionSuccess(context: LoginContext, token: string) {
    let userData = await jwtDecode(token);
    console.log(userData);
    LoginModule.mutations.connectUser({userData, token});
    NotificationsModule.actions.addNotification({ type: "success", message: `Vous etes connecté en tant que ${capitalize(userData.username)}` })
  }
  function disconnectRequest() {
    JWT.clear();
    LoginModule.mutations.disconnectUser();
    NotificationsModule.actions.addNotification({ type: "success", message: `Vous avez été deconnecté` })
  }
  async function checkUserSession(){
    let token = JWT.fetch();
    if (!!token) {
      let userData = await jwtDecode(token);
      LoginModule.mutations.connectUser({userData, token});
    } else {
      console.log('User not logged');
    }
    LoginModule.mutations.sessionChecked();
    return;
  }

  export const actions = {
    connexionRequest: b.dispatch(connexionRequest),
    connexionSuccess: b.dispatch(connexionSuccess),
    disconnectRequest: b.dispatch(disconnectRequest),
    checkUserSession: b.dispatch(checkUserSession),
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

