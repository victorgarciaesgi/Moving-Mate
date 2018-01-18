import jwtDecode from 'jwt-decode';
import { merge } from 'lodash'
import Api, { ApiError, ApiSuccess, ApiWarning, ApiResponse } from '../Api';
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

const state: ILoginState = {
  name: null,
  surname: null,
  username: null,
  profilePicture: null,
  id: null,
  isLoggedIn: false,
  roles: null,
  status: null,
  userToken: null,
  requesting: false,
  RouteAfter: null,
  showModal: false,
  reset() {
    this.name = null;
    this.username = null;
    this.surname = null;
    this.id = null;
    this.isLoggedIn = false;
    this.roles = null;
    this.status = null;
    this.showModal = false;
  }
}

const b = storeBuilder.module<ILoginState>("LoginModule", state);
const stateGetter = b.state()


// Getters
namespace Getters {
  function fullName(state: ILoginState): string {
    return capitalize(state.surname) + " " + capitalize(state.name)
  }

  function isAdmin(state: ILoginState) : boolean {
    return state.roles.include("ROLE_ADMIN");
  }

  export const getters = {
    get fullName() { return b.read(fullName) },
    get isAdmin() {return b.read(isAdmin)}
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
  }
  function connectUser(state: ILoginState, userData: Object) {
    state = merge(state, userData);
    state.isLoggedIn = true;
    if (state.RouteAfter) {
      router.push(state.RouteAfter);
    }
  }
  function disconnectUser(state: ILoginState) {
    state.reset();
    router.push('/');
  }

  export const mutations = {
    showLogin: b.commit(showLogin),
    showLoginRoute: b.commit(showLoginRoute),
    closeModal: b.commit(closeModal),
    connectUser: b.commit(connectUser),
    disconnectUser: b.commit(disconnectUser),
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
  async function connexionSuccess(context: LoginContext, token: string): Promise<void> {
    let userData = await jwtDecode(token);
    console.log(userData);
    LoginModule.mutations.connectUser(userData);
    NotificationsModule.actions.addNotification({ type: "success", message: `Vous etes connecté en tant que ${capitalize(userData.username)}` })
  }
  function disconnectRequest() {
    JWT.clear();
    LoginModule.mutations.disconnectUser();
    NotificationsModule.actions.addNotification({ type: "success", message: `Vous avez été deconnecté` })
  }
  async function checkUserSession() : Promise<void>{
    let token = JWT.fetch();
    if (!!token) {
      let userData = await jwtDecode(token);
      LoginModule.mutations.connectUser(userData);
    } else {
      console.log('User not logged');
    }
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

