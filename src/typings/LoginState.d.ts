export interface ILoginState {
  id: number,
  name: string,
  username: string,
  surname: string,
  profilePicture: string,
  isLoggedIn: boolean,
  isAdmin: boolean,
  status: MovingStatus,
  userToken: string,
  showModal: boolean,
  init?: void ,
  reset: () => void
}

export enum MovingStatus {
  Client,
  Demenageur
}
