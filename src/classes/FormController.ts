const css = require('@css');



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



  export class Form{
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

    validations() {
      return Object.keys(this.fieldsData).map(m => this.fieldsData[m].validations);
    }
  }

  type FormType = 'text' | 'number' | 'password' | 'checkbox' | 'radio' | 'email' | 'tel' | 'date' | 'time' | 'datetime-local';
  type IOptions = {value: any, text: string};
  type IComponentType = 'FormText' | 'FormField' | 'StarRating' | 'FormSelect' | 'CheckBox' | 'Radio' | 'FormCalendar' | 'FormPlaceSearch' | 'FormUpload'

  interface FormPayload {
    value?: any;
    tempValue?: any;
    icon?: any;
    type?: FormType;
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    required?: boolean;
    inlineIcon?: boolean;
    debounce?: number;
    options?: IOptions[];
    component?: IComponentType;
    noEdit?: boolean;
    validations?: {
      [x:string]: any
    }
    
  }
  class DefaultFormElement {
    value: any;
    tempValue?: any;
    icon?: any;
    type?: FormType;
    placeholder?: string;
    required?: boolean;
    error?: boolean;
    disabled?: boolean;
    inlineIcon?: boolean;
    debounce?: number;
    options?: IOptions[];
    component: IComponentType;
    noEdit?: boolean;
    validations?: {
      [x:string]: any
    }

    constructor({error = true, required = true, noEdit = false, ...fields}: FormPayload) {
      this.value = fields.value != undefined ? fields.value : '';
      this.icon = fields.icon || null;
      this.type = fields.type || 'text';
      this.placeholder = fields.placeholder || `${this.type} input`;
      this.error = error;
      this.disabled = fields.disabled || false;
      this.inlineIcon = fields.inlineIcon || false;
      this.debounce = fields.debounce || null;
      this.required = required;
      this.options = fields.options;
      this.component = fields.component || null;
      this.validations = fields.validations;
      this.tempValue = fields.tempValue
      this.noEdit = noEdit;
    }

    reset() {
      this.value = null;
    }
  }

  export class TextForm extends DefaultFormElement {
    constructor(fields: FormPayload) {
      super({...fields, component: 'FormText'});
    }
  }

  export class FieldForm extends DefaultFormElement {
    constructor(fields: FormPayload) {
      super({...fields, component: 'FormField'});
    }
  }
  export class UploadForm extends DefaultFormElement {
    constructor(fields: FormPayload) {
      super({...fields, component: 'FormUpload'});
    }
  }


  export class PlaceSearchForm extends DefaultFormElement {
    constructor(fields: FormPayload) {
      super({...fields, component: 'FormPlaceSearch'});
    }
  }

  export class CalendarForm extends DefaultFormElement {
    constructor(fields: FormPayload) {
      super({...fields, component: 'FormCalendar'});
    }
  }

  export class Radio extends DefaultFormElement {
    constructor(fields: FormPayload) {
      super({...fields, type: 'radio', component: 'Radio'});
    }
  }

  export class Select extends DefaultFormElement {
    constructor(fields: FormPayload) {
      super({...fields, component: 'FormSelect'});
    }
  }

  export class CheckBox extends DefaultFormElement {
    constructor(fields: FormPayload) {
      super({...fields, type: 'checkbox', component: 'CheckBox'});
    }
  }

  interface StarPayload extends FormPayload {
    starCount?: number,
    baseColor?: string,
    selectedColor?: string,
    hoverColor?: string,
    editable?: boolean,
    init?: number,
    size?: number,
    displayNote?: boolean,
    center?: boolean
  }

  export class StarRating extends DefaultFormElement {
    starCount?: number;
    baseColor?: string;
    selectedColor?: string;
    hoverColor?: string;
    editable?: boolean;
    init?: number;
    size?: number;
    displayNote?: boolean;
    center?: boolean;
    
    constructor(fields: StarPayload) {
      fields.component = 'StarRating';
      super(fields);
      this.starCount = fields.starCount || 5;
      this.baseColor = fields.baseColor || css.yellow2;
      this.selectedColor = fields.selectedColor || css.mainColor;
      this.hoverColor = fields.hoverColor || css.yellow1;
      this.editable = fields.editable != null ? fields.editable : true;
      this.init = fields.init || 0;
      this.size = fields.size || 25;
      this.displayNote = fields.displayNote != null ? fields.displayNote : false;
      this.center = fields.center != null ? fields.center : true
    }
  }
}


