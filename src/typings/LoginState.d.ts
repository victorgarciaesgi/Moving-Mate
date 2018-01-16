export interface ILoginState {
  id: string,
  name: string,
  username: string,
  surname: string,
  profilePicture: string,
  isLoggedIn: boolean,
  isAdmin: boolean,
  status: MovingStatus | null,
  userToken: string,
  showModal: boolean,
  init?: void ,
  reset: () => void
}

export enum MovingStatus {
  Client,
  Demenageur
}
