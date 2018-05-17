import Vuex from 'vuex'
import Vue from 'vue';
import Api from "@api";
import {storeBuilder} from "./Store/Store";

Vue.use(Vuex);

//State
const state = {
  oneUser: null
}

const b = storeBuilder.module<any>("UserModule", state);
const stateGetter = b.state()

// Mutations
namespace Mutations {
  function updateOneUser(state, user: Object) {
    state.oneUser = user;
  }

  export const mutations = {
    updateOneUser: b.commit(updateOneUser)
  }
}

namespace Actions {
  async function getOneUser(context) {
    const {data} = await Api.get('profile/');
    Mutations.mutations.updateOneUser(data);

    return data.username;
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
  actions: Actions.actions
}

export default UserModule;
