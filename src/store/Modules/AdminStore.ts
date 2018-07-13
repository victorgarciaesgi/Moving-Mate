import Api, {ApiError, ApiSuccess} from "@api";
import {IAdminState, IUser} from '@types';
import {storeBuilder} from "./Store/Store";
import {LoginStore} from '@modules';
import {Forms} from '@classes';
import Paths from '@paths'

//State
const state: IAdminState= {
  userList: [],
  movingList: []
}

const b = storeBuilder.module<IAdminState>("AdminModule", state);
const stateGetter = b.state()

// Mutations
namespace Mutations {
  function updateUserList(state: IAdminState, users: IUser[]) {
    state.userList = users;
  }
  function updateMovingList(state: IAdminState, users: IUser[]) {
    state.userList = users;
  }

  export const mutations = {
    updateUserList: b.commit(updateUserList),
    updateMovingList: b.commit(updateMovingList)
  }
}

namespace Actions {
  async function getUsers(context){
    try {
      const {data} = await Api.get(Paths.USERS);
      Mutations.mutations.updateUserList(data);
    } catch(e) {
      console.log(e);
    }
  }

  async function getMovings(context) {
    try {
      const {data} = await Api.get(Paths.MOVING_LIST);
      return new ApiSuccess({data})

    } catch(e) {
      console.log(e);
    }
  }

  export const actions = {
    getUsers: b.dispatch(getUsers),
    getMovings: b.dispatch(getMovings)
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
