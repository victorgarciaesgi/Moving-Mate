import {IAddress, IMovingEvent} from './'

export interface ILoginState {
  userInfos: IUser,
  sessionChecked: boolean,
  isLoggedIn: boolean,
  requesting: boolean,
  showModal: boolean,
  myMovings: {
    Announcements: IMovingEvent[],
    Participations: IMovingEvent[]
  },
  RouteAfter: string,
  init?: void,
}


export interface IUser {
  id: string,
  name: string,
  username: string,
  surname: string,
  profile: string,
  userToken: string,
  roles: Array<IUserRoles>;
  address: IAddress;
  isAvailable: boolean,
  pricePerHour: number,
  isMover: boolean,
  avatar: string,
  avatarName: string,
  phone: string,
  description: string,
  lastname: string,
  firstname: string,
  birthdate: string,
  fullAddress: string,
}

export type IUserRoles = "ROLE_USER" | "ROLE_ADMIN";
