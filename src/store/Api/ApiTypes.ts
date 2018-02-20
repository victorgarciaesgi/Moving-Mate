import { NotificationsStore } from '@store';

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

  constructor(status?: number) {
    this.status = status;
    let message;
    if (status != 401) {
      if (status == 0) message = 'Vérifiez votre connexion Internet';
      else {message = 'Un problème est survenu'}
      NotificationsStore.actions.addNotification({ type: 'warning', message: message })
    } else {
      NotificationsStore.actions.addNotification({ type: 'error', message: `Vous n'avez pas accès à ces informations` })
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