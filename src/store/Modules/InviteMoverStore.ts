import { IMover, IMoverState} from '@types';
import Api, { ApiError, ApiSuccess, ApiResponse } from '../Api';
import { flatten, isEmpty } from 'lodash';
import { storeBuilder } from "./Store/Store";
import Router from '@router';
import Marker from './Interface/GoogleMaps/Markers';
import {geoLocate} from './Interface/GoogleMaps/GoogleMaps';
import Paths from '@paths';
import MovingStore from './MovingStore';
import {LoginStore} from './'


const GEO_API = 'https://geo.api.gouv.fr';
const fields = '&fields=centre,codeDepartement,codeVille,codeRegion,nom';

//State
const state: IMoverState = {
  formSearchData: {
    formSearchValue: '',
    placesResults: [],
    searchCommited: false,
  },
  searchingMoverList: false,
  moverList: [],
}

const b = storeBuilder.module<IMoverState>("InviteMoverModule", state);
const stateGetter = b.state()

// Getters
namespace Getters {

  export const getters = {
  }  
}

// Mutations
namespace Mutations {
  function updateMoverList(state: IMoverState, list: Array<IMover>) {
    state.moverList = list.filter(mover => {
      let result = false;
      if (mover.id != LoginStore.state.userInfos.id) result = true;
      if (MovingStore.state.oneAnnouncement.userParticipating) {
        if (MovingStore.state.oneAnnouncement.userParticipating.some(user => user.id == mover.id)) result = false;
      }
      if (MovingStore.state.oneAnnouncement.userNotParticipating) {
        if (MovingStore.state.oneAnnouncement.userNotParticipating.some(user => user.id == mover.id)) result = false;
      }
      return result;
    });
  }

  function updateSearchList(state: IMoverState, list: Array<any>) {
    state.formSearchData.placesResults = list;
  }

  function updateSearchValue(state: IMoverState, newString: string) {
    state.formSearchData.searchCommited = false;
    state.formSearchData.formSearchValue = newString;
  }

  function updateSearchRoute(state: IMoverState, newString: string) {
    if (newString.length) {
      Router.replace(`/moving/detail/${MovingStore.state.oneAnnouncement.uuid}/invite/search/${newString}`);
    } else {
      Router.replace(`/moving/detail/${MovingStore.state.oneAnnouncement.uuid}/invite/search`)
    }
    // Mutations.mutations.updateSearchValue(newString);
  }

  function updateSearchingState(state: IMoverState) {
    state.searchingMoverList = !state.searchingMoverList;
  }

  export const mutations = {
    updateMoverList: b.commit(updateMoverList),
    updateSearchList: b.commit(updateSearchList),
    updateSearchValue: b.commit(updateSearchValue),
    updateSearchRoute: b.commit(updateSearchRoute),
    updateSearchingState: b.commit(updateSearchingState),
  }
}

// Actions
namespace Actions {

  async function fetchMover(context, payload?: {search?: string}) {
    Mutations.mutations.updateSearchingState();
    state.formSearchData.searchCommited = true;
    if (isEmpty(payload)) payload.search = state.formSearchData.formSearchValue;
    Mutations.mutations.updateMoverList([]);

    try {
      if (!payload.search) {
        const { data } = await Api.get(Paths.MOVERS_LIST, payload);
        console.log(data);
        Mutations.mutations.updateMoverList(data);
      } else {
        const location = await geoLocate(payload.search);
        console.log(location.location.lat(), location.location.lng());
        const result = await Api.AlgoliaMovers({text: payload.search, lat: location.bounds.getCenter().lat(), lng:location.bounds.getCenter().lng()})
        Mutations.mutations.updateMoverList(result);
      }
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
    fetchMover: b.dispatch(fetchMover),
    fetchPlaces: b.dispatch(fetchPlaces),
    fetchUserLocation: b.dispatch(fetchUserLocation),
  }
}

// Module
const InviteMoverModule = {
  get state() { return stateGetter()},
  getters: Getters.getters,
  mutations: Mutations.mutations,
  actions: Actions.actions
}


export default InviteMoverModule;

