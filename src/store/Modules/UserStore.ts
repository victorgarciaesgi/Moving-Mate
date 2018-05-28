import Api, {ApiError, ApiSuccess} from "@api";
import {IUserState, IUserProfile} from '@types';
import {storeBuilder} from "./Store/Store";
import {LoginStore} from '@modules';

//State
const state: IUserState= {
  oneUser: null,
  myProfile: false
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
    try {
      if (state.oneUser != null && state.oneUser.id == userId) {
        return {title: state.oneUser.username}
      } else {
        if (LoginStore.state.isLoggedIn && (LoginStore.state.userInfos.id == userId)) {
          const {data} = await Api.get('profile/');
          Mutations.mutations.updateOneUser(data);
          return {title: data.username};
        } else {
          const {data} = await Api.get(`user/${userId}`);
          Mutations.mutations.updateOneUser(data);
          return {title: data.username};
        }
      }
    } catch(e) {
      console.log(e);
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
