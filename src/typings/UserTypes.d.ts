export interface IUserState {
  oneUser: IUserProfile;
}



export interface IUserProfile {
  id: string,
  name: string,
  username: string,
  surname: string,
  profile: string,
  userToken: string,
  roles: Array<IUserRoles>,
  pricePerHour: number,
  avatar: string,
  avatarName: string,
  description: string,
  lastname: string,
  firstname: string,
  birthdate: string,
  city: string;
  zip: string;
}