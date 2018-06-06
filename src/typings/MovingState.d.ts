import {IMover} from './MoverState'

export interface IMovingState {
  formSearchData: {
    formSearchValue: string,
    placesResults: ICity[],
    searchCommited: boolean,
    formSearchCommitedValue: string
  },
  searchingMovingList: boolean,
  movingList: IMovingEvent[],
  oneAnnouncement: IMovingEvent
}

export interface IMovingEvent {
  id: number,
  user: IMovingUser,
  participations: {
    users: IMovingUser[]
  },
  label: string,
  addressIn: IAddress,
  addressOut: IAddress,
  pricePerHourPerUser: number,
  menRequired: number,
  description: string,
  enabled: boolean,
  staticMap: string,
  helpType: number,
  volume: number,
  dealDate: number,
  createdAt: Date,
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
  type: "Maison" | "Appartement",
  volume: number,
  value: string,
  city: string,
  zip: number,
  additional: string,
  latitude: number,
  longitude: number,
  floor: number,
  elevator: boolean
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