import { Actions } from '@classes';


export interface IAlertsState {
  alertShow: boolean;
  alertData: IAlert;
}


export interface IAlert {
  type: IAlertType,
  message: string,
  title?: string,
  strict?: boolean,
  actions?: Actions.Action[];
}

export interface IAlertAction {
  type: IActionType;
  text: string;
  trigger?: Function;
  triggers?: Function[];
}

export type IAlertType = "success"| "error" | "warning" | "alert";
export type IActionType = "confirm" | "cancel" | "link" | "info" | "action";