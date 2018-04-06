export interface ILoginState {
  userInfos: IUser,
  sessionChecked: boolean,
  isLoggedIn: boolean,
  requesting: boolean,
  showModal: boolean,
  RouteAfter: string,
  init?: void,
}


export interface IUser {
  id: string,
  name: string,
  username: string,
  surname: string,
  profile: string,
  status: MovingStatus | null,
  userToken: string,
  roles: Array<IUserRoles>;
  avatar: string,
  avatarName: string,
  description: string,
  lastname: string,
  firstname: string,
  birthdate: string,
}

export type IUserRoles = "ROLE_USER" | "ROLE_ADMIN";

export enum MovingStatus {
  Client,
  Demenageur
}
