import Api, {ApiError, ApiSuccess} from "@api";
import {IAdminState, IUser, IMovingEvent} from '@types';
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
  function updateMovingList(state: IAdminState, movings: IMovingEvent[]) {
    state.movingList = movings;
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
      const {data} = await Api.get('/announcements/admin/list');
      Mutations.mutations.updateMovingList(data);
      return new ApiSuccess({data})
    } catch(e) {
      console.log(e);
    }
  }

  async function toggleUser(context, id: string) {
    try {
      const {data} = await Api.put(`/user/admin/${id}`);
      actions.getUsers();
      return new ApiSuccess({data})
    } catch(e) {
      console.log(e);
    }
  }

  async function toggleMoving(context, uuid: string) {
    try {
      const {data} = await Api.put(`/announcements/admin/${uuid}`);
      actions.getMovings();
      return new ApiSuccess({data})
    } catch(e) {
      console.log(e);
    }
  }

  export const actions = {
    getUsers: b.dispatch(getUsers),
    getMovings: b.dispatch(getMovings),
    toggleUser: b.dispatch(toggleUser),
    toggleMoving: b.dispatch(toggleMoving)
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
