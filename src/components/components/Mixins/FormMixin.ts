import Vue from 'vue';
import shortid from 'shortid';
import {Prop, Watch} from "vue-property-decorator";
import {debounce} from 'lodash';
import {Mixin} from 'vue-mixin-decorator';
import FormError from '../forms/FormError.vue';
import SvgIcon from "../widgets/Divers/SvgIcon.vue";


@Mixin({
  components: {
    SvgIcon, FormError
  },
  props: ['value', 'vl', 'data']
})
export class FormMixin extends Vue {

  @Prop({required: true}) value: any;
  @Prop({required: false}) vl;
  @Prop({required: true}) data: any;

  public formId = null;
  public isFocused = false;
  public initialValue = null;
  public showOptions = false;
  public css = require('@css');


  get isPlaceholderHere() {return (this.value.toString().length > 0 || this.isFocused);}
  get valid() {return this.vl?!this.vl.$invalid: null}
  get dirty() {return this.vl?this.vl.$dirty: null}
  get error() {return this.vl?this.vl.$error: null}
  get required() {return this.vl?this.vl.$params.required: null}
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

  @Watch('value') valueChanged(newVal, oldVal) {
    if (this.data.editMode) {
      if (newVal == this.initialValue) this.vl.$reset()
    }
  }

  mounted() {
    this.formId = shortid.generate();
    if (this.value && !!this.vl && this.value.toString().trim().length) {
      if (this.vl && !this.data.editMode) this.vl.$touch();
      else if (this.data.editMode) {
        this.initialValue = this.value;
      }
    }
  }

  created() {
    if (this.data.debounce) {
      this.updateValue = debounce(e => {
        if (this.vl && !this.data.editMode) this.vl.$touch();
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