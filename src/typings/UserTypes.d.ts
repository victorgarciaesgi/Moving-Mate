import {IMovingEvent} from './'

export interface IUserState {
  oneUser: IUserProfile;
  myProfile: boolean,
  notifications: INotif[]
}



export interface IUserProfile {
  id: string,
  announcements: IMovingEvent[],
  participations: IMovingEvent[],
  nbrCommentaires: number,
  name: string,
  username: string,
  isAvailable: boolean,
  surname: string,
  phone: string,
  note: number,
  profile: string,
  userToken: string,
  rating: number,
  roles: Array<IUserRoles>,
  comments: any,
  commentsPosted: any;
  countAnnouncements: number,
  countParticipations: number,
  isPremium: boolean,
  isMover: boolean,
  fullAddress: string,
  pricePerHour: number,
  avatar: string,
  avatarName: string,
  description: string,
  lastname: string,
  firstname: string,
  birthdate: string,
  city: string;
  zipcode: string;
}

export interface INotif {
  id: number,
  type: 'invitation' | 'success' | 'fail',
  read: boolean,
  createdAt: number,
  text: string,
  content: {
    userFrom?: {
      avatar: string,
      id: number,
      firstname: string,
    }
    announcementUuId?: string,
    participationId?: number,
  }
}