import { AlertsStore, LoginStore } from '@store';
import {Forms} from './FormController';

export namespace AlertsElement {

  type AlertType = "success" | "confirm" | "warning" | "error" | "info";
  type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];  
  type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;
  type formParam = {
    form: Forms.Form,
    submit: Function
  }

  export class Alert{
    public type: AlertType;
    public title: string;
    public message: string;
    public strict?: boolean;
    public actions: ActionsElements.Action[];
    public formElement?: formParam;

    constructor(fields?:{type: AlertType, title: string, message: string, strict?: boolean, actions: ActionsElements.Action[], formElement?: formParam}) {
      Object.assign(this, fields);
      AlertsStore.actions.addAlert(this);
    }

    async waitResponse() {
      return AlertsStore.actions.addAlert(this);
    }
  }

  export class SuccessAlert extends Alert {
    constructor(fields?: {title: string, message: string, strict?: boolean, actions?: ActionsElements.Action[]}) {
      const actions = fields.actions || [];
      const confirmAction = fields.actions.find(m => m.type == 'confirm')? new ActionsElements.ConfirmAction({}): null

      super({
        title: fields.title || 'Opération réussie',
        type: 'success',
        strict: fields.strict,
        message: fields.message,
        actions: [
          ...actions,
          confirmAction
        ]
      });
    }
  }

  export class ErrorAlert extends Alert {
    constructor(fields?: {title: string, message: string, strict?: boolean, actions?: ActionsElements.Action[]}) {
      const actions = fields.actions || [];
      const confirmAction = fields.actions.find(m => m.type == 'confirm')? new ActionsElements.ConfirmAction({text: 'Rooooh ça marche'}): null
      super({
        title: fields.title || `Erreur de l'opération`,
        type: 'error',
        strict: fields.strict,
        message: fields.message,
        actions: [
          ...actions,
          confirmAction
        ]
      });
    }
  }

  export class FormAlert extends Alert {
    constructor(fields?: {title: string, message: string, formElement: formParam}) {
      const confirmAction = new ActionsElements.ConfirmAction({
        text: 'Valider',
        triggers: [
          () => fields.formElement.submit(fields.formElement.form.getData())
        ]
      })

      super({
        title: fields.title || '',
        type: 'info',
        strict: true,
        formElement: fields.formElement,
        message: fields.message,
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
    public trigger?: Function;
    public triggers?: Function[];

    constructor({type, text, trigger, triggers}: Action) {
      this.text = text;
      this.type = type;
      this.trigger = trigger;
      this.triggers = triggers;
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
