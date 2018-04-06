import { timeout } from '@methods';
import Api, { ApiError, ApiSuccess, ApiWarning, ApiResponse } from '../../../Api';
import { storeBuilder } from "../../Store/Store";
import {IGoogleMapsState} from '@types';
import { Style1 } from './Styles';
import { MovingStore } from '@store'


let mapInstance: google.maps.Map;
let geocoder = new google.maps.Geocoder();

const geoLocate = (address) : Promise<any> => {
  return new Promise((resolve, reject) => {
    geocoder.geocode({address: address}, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        resolve({
          location: results[0].geometry.location, 
          bounds: results[0].geometry.bounds})
      } else {
        reject()
      }
    })
  })
}



//State
const state: IGoogleMapsState = {
  mapInstance: null
}

const b = storeBuilder.module<any>("GoogleMapsModule", state);
const stateGetter = b.state();

// Getters
namespace Getters {
  export const getters = {}  
}

// Mutations
module Mutations {
  async function renderMap(state: IGoogleMapsState, {mapElement, location}) {
    mapInstance = new google.maps.Map(mapElement, {
      center: location.location,
      styles: Style1
    });
    mapInstance.fitBounds(location.bounds);
  }
  async function reloadMap(state: IGoogleMapsState, {location}) {
    mapInstance.setCenter(location.location);
    mapInstance.fitBounds(location.bounds);
  }
  export const mutations = {
    renderMap: b.commit(renderMap),
    reloadMap: b.commit(reloadMap)
  }
}

// Actions
namespace Actions {
  async function initMap(context, mapElement: HTMLElement) {
    let location;
    let formSearch = MovingStore.state.formSearchData.formSearchValue;
    if (formSearch) {
      try {
        location = await geoLocate(formSearch + ', France');
      } catch(e) {
        location = await geoLocate('France');
      }
    } 
    else {
      location = await geoLocate('France');
    }
    Mutations.mutations.renderMap({mapElement, location});
  }

  async function reCenterMap(context, ville: string) {
    let location = await geoLocate(ville + ', France');
    console.log(location);
    Mutations.mutations.reloadMap({location});
  }

  export const actions = {
    initMap: b.dispatch(initMap),
    reCenterMap: b.dispatch(reCenterMap)
  }
}

// Module
const GoogleMapsModule = {
  get state() { return stateGetter()},
  getters: Getters.getters,
  mutations: Mutations.mutations,
  actions: Actions.actions
}


export default GoogleMapsModule;

