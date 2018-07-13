import { IMovingState, IMarker, IMovingEvent} from '@types';
import Api, { ApiError, ApiSuccess, IApiResponse } from '../Api';
import { flatten, isEmpty } from 'lodash';
import { storeBuilder } from "./Store/Store";
import Router from '@router';
import {geoLocate} from './Interface/GoogleMaps/GoogleMaps';
import { GoogleMaps, getMapInstance, NotificationsStore } from '@store';
import Marker from './Interface/GoogleMaps/Markers';
import Paths from '@paths';
import {Forms} from '@classes';



const GEO_API = 'https://geo.api.gouv.fr';
const fields = '&fields=centre,codeDepartement,codeVille,codeRegion,nom';

//State
const state: IMovingState = {
  formSearchData: {
    formSearchValue: '',
    placesResults: [],
    searchCommited: false,
    formSearchCommitedValue: '',
  },
  searchingMovingList: false,
  movingList: [],
  oneAnnouncement: null,
  oneAnnouncementDemandes: null
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
  function updateCommitedValue(state: IMovingState, newString: string) {
    state.formSearchData.searchCommited = true;
    state.formSearchData.formSearchCommitedValue = newString;
  }

  function updateSearchRoute(state: IMovingState, newString: string) {
    if (newString.length) {
      Router.replace(`/moving/search/${newString}`);
    } else {
      Router.replace('/moving')
    }
  }

  function updateSearchingState(state: IMovingState, value: boolean) {
    state.searchingMovingList = value;
  }

  function updateOneAnnouncement(state: IMovingState, movingEvent: Object | null) {
    state.oneAnnouncement = <any>movingEvent;
  }
  function updateOneAnnouncementDemandes(state: IMovingState, movers: Object | null) {
    state.oneAnnouncementDemandes = <any>movers;
  }

  export const mutations = {
    updateMovingList: b.commit(updateMovingList),    
    updateSearchList: b.commit(updateSearchList),
    updateSearchValue: b.commit(updateSearchValue),
    updateCommitedValue: b.commit(updateCommitedValue),
    updateSearchRoute: b.commit(updateSearchRoute),
    updateSearchingState: b.commit(updateSearchingState),
    updateOneAnnouncement: b.commit(updateOneAnnouncement),
    updateOneAnnouncementDemandes: b.commit(updateOneAnnouncementDemandes)
    
  }
}

// Actions
namespace Actions {

  async function fetchMoving(context, payload?: {search?: string}) {
    GoogleMaps.mutations.updateMarkers([]);
    Mutations.mutations.updateSearchingState(true);
    state.formSearchData.searchCommited = true;
    if (isEmpty(payload)) payload.search = state.formSearchData.formSearchValue;
    Mutations.mutations.updateMovingList([]);

    try {
      if (!payload.search) {
        const { data } = await Api.get(Paths.MOVING_LIST, payload);
        Mutations.mutations.updateMovingList(data);
        actions.createMarkers({annoucements: data, payload})
      } else {
        const location = await geoLocate(payload.search);
        // console.log(location.bounds.getCenter().lat(),location.bounds.getCenter().lng())
        const result = await Api.AlgoliaMoving({text: payload.search, lat: location.bounds.getCenter().lat(), lng:location.bounds.getCenter().lng()})
        Mutations.mutations.updateMovingList(result);
        actions.createMarkers({annoucements: result, payload});
      }
    } finally {
      Mutations.mutations.updateSearchingState(false);
    }
  }

  async function createMarkers(context, {annoucements, payload}) {
    console.log(annoucements);
    let markers: IMarker[] = [];
    await getMapInstance();
    const bounds = await GoogleMaps.actions.reCenterMap(payload.search);
    for (let moving of annoucements) {
      markers.push(new Marker(moving))
    }
    GoogleMaps.mutations.updateMarkers(markers);
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

  async function getOneAnnouncement(context, id: string): Promise<IMovingEvent>{
    const {data} = await Api.get(Paths.MOVING_DETAIL + id);
    return data;
  }

  async function getAnnouncementDetails(context, {id, force}: {id: string, force?: boolean}) {
    if (state.oneAnnouncement != null && !force) {
      return {title: state.oneAnnouncement.label}
    } else {
      const {data} = await Api.get(Paths.MOVING_DETAIL + id);
      Mutations.mutations.updateOneAnnouncement(data);
      console.log(data);
      return {title: data.label};
    }
  }
  async function getAnnouncementDemandes(context, id: string) {
    const {data} = await Api.get(`participations/${id}/demand`);
    Mutations.mutations.updateOneAnnouncementDemandes(data);
  }

  async function createAnnouncement(context, form: Object){
    try {
      const {data} = await Api.post(Paths.MOVING_CREATE, form);
      console.log(data)
      return new ApiSuccess({data})

    } catch {
      return new ApiError();
    }
  }

  async function sendUserInfos(context, form: Forms.Form) {
    try {
      console.log(form)
      const {data} = await Api.post(Paths.MOVING_USER_INFOS, form);
      console.log(data);
      return new ApiSuccess();

    } catch {
      return new ApiError();
    }
  }

  async function createParticipation(context, {id, form}:{id: number, form: Forms.Form}) {
    try {
      console.log(form)
      const {data} = await Api.post(`participations/${id}/demand`, form);
      return new ApiSuccess();

    } catch {
      return new ApiError();
    }
  }

  async function createAskHelp(context, {moverId,uuid, form}:{moverId: number,uuid: string, form: Forms.Form}) {
    try {
      console.log(moverId, uuid);
      const {data} = await Api.post(`/participations/${uuid}/invitation/${moverId}`, form);
      return new ApiSuccess();

    } catch {
      return new ApiError();
    }
  }

  async function noteUser(context, {id, form}:{id: number, form: Forms.Form}) {
    try {
      console.log(form)
      const {data} = await Api.post(Paths.CREATE_NOTE + `/${id}`, form);
      NotificationsStore.actions.addNotification({
        type: 'success',
        message: data
      })
      actions.getAnnouncementDetails({id: state.oneAnnouncement.uuid, force: true})
      return new ApiSuccess();

    } catch {
      return new ApiError();
    }
  }

  async function acceptDemande(context, id: number) {
    try {
      const response = await Api.put(`participations/${id}/recruit`);
      return new ApiSuccess();

    } catch {
      return new ApiError();
    }
  }

  async function refuseDemande(context, id: number) {
    try {
      const response = await Api.put(`participations/${id}/refuse`);
      return new ApiSuccess();

    } catch {
      return new ApiError();
    }
  }



  export const actions = {
    fetchMoving: b.dispatch(fetchMoving),
    fetchPlaces: b.dispatch(fetchPlaces),
    fetchUserLocation: b.dispatch(fetchUserLocation),
    createMarkers: b.dispatch(createMarkers),
    createAnnouncement: b.dispatch(createAnnouncement),
    getOneAnnouncement: b.dispatch(getOneAnnouncement),
    getAnnouncementDetails: b.dispatch(getAnnouncementDetails),
    createParticipation: b.dispatch(createParticipation),
    sendUserInfos: b.dispatch(sendUserInfos),
    createAskHelp: b.dispatch(createAskHelp),
    noteUser: b.dispatch(noteUser),
    getAnnouncementDemandes: b.dispatch(getAnnouncementDemandes),
    acceptDemande: b.dispatch(acceptDemande),
    refuseDemande: b.dispatch(refuseDemande)
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

