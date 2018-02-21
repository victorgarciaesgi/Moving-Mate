import { IMovingState } from '@types';
import Api, { ApiError, ApiSuccess, ApiWarning, ApiResponse } from '../Api';
import { RootState } from '../index';
import { timeout } from '@methods';
import { storeBuilder } from "./Store/Store";
import $ from 'jquery';
import axios from 'axios';

const MOVING_URL = 'announcements';

//State
const state: IMovingState = {
  formSearchData: {
    formDateEnd: null,
    formDateStart: null,
    formPlace: null,
    placeResults: []
  },
  movingList: []
}

const b = storeBuilder.module<IMovingState>("MovingModule", state);
const stateGetter = b.state()

// Getters
namespace Getters {
  export const getters = {
    
  }  
}

// Mutations
namespace Mutations {
  function updateMovingList(state: IMovingState, list: Array<any>) {
    state.movingList = list;
  }


  export const mutations = {
    updateMovingList: b.commit(updateMovingList)
  }
}

// Actions
namespace Actions {

  async function fetchMoving(context, payload) {
    
    let { data } = await Api.get(MOVING_URL);
    if (data) {
      Mutations.mutations.updateMovingList(data);
    } else {
      return
    }
    
  }

  export const actions = {
    fetchMoving: b.dispatch(fetchMoving)
  }
}

// Module
const MovingModule = {
  get state() { return stateGetter()},
  getters: Getters.getters,
  mutations: Mutations.mutations,
  actions: Actions.actions
}


export default MovingModule;

