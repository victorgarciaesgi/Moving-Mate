export interface ILoginState {
  id: string,
  name: string,
  username: string,
  surname: string,
  profile: string,
  isLoggedIn: boolean,
  roles: Array,
  status: MovingStatus | null,
  userToken: string,
  requesting: boolean
  showModal: boolean,
  RouteAfter: string,
  init?: void,
  reset: () => void
}

export enum MovingStatus {
  Client,
  Demenageur
}
