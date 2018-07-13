import {IUser, IMovingEvent} from './'

export interface IAdminState {
  userList: IUser[],
  movingList: IMovingEvent[]
}