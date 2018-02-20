import {IMovingEvent} from './MovingState';

export interface IUser {
  id: number,
  username: string,
  avatar: string,
  avatarName: string,
  description: string,
  lastname: string,
  firstname: string,
  birthdate: Date,
  pricePerHour: number,
  participations: IMovingEvent[]
}