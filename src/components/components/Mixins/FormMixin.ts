import Vue from 'vue';
import shortid from 'shortid';
import {Prop} from "vue-property-decorator";
import {debounce} from 'lodash';
import {Mixin} from 'vue-mixin-decorator';
import FormError from '../Forms/FormError.vue';
import { SvgIcon } from "@components";


@Mixin({
  components: {
    SvgIcon, FormError
  }
})
export class FormMixin extends Vue {

  @Prop({type: [String, Number, null]}) value: any;
  @Prop({required: false}) vl;
  @Prop({required: true}) data: any;

  public formId = null;
  public isFocused = false;
  public showOptions = false;


  get isPlaceholderHere() {return (this.value.toString().length > 0 || this.isFocused);}
  get valid() {return this.vl?!this.vl.$invalid: null}
  get dirty() {return this.vl?this.vl.$dirty: null}
  get error() {return this.vl?this.vl.$error: null}
  get required() {return this.vl?this.vl.required: null}
  get isPending() {return this.vl?this.vl.$pending: null}

  updateValue(value) {
    if(this.vl) this.vl.$touch();
    this.$emit("input", value);
    this.showOptions = false;
  }

  handleBlur() {
    this.isFocused = false;
  }

  handleFocus() {
    this.isFocused = true;
  }

  forceBlur() {
    this.$refs['input'].blur();
  }

  mounted() {
    this.formId = shortid.generate();
    if (this.value && !!this.vl && this.value.toString().trim().length) {
      this.vl.$touch();
    }
  }

  created() {
    if (this.data.debounce) {
      this.updateValue = debounce(e => {
        this.vl.$touch();
        this.$emit("input", e);
      }, this.data.debounce)
    }
  }

  get formatedValue() {
    const patterns = {
      normal: [2,4,6,8],
      plus: [3,4,6,8,10]
    }
    const regex = /^(?:(?:\+)\d{2})/;
    let paternToUse = patterns.normal;
    if (this.data.type == 'tel') {
      let tempVal = this.value.trim().split(/ +/).join('').split('');
      if (regex.test(this.value)) {paternToUse = patterns.plus};
      paternToUse.forEach((val, index) => {
        if (index + val < tempVal.length) {
          tempVal.splice(index + val, 0, " ");
        }
      })
      return tempVal.join('');
    }
    return this.value;
  }
}