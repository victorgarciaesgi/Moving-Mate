export interface ILoginState {
  userInfos: {
    id: string,
    name: string,
    username: string,
    surname: string,
    profile: string,
    status: MovingStatus | null,
    userToken: string,
    roles: Array,
  },
  sessionChecked: boolean,
  isLoggedIn: boolean,
  requesting: boolean,
  showModal: boolean,
  RouteAfter: string,
  init?: void,
  reset: () => void
}

export enum MovingStatus {
  Client,
  Demenageur
}
