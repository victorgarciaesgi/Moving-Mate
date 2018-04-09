import { AlertsStore } from '@store';

export namespace AlertsElement {

  type AlertType = "success" | "warning" | "error" | "info";

  export class Alert {
    public type: AlertType;
    public title: string;
    public message: string;
    public strict?: boolean;
    public actions: ActionsElements.Action[]

    constructor({actions, message, title, type}: Alert) {
      this.actions = actions;
      this.message = message;
      this.title = title;
      this.type = type;
    }
  }

  // export class SuccessAlert extends Alert {
  //   constructor({}) {
  //     super();
      
  //   }
  // }
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
      this.type = "confirm";
      if (triggers) {
        this.triggers = [
          AlertsStore.mutations.hideAlert,
          ...triggers
        ];
      } else {
        this.trigger = this.trigger = AlertsStore.mutations.hideAlert;
      }
    }
  }
}
