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
    if (status != 403) {
      // if (status == 0) message = 'Vérifiez votre connexion Internet';
      // NotificationsStore.actions.addNotification({ type: 'warning', message: message })
    } 
    else {
      if (data.message !== 'Bad credentials') {
        LoginStore.actions.disconnectRequest();
      }
    }
  }
}

export class ApiResponse {
  public success: boolean = true;
  public message?: string;
  public data?: any;
  public type: string;
  constructor(fields: {message?: string, data?: any, type: any, success: boolean}) {
    this.message = fields.message;
    this.type = fields.type;
    this.data = fields.data ? fields.data : {};
    this.success = fields.success;
  }
}


export class ApiSuccess extends ApiResponse{
  constructor(fields : {message?: string, data?: any} = {}) {
    super({
      success: true,
      type: 'success',
      message: fields.message,
      data: fields.data
    })
  }
}

export class ApiError extends ApiResponse{
  constructor(fields : {message?: string, data?: any} = {}) {
    super({
      success: false,
      type: 'error',
      message: fields.message,
      data: fields.data
    })
  }
}

export class ApiWarning extends ApiResponse{
  constructor(fields : {message?: string, data?: any} = {}) {
    super({
      success: false,
      type: 'warning',
      message: fields.message,
      data: fields.data
    })
  }
}