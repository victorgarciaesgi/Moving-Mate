
import { IGlobalState, svgPath } from '@types';
import axios from 'axios';
import { storeBuilder } from "./Store/Store";

//State
const state: IGlobalState = {
  svgMapPaths: [],
  headerBoxShadow: true,
  previousModalRoute: null
}

const b = storeBuilder.module<IGlobalState>("GlobalModule", state);
const stateGetter = b.state();

// Getters
namespace Getters {
  const svgMapReady = b.read(function svgMapReady(state: IGlobalState): boolean {
    return state.svgMapPaths.length > 0;
  })

  export const getters = {
    get svgMapReady() { return svgMapReady()}
  }  
}

// Mutations
namespace Mutations {
  function savePaths(state: IGlobalState, paths: svgPath[]) {
    state.svgMapPaths = paths;
  }

  function setPreviousModalRoute(state: IGlobalState, path: string) {
    state.previousModalRoute = path;
  }

  export const mutations = {
    savePaths: b.commit(savePaths),
    setPreviousModalRoute: b.commit(setPreviousModalRoute)
  }
}

// Actions
namespace Actions {
  async function fetchPaths(context, svgPath: string) {
    if (!context.state.svgMapPaths.length) {
      const response = await axios.get(`/maps/${svgPath}.json`);
      if (response.status == 200) {
        console.log(response)
        Mutations.mutations.savePaths(response.data);
      }
    }
  }

  export const actions = {
    fetchPaths: b.dispatch(fetchPaths)
  }
}

// Module
const GlobalModule = {
  get state() { return stateGetter()},
  getters: Getters.getters,
  mutations: Mutations.mutations,
  actions: Actions.actions
}


export default GlobalModule;

