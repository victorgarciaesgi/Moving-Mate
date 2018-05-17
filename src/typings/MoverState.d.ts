import {IUser} from './UserTypes';
import {ICity} from './MovingState';

export interface IMoverState {
  formSearchData: {
    formSearchValue: string,
    placesResults: ICity[],
    searchCommited: boolean,
  },
  searchingMoverList: boolean,
  moverList: IMover[],
}

export interface IMover extends IUser {
  
}