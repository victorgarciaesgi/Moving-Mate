import { timeout } from '@methods';
import Api, { ApiError, ApiSuccess, ApiWarning, ApiResponse } from '../../../Api';
import { storeBuilder } from "../../Store/Store";
import { IGoogleMapsState, IMarker } from '@types';
import { Style1 } from './Styles';
import { MovingStore } from '@store';
import axios from 'axios';


let mapInstance: google.maps.Map;
let geocoder = new google.maps.Geocoder();
const placesAutocomplete = new google.maps.places.AutocompleteService();
const PLACES_API = `https://maps.googleapis.com/maps/api/place/details/json?language=fr&type=address&key=AIzaSyBNEvF2wA8myZMLMTC6uTmVSdvb-Ajac-Q&input=`;
// param input

export const getMapInstance = async (): Promise<google.maps.Map> => {
  if (!mapInstance) {
    await mapPromise;
  }
  return mapInstance;
}
let mapResolver = null;
let mapPromise = null;

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
  markers: [],
  googleMarkerList: [],
}

const b = storeBuilder.module<IGoogleMapsState>("GoogleMapsModule", state);
const stateGetter = b.state();


// Mutations
module Mutations {

  async function renderMap(state: IGoogleMapsState, {mapElement, location}) {
    mapPromise = new Promise((resolve) => {
      mapResolver = resolve;
    });
    mapInstance = new google.maps.Map(mapElement, {
        center: location.location,
        styles: Style1,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        scrollwheel: false
      });
    mapResolver();
    google.maps.event.addDomListener(mapInstance, 'idle', mapResolver);
    mapInstance.fitBounds(location.bounds);
  }
  async function reloadMap(state: IGoogleMapsState, {location}) {
    const instance = await getMapInstance();
    instance.setCenter(location.location);
    instance.fitBounds(location.bounds);
  }

  async function updateMarkers(state: IGoogleMapsState, markers: IMarker[]) {
    state.markers = markers;
  }

  function closeMarkers(state: IGoogleMapsState) {
    state.markers.forEach(marker => {
      marker.infoBox.close();
    })
  }

  function deleteMarkersFromMap(state: IGoogleMapsState) {
    state.googleMarkerList.forEach(m => m.setMap(null));
  }

  function addMarkersFromMap(state: IGoogleMapsState, marker: google.maps.Marker) {
    state.googleMarkerList.push(marker);
  }



  export const mutations = {
    renderMap: b.commit(renderMap),
    reloadMap: b.commit(reloadMap),
    updateMarkers: b.commit(updateMarkers),
    closeMarkers: b.commit(closeMarkers),
    deleteMarkersFromMap: b.commit(deleteMarkersFromMap),
    addMarkersFromMap: b.commit(addMarkersFromMap),
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
    await getMapInstance();
    Mutations.mutations.updateMarkers([]);
    if (ville) {
      location = await geoLocate(ville + ', France');
    } else {
      location = await geoLocate('France');
    }
    Mutations.mutations.reloadMap({location});
    return location.bounds;
  }

  async function querySearch(context, query: string) : Promise<any> {
    return new Promise((resolve, reject) => {
      placesAutocomplete.getPlacePredictions({
        input: query, types: ['address'],
        componentRestrictions: {country: 'fr'}}, 
        (result) => {
          console.log(result);
          resolve(result);
      })
    })
  }


  
  export const actions = {
    initMap: b.dispatch(initMap),
    reCenterMap: b.dispatch(reCenterMap),
    querySearch: b.dispatch(querySearch)
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

