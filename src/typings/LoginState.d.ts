export interface ILoginState {
  id: number,
  name: string,
  surname: string,
  isLoggedIn: boolean,
  isAdmin: boolean,
  status: MovingStatus,
  showConnexion: boolean,
  reset: () => void
}

export enum MovingStatus {
  Client,
  Demenageur
}
