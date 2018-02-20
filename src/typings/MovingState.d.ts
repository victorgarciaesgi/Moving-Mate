import {IMoverState} from './MoverState'

export interface IMovingState {
  formSearchData: {
    formPlace: ICity;
    formDateStart: string;
    formDateEnd: string;
    placeResults: ICity[]
  },
  movingList: IMovingEvent[],
}

export interface IMovingEvent {
  id: number,
  user: Object,
  participations: IMoverState[],
  label: string,
  pricePerHourPerUser: number,
  description: string,
  enabled: true,
  addressIn: string,
  addressOut: string,
  elevatorOut: boolean,
  volumeOut: number,
  volumeScaleOut: string,
  parkingOut: true,
  elevatorIn: true,
  volumeIn: number,
  volumeScaleIn: string,
  parkingIn: true,
  dealDays: string,
  createdAt: Date,
  updatedAt: Date
}

export interface ICity {
  nom: string,
  code: string;
  codeDepartement: string;
  codeRegion: string;
  codePostaux: string[],
}