export interface ILoginState {
  id: number,
  name: string,
  surname: string,
  isLoggedIn: boolean,
  isAdmin: boolean,
  status: MovingStatus,
  showModal: boolean,
  reset: () => void
}

export enum MovingStatus {
  Client,
  Demenageur
}