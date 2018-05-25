import Vuex from 'vuex'
import Vue from 'vue';
import Api, {ApiError, ApiSuccess} from "@api";
import {IUserState, IUserProfile} from '@types';
import {storeBuilder} from "./Store/Store";

Vue.use(Vuex);

//State
const state: IUserState= {
  oneUser: null
}

const b = storeBuilder.module<IUserState>("UserModule", state);
const stateGetter = b.state()

// Mutations
namespace Mutations {
  function updateOneUser(state, user: Object | null) {
    state.oneUser = user;
  }

  export const mutations = {
    updateOneUser: b.commit(updateOneUser)
  }
}

namespace Actions {
  async function getOneUser(context, userId: string){
    if (state.oneUser != null) {
      return {title: state.oneUser.username}
    } else {
      const {data} = await Api.get('profile/');
      Mutations.mutations.updateOneUser(data);
      return {title: data.username};
    }
  }

  export const actions = {
    getOneUser: b.dispatch(getOneUser),
  }
}

// Module
const UserModule = {
  get state() {
    return stateGetter()
  },
  mutations: Mutations.mutations,
  actions: Actions.actions
}

export default UserModule;
