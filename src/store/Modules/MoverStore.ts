import { IMover, IMoverState} from '@types';
import Api, { ApiError, ApiSuccess, ApiResponse } from '../Api';
import { flatten, isEmpty } from 'lodash';
import { storeBuilder } from "./Store/Store";
import Router from '@router';
import {geoLocate} from './Interface/GoogleMaps/GoogleMaps';
import Paths from '@paths';


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

const b = storeBuilder.module<IMoverState>("MoverModule", state);
const stateGetter = b.state()

// Getters
namespace Getters {

  export const getters = {
  }  
}

// Mutations
namespace Mutations {
  function updateMoverList(state: IMoverState, list: Array<any>) {
    state.moverList = list;
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
      Router.replace(`/movers/search/${newString}`);
    } else {
      Router.replace('/movers/search')
    }
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
        const result = await Api.AlgoliaMovers({text: payload.search, lat: location.location.lat(), lng:location.location.lng()})
        console.log(result);
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

  async function becomeMover(context, form: Object) {
    try {
      const {data} = await Api.postFormData(Paths.NEW_MOVER, form);
      return new ApiSuccess()
    } catch(e) {
      return new ApiError();
    }
  }

  async function recupNoteUser(context, id: string) {
    try {
      const {data} = await Api.get(Paths.CREATE_NOTE + `/${id}`);
      console.log(data);
      return new ApiSuccess({data});
    } catch(e) {
      return new ApiError();
    }
  }

  export const actions = {
    fetchMover: b.dispatch(fetchMover),
    fetchPlaces: b.dispatch(fetchPlaces),
    fetchUserLocation: b.dispatch(fetchUserLocation),
    becomeMover: b.dispatch(becomeMover),
    recupNoteUser: b.dispatch(recupNoteUser)
  }
}

// Module
const MoverModule = {
  get state() { return stateGetter()},
  getters: Getters.getters,
  mutations: Mutations.mutations,
  actions: Actions.actions
}


export default MoverModule;

