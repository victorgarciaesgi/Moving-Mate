export namespace Forms {

  export class Form {
    public initialState: any;

    constructor(fields: Object) {
      for (let prop in fields) {
        this[prop] = prop;
      }
      this.initialState = fields;
    }

    reset() {
      for (let prop in this.initialState) {
        this[prop] = this.initialState[prop];
      }
    }
  }

  interface FormPayload {
    value?: any;
    icon?: any;
    type?: 'text' | 'password';
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    inlineIcon?: boolean;
    debounce?: number;
    
  }
  class DefaultFormElement {

    constructor(fields: FormPayload) {

    }
  }
}


