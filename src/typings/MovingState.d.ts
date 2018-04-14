import {IMoverState} from './MoverState'

export interface IMovingState {
  formSearchData: {
    formSearchValue: string,
    placesResults: ICity[],
    searchCommited: boolean,
  },
  searchingMovingList: boolean,
  movingList: IMovingEvent[],
}

export interface IMovingEvent {
  announcementId: number,
  username: string;
  userId: number;
  participations: IMoverState[],
  label: string,
  pricePerHourPerUser: number,
  description: string,
  enabled: true,
  addressIn: string,
  addressInZip: string,
  addressOut: string,
  addressOutZip: string,
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

export interface IMovingUser {
  id: string,
  name: string,
  username: string,
  surname: string,
  profile: string,
  avatar: string,
  avatarName: string,
  description: string,
  lastname: string,
  firstname: string,
}

export interface IAddress {
  id: number,
  addressCity: string,
  addressZip: string,
  addressCountry: string,
  addressAdditional: string,
  volume: number,
  floor: string,
  elevator: boolean,
  houseType: string,
  createdAt: number,
  updatedAt: number
}

export interface ICity {
  nom: string,
  code: string;
  codeDepartement: string;
  codeRegion: string;
  codePostaux: string[],
  centre: {
    type: string,
    coordinates: [number, number]
  }
}