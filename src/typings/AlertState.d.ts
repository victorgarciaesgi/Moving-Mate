import { Actions, Alerts } from '@classes';


export interface IAlertsState {
  alertShow: boolean;
  alertData: Alerts.Alert;
}