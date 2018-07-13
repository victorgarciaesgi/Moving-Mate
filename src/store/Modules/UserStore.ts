import Api, {ApiError, ApiSuccess} from "@api";
import {IUserState, IUserProfile} from '@types';
import {storeBuilder} from "./Store/Store";
import {LoginStore} from '@modules';
import {Forms} from '@classes';
import Paths from '@paths'

//State
const state: IUserState= {
  oneUser: null,
  myProfile: false,
  notifications: []
}

const b = storeBuilder.module<IUserState>("UserModule", state);
const stateGetter = b.state()

// Mutations
namespace Mutations {
  function updateOneUser(state, user: Object | null) {
    state.oneUser = user;
  }

  function readAllNotifs(state: IUserState) {
    state.notifications.map(m => {
      m.read = true;
      return m;
    })
  }



  export const mutations = {
    updateOneUser: b.commit(updateOneUser),
    readAllNotifs: b.commit(readAllNotifs),
  }
}

namespace Actions {
  async function getOneUser(context, {userId, force}: {userId:string, force?: boolean}){
    try {
      if (state.oneUser != null && state.oneUser.id == userId && !force) {
        return {title: state.oneUser.firstname?state.oneUser.firstname + ' ' + state.oneUser.lastname: state.oneUser.username}
      } else {
        if (LoginStore.state.isLoggedIn && (LoginStore.state.userInfos.id == userId)) {
          const {data} = await Api.get('profile/');
          Mutations.mutations.updateOneUser(data);
          return {title: data.firstname?data.firstname + ' ' + data.lastname: data.username};
        } else {
          const {data} = await Api.get(`user/${userId}`);
          Mutations.mutations.updateOneUser(data);
          return {title: data.firstname?data.firstname + ' ' + data.lastname: data.username};
        }
      }
    } catch(e) {
      console.log(e);
    }
  }

  async function sendUserEdit(context, form: Object) {
    try {
      const {data} = await Api.postFormData('profile/edit', form);
      console.log(data)
      return new ApiSuccess({data})

    } catch {
      return new ApiError();
    }
  }

  export const actions = {
    getOneUser: b.dispatch(getOneUser),
    sendUserEdit: b.dispatch(sendUserEdit)
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
