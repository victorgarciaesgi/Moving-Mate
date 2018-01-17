import jwtDecode from 'jwt-decode';
import { merge } from 'lodash'
import Api, { ApiError, ApiSuccess, ApiWarning, ApiResponse } from '../Api';
import NotificationsModule from './NotificationsStore'
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
  isAdmin: false,
  status: null,
  userToken: null,
  showModal: false,
  reset() {
    this.name = null;
    this.username = null;
    this.surname = null;
    this.id = null;
    this.isLoggedIn = false;
    this.isAdmin = false;
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

  export const getters = {
    get getFullName() { return b.read(fullName) }
  }
}

// Mutations

namespace Mutations {
  function showLogin(state: ILoginState) {
    state.showModal = true;
  }
  function closeModal(state: ILoginState) {
    state.showModal = false;
  }
  function connectUser(state: ILoginState, userData: Object) {
    state = merge(state, userData);
    state.isLoggedIn = true;
  }
  function disconnectUser(state: ILoginState) {
    state.reset()
  }

  export const mutations = {
    showLoginMutation: b.commit(showLogin),
    closeModalMutation: b.commit(closeModal),
    connectUserMutation: b.commit(connectUser),
    disconnectUserMutation: b.commit(disconnectUser),
  }
}


// Actions

namespace Actions {
  async function connexionRequest(context: LoginContext, loginData): Promise<ApiResponse> {
    let { success, status, data } = await Api.post(LOGIN_URL, loginData);
    if (success) {
      JWT.set(data.token);
      context.dispatch('connexionSuccess', data.token);
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
    userData = merge(userData, { userToken: token });
    LoginModule.mutations.connectUserMutation(userData);
    NotificationsModule.actions.addNotificationAction({ type: "success", message: `Vous etes connecté en tant que ${capitalize(userData.username)}` })
  }
  function disconnectRequest(context: LoginContext) {
    JWT.clear()
    context.commit('disconnectUser');
    NotificationsModule.actions.addNotificationAction({ type: "success", message: `Vous avez été deconnecté` })
  }
  function checkUserSession(context: LoginContext) {
    let token = JWT.fetch();
    if (!!token) {
      LoginModule.mutations.connectUserMutation(token);
    } else {
      console.log('User not logged');
    }
  }

  export const actions = {
    connexionRequestAction: b.dispatch(connexionRequest),
    connexionSuccessAction: b.dispatch(connexionSuccess),
    disconnectRequestAction: b.dispatch(disconnectRequest),
    checkUserSessionAction: b.dispatch(checkUserSession),
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

