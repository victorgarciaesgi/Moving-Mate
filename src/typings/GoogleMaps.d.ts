import {google} from '@types/google-maps';
import {IMovingEvent} from '@types';

export interface IGoogleMapsState {
  markers: IMarker[]
}

export interface IMarker {
  id: string,
  position: {
    lat: number,
    lng: number
  },
  title: string,
  infos: IMovingEvent
}