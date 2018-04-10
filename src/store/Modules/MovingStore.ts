import { IMovingState, ICity } from '@types';
import Api, { ApiError, ApiSuccess, ApiWarning, ApiResponse } from '../Api';
import { RootState } from '../index';
import { timeout } from '@methods';
import { flatten, isEmpty } from 'lodash';
import { storeBuilder } from "./Store/Store";
import Router from '@router';
import { GoogleMaps } from '@store';

const MOVING_URL = 'announcements';
const GEO_API = 'https://geo.api.gouv.fr';
const fields = '&fields=centre,codeDepartement,codeVille,codeRegion,nom'

//State
const state: IMovingState = {
  formSearchData: {
    formSearchValue: '',
    placesResults: [],
    searchCommited: false,
  },
  searchingMovingList: false,
  movingList: []
}

const b = storeBuilder.module<IMovingState>("MovingModule", state);
const stateGetter = b.state()

// Getters
namespace Getters {

  const formatedMovingList = b.read(function formatedMovingList(state) {
    return state.movingList;
  })

  export const getters = {
    get formatedMovingList() {return formatedMovingList()}
  }  
}

// Mutations
namespace Mutations {
  function updateMovingList(state: IMovingState, list: Array<any>) {
    state.movingList = list;
  }

  function updateSearchList(state: IMovingState, list: Array<any>) {
    state.formSearchData.placesResults = list;
  }

  function updateSearchValue(state: IMovingState, newString: string) {
    state.formSearchData.searchCommited = false;
    state.formSearchData.formSearchValue = newString;
  }

  function updateSearchRoute(state: IMovingState, newString: string) {
    Router.replace(`/moving/search/${newString}`);
    // Mutations.mutations.updateSearchValue(newString);
  }

  function updateSearchingState(state: IMovingState) {
    state.searchingMovingList = !state.searchingMovingList;
  }

  export const mutations = {
    updateMovingList: b.commit(updateMovingList),
    updateSearchList: b.commit(updateSearchList),
    updateSearchValue: b.commit(updateSearchValue),
    updateSearchRoute: b.commit(updateSearchRoute),
    updateSearchingState: b.commit(updateSearchingState),
  }
}

// Actions
namespace Actions {

  async function fetchMoving(context, payload?: {search?: string}) {
    Mutations.mutations.updateSearchingState();
    state.formSearchData.searchCommited = true;
    if (isEmpty(payload)) payload.search = state.formSearchData.formSearchValue;
    GoogleMaps.actions.reCenterMap(payload.search);
    Mutations.mutations.updateMovingList([]);
    try {
      let { data } = await Api.get(MOVING_URL, payload);
      Mutations.mutations.updateMovingList(data);
    } finally {
      Mutations.mutations.updateSearchingState();
    }
  }

  async function fetchPlaces(context, payload: string) {
    let searchValues = await Promise.all([
      Api.get(`${GEO_API}/communes?nom=${payload}&boost=population${fields}`),
      Api.get(`${GEO_API}/departements?nom=${payload}${fields}`),
      Api.get(`${GEO_API}/regions?nom=${payload}${fields}`),
    ])
    let filteredValues = flatten(searchValues.map(m => m.data))
      .map(m => {
        if (m.codeDepartement && m.codeRegion) {m.type = 'ville';}
        else if (m.codeRegion) { m.type = 'departement';}
        else  {m.type = 'region'}
        return m;
      })
      .sort((a, b) => b._score - a._score)
      .filter((item, pos, self) => self.findIndex(elem => elem.nom == item.nom) == pos)
      .slice(0, 4);
    Mutations.mutations.updateSearchList(filteredValues);
  }

  async function fetchUserLocation(context) {
    return await new Promise((resolve, reject) => {
      try {
        navigator.geolocation.getCurrentPosition(async(position) => {
          let {data} = await Api.get(`${GEO_API}/communes?lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
          Mutations.mutations.updateSearchRoute(data[0].nom);
          Actions.actions.fetchMoving({});
          resolve();
        }, (err) => {
          console.log(err);
          reject();
        }, {maximumAge: 0});
      } catch(e) {
        console.log(e)
        reject(e);
      }
    })
  }

  export const actions = {
    fetchMoving: b.dispatch(fetchMoving),
    fetchPlaces: b.dispatch(fetchPlaces),
    fetchUserLocation: b.dispatch(fetchUserLocation)

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

