import { NotificationsStore, LoginStore } from '@store';

export class AxiosSuccess {
  public success: boolean = true;
  public status: number;
  public data: any;

  constructor(data: any) {
    this.data = data;
  }
}

export class AxiosError {
  public success: boolean = false;
  public status: number;
  public data: any;

  constructor(status: number, data?: any) {
    this.status = status;
    this.data = data;
    if (status != 401) {
      // if (status == 0) message = 'Vérifiez votre connexion Internet';
      // NotificationsStore.actions.addNotification({ type: 'warning', message: message })
    } 
    else {
      if (data.message !== 'Bad credentials') {
        LoginStore.actions.disconnectRequest();
        // NotificationsStore.actions.addNotification({ type: 'error', message: message })
      }
    }
  }
}

export type ApiResponse = ApiSuccess | ApiError | ApiWarning;

export class ApiSuccess {
  public success: boolean = true;
  public message: string;
  public data?: any;
  public type?: string = 'success';

  constructor(message?: string, data?: any) {
    this.message = message;
    this.data = data ? data : {};
  }
}

export class ApiError {
  public success: boolean = false;
  public message: string;
  public type?: string = 'error';

  constructor(message?: string) {
    this.message = message;
  }
}

export class ApiWarning {
  public success: boolean = false;
  public message: string;
  public type?: string = 'warning';

  constructor(message?: string) {
    this.message = message;
  }
}