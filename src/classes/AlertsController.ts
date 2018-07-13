import { AlertsStore, LoginStore } from '@store';
import {Forms} from './FormController';

import Router from '@router';

export namespace AlertsElement {

  type AlertType = "success" | "confirm" | "warning" | "error" | "info" | "form";
  type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];  
  type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;
  type formParam = {
    form: Forms.Form,
    validations?: {
      [x:string]: any
    },
    submit: {
      params: {[x:string]: any},
      trigger: Function
    }
  }

  export class Alert{
    public type: AlertType;
    public title: string;
    public message?: string;
    public strict?: boolean;
    public actions: ActionsElements.Action[];
    public formElement?: formParam;
    public onClose?: Function[]

    constructor(fields?:{type: AlertType, title: string, message?: string, strict?: boolean, actions: ActionsElements.Action[], formElement?: formParam, onClose?: Function[]}) {
      Object.assign(this, fields);
      AlertsStore.actions.addAlert(this);
    }

    async waitResponse() {
      return AlertsStore.actions.addAlert(this);
    }
  }

  export class SuccessAlert extends Alert {
    constructor(fields?: {title: string, message?: string, strict?: boolean, actions?: ActionsElements.Action[], onClose?: Function[]}) {
      const actions = fields.actions || [];
      const confirmAction = (fields.actions && fields.actions.find(m => m.type == 'confirm')) ? undefined : new ActionsElements.ConfirmAction({})
      console.log(fields.actions)
      super({
        title: fields.title || 'Opération réussie',
        type: 'success',
        strict: fields.strict,
        message: fields.message,
        onClose: fields.onClose,
        actions: [
          ...actions,
          confirmAction
        ]
      });
    }
  }

  export class ErrorAlert extends Alert {
    constructor(fields?: {title: string, message?: string, strict?: boolean, actions?: ActionsElements.Action[], onClose?: Function[]}) {
      const actions = fields.actions || [];
      console.log(fields.actions)
      const confirmAction = (fields.actions && fields.actions.find(m => m.type == 'confirm')) ? undefined : new ActionsElements.ConfirmAction({text: 'Fermer'})
      super({
        title: fields.title || `Erreur de l'opération`,
        type: 'error',
        strict: fields.strict,
        message: fields.message,
        onClose: fields.onClose,
        actions: [
          ...actions,
          confirmAction
        ]
      });
    }
  }

  export class FormAlert extends Alert {
    constructor(fields?: {title: string, message?: string, strict?:boolean, formElement: formParam, onClose?: Function[]}) {
      const confirmAction = new ActionsElements.ConfirmAction({
        text: 'Valider',
        triggers: [
          () => fields.formElement.submit.trigger({form: fields.formElement.form.getData(), ...fields.formElement.submit.params})
        ]
      })

      super({
        title: fields.title || '',
        type: 'form',
        strict: fields.strict,
        formElement: fields.formElement,
        message: fields.message,
        onClose: fields.onClose,
        actions: [
          confirmAction,
          new ActionsElements.CancelAction()
        ]
      });
    }
  }
}






export namespace ActionsElements {

  type ActionType = "confirm" | "action" | "cancel" | "link";

  export class Action {
    public type: ActionType;
    public text: string;
    public to?: {path: string} | {name: string, params?: {[x: string]: any}};
    public trigger?: Function;
    public triggers?: Function[];

    constructor({type, text, trigger, triggers, to}: Action) {
      this.text = text;
      this.type = type;
      this.trigger = trigger;
      this.triggers = triggers;
      this.to = to;
    }
  }

  export class ConfirmAction extends Action {
    constructor({text, triggers}: {text?: string, triggers?: Function[]}) {
      super({
        text: text ||  "Ça marche!",
        type: "confirm",
      });
      if (triggers) {
        this.triggers = [
          ...triggers,
          AlertsStore.mutations.confirmAlert,
        ];
      } else {
        this.trigger = this.trigger = AlertsStore.mutations.confirmAlert;
      }
    }
  }

  export class LinkAction extends Action {
    constructor({text, to}: {text: string, to: {path: string} | {name: string, params?: {[x: string]: any}}}) {
      super({
        text: text,
        to: to,
        type: "link",
      });
    }
  }

  export class LoginAction extends Action {
    constructor() {
      super({
        text: "Se connecter",
        type: "action",
        triggers: [
          LoginStore.mutations.showLogin,
          AlertsStore.actions.hideAlert
        ]
      });
    }
  }
  export class CancelAction extends Action {
    constructor() {
      super({
        text: "Annuler",
        type: "cancel",
        trigger: AlertsStore.mutations.cancelAlert
      });
    }
  }

  export const triggers = {
    close() {
      return AlertsStore.mutations.hideAlert()
    }
  }
}
