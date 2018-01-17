export interface INotificationState {
  notificationCount: number;
  notificationList: INotification[];
}


export interface INotification {
  type: INotificationType,
  message: string;
  link?: string;
  id?: number;
  isNotif?: boolean
}

export type INotificationType = "success"| "error" | "warning" | "alert";