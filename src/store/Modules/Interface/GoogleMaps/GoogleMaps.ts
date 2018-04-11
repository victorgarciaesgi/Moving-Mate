import { timeout } from '@methods';
import Api, { ApiError, ApiSuccess, ApiWarning, ApiResponse } from '../../../Api';
import { storeBuilder } from "../../Store/Store";
import { IGoogleMapsState, IMarker } from '@types';
import { Style1 } from './Styles';
import { MovingStore } from '@store';
import Marker from './Markers';


let mapInstance: google.maps.Map;
let geocoder = new google.maps.Geocoder();

export const getMapInstance= () => {
  return mapInstance;
}

const geoLocate = (address: string) : Promise<any> => {
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
  mapInstance: null,
  markers: []
}

const b = storeBuilder.module<IGoogleMapsState>("GoogleMapsModule", state);
const stateGetter = b.state();

// Getters
namespace Getters {
  export const getters = {}  
}

// Mutations
module Mutations {

  async function renderMap(state: IGoogleMapsState, {mapElement, location}) {
     mapInstance = await new google.maps.Map(mapElement, {
      center: location.location,
      styles: Style1
    });
    mapInstance.fitBounds(location.bounds);
  }
  async function reloadMap(state: IGoogleMapsState, {location}) {
    mapInstance.setCenter(location.location);
    mapInstance.fitBounds(location.bounds);
  }

  async function updateMarkers(state: IGoogleMapsState, markers: IMarker[]) {
    state.markers = markers;
  }



  export const mutations = {
    renderMap: b.commit(renderMap),
    reloadMap: b.commit(reloadMap),
    updateMarkers: b.commit(updateMarkers)
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
    let location;
    if (ville) {
      location = await geoLocate(ville + ', France');
    } else {
      location = await geoLocate('France');
    }
    Mutations.mutations.reloadMap({location});
    const markers = [
      new Marker(location.bounds),
      new Marker(location.bounds),
      new Marker(location.bounds),
    ];
    Mutations.mutations.updateMarkers(markers);
    console.log(location);
    return location.bounds;
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

