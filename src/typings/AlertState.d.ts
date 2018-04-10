import { ActionsElements, AlertsElement } from '@classes';


export interface IAlertsState {
  alertShow: boolean;
  alertData: AlertsElement.Alert;
}