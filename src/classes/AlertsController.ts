import { AlertsStore } from '@store';

export namespace Alerts {
  class Alert {
    public type: "success" | "warning" | "error" | "info";
    public title: string;
    public message?: string;
    public actions;
  }

  export class SuccessAlert extends Alert {
    constructor() {
      super();

    }
  }
}





export namespace Actions {

  type ActionType = "confirm" | "action" | "cancel";
  interface ActionPayload {
    type?: ActionType,
    text?: string,
    trigger?: Function | void | Promise<void | Function>,
    triggers?:(Function | void | Promise<any>)[],
  }
  
  export class Action {
    public type: ActionType;
    public text: string;
    public trigger?: Function | void | Promise<void | Function>;
    public triggers?: (Function | void | Promise<any>)[];

    constructor({type, text, trigger, triggers}: ActionPayload) {
      this.text = text;
      this.type = type;
      this.trigger = trigger;
      this.triggers = triggers;
    }
  }

  export class ConfirmAction extends Action {
    constructor(args: ActionPayload) {
      super(args);
      this.text = args.text ||  "Ça marche!";
      this.type = "confirm";
      if (args.triggers) {
        this.triggers = [
          AlertsStore.actions.hideAlert(true),
          ...args.triggers
        ];
      } else {
        this.trigger = this.trigger = AlertsStore.actions.hideAlert(true);
      }
    }
  }
}

const test = Promise.all([

])
