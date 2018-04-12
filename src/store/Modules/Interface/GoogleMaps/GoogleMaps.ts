import { timeout } from '@methods';
import Api, { ApiError, ApiSuccess, ApiWarning, ApiResponse } from '../../../Api';
import { storeBuilder } from "../../Store/Store";
import { IGoogleMapsState, IMarker } from '@types';
import { Style1 } from './Styles';
import { MovingStore } from '@store';


let mapInstance: google.maps.Map;
let geocoder = new google.maps.Geocoder();

export const getMapInstance = async () => {
  if (!mapInstance) {
    await mapPromise;
  }
  return mapInstance;
}
let mapResolver = null;
let mapPromise = new Promise((resolve) => {
  mapResolver = resolve;
});

interface geoLocateResult {
  location: google.maps.LatLng, 
  bounds: google.maps.LatLngBounds
}

const geoLocate = (address: string) : Promise<geoLocateResult> => {
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
  markers: []
}

const b = storeBuilder.module<IGoogleMapsState>("GoogleMapsModule", state);
const stateGetter = b.state();


// Mutations
module Mutations {

  async function renderMap(state: IGoogleMapsState, {mapElement, location}) {
      mapInstance = new google.maps.Map(mapElement, {
        center: location.location,
        styles: Style1,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false
      });
      mapInstance.fitBounds(location.bounds);
      mapResolver();
  }
  async function reloadMap(state: IGoogleMapsState, {location}) {
    await mapPromise;
    mapInstance.setCenter(location.location);
    mapInstance.fitBounds(location.bounds);
  }

  async function updateMarkers(state: IGoogleMapsState, markers: IMarker[]) {
    state.markers = markers;
  }

  function closeMarkers(state: IGoogleMapsState) {
    state.markers.forEach(marker => {
      marker.infoBox.close();
    })
  }



  export const mutations = {
    renderMap: b.commit(renderMap),
    reloadMap: b.commit(reloadMap),
    updateMarkers: b.commit(updateMarkers),
    closeMarkers: b.commit(closeMarkers),
  }
}

// Actions
namespace Actions {

  async function initMap(context, mapElement: HTMLElement) {
    let location: geoLocateResult;
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

  async function reCenterMap(context, ville: string): Promise<google.maps.LatLngBounds>{
    let location: geoLocateResult;
    Mutations.mutations.updateMarkers([]);
    if (ville) {
      location = await geoLocate(ville + ', France');
    } else {
      location = await geoLocate('France');
    }
    Mutations.mutations.reloadMap({location});
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
  // getters: Getters.getters,
  mutations: Mutations.mutations,
  actions: Actions.actions
}


export default GoogleMapsModule;

