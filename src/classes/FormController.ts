



export namespace Forms {

  function extractValues(_this, _fieldsData, fields) {
    for (let prop in fields) {
      if (fields[prop] instanceof DefaultFormElement) {
        _this[prop] = fields[prop].value;
        const {value, ...rest} = fields[prop];
        _fieldsData[prop] = rest;
      } else {
        _this[prop] = {};
        _fieldsData[prop] = {};
        extractValues(_this[prop], _fieldsData[prop], fields[prop]);
      }
    }
  }

  export class Form {
    public initialState: any;
    public fieldsData = {};

    constructor(fields: Object) {
      extractValues(this, this.fieldsData, fields);
      this.initialState = fields;
    }


    reset() {
      const form = new Form(this.initialState);
      Object.keys(form).forEach(key => {
        this[key] = form[key];
      });
    }

    getData() {
      const _this = Object.assign({}, this);
      delete _this.fieldsData;
      delete _this.initialState;
      return _this;
    }
  }

  type FormType = 'text' | 'password' | 'checkbox' | 'radio' | 'email' | 'tel'

  interface FormPayload {
    value?: any;
    icon?: any;
    type?: FormType;
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    required?: boolean;
    inlineIcon?: boolean;
    debounce?: number;
    
  }
  class DefaultFormElement {
    value: any;
    icon?: any;
    type?: FormType;
    placeholder?: string;
    required?: boolean;
    error?: boolean;
    disabled?: boolean;
    inlineIcon?: boolean;
    debounce?: number;

    constructor({error = true, required = true, ...fields}: FormPayload) {
      this.value = fields.value || '';
      this.icon = fields.icon || null;
      this.type = fields.type || 'text';
      this.placeholder = fields.placeholder || `${this.type} input`;
      this.error = error;
      this.disabled = fields.disabled || false;
      this.inlineIcon = fields.inlineIcon || false;
      this.debounce = fields.debounce || null;
      this.required = required;
    }

    reset() {
      this.value = null;
    }
  }

  export class TextForm extends DefaultFormElement {
    constructor(fields: FormPayload) {
      super(fields);
    }
  }
}


