import {google} from '@types/google-maps';
import {IMovingEvent} from '@types';

export interface IGoogleMapsState {
  markers: IMarker[],
  googleMarkerList: google.maps.Marker[],
  mapReady: boolean
}

export interface IMarker {
  id: string,
  position: {
    lat: number,
    lng: number
  },
  title: string,
  infos: IMovingEvent,
  infoBox: google.maps.InfoWindow,
}