<template>
  <div class="input-box">
    <div class="input-container">
      <input ref='input' class='input-form'
        :id='formId'
        :type='data.type'
        :value='formatedValue'
        :class='{
          formError: (!valid && dirty && data.error && !vl.$pending),
          formValid: (valid && dirty && data.error && !vl.$pending),
          placeholder: isPlaceholderHere,
          icon: data.icon,
        }'
        :disabled='data.disabled'
        :required='data.required'
        @focus='handleFocus()'
        @blur='handleBlur()'
        @input="updateValue($event.target.value)" />
              
      <div class='input-icon-contain' v-if='data.icon'>
        <img class='input-icon' v-if='data.icon && data.inlineIcon' :src="data.icon">
        <SvgIcon class='input-icon' v-if='data.icon && !data.inlineIcon' :src="data.icon" />
      </div>

      <label :for='formId' class='input-placeholder' :class='{top: isPlaceholderHere}'>
        {{data.placeholder}}
      </label>

      <img v-if='vl.$pending' class='form-valid-icon' src='~@images/loading.svg'>
      <div v-else-if='valid && dirty && data.error && !vl.$pending' class="form-valid-icon form-valid"></div>
      <div v-else-if='!valid && dirty && data.error && !vl.$pending' class="form-valid-icon form-invalid"></div>
      <div v-else-if='!dirty && !vl.required' class="form-valid-icon form-required"></div>

    </div>

    <div class='errorMessage' v-if='((vl.$error && data.error) || vl.$pending)'>
      <span v-if='vl.$pending' class='pending'>Verification...</span>
      <ul v-else-if='dirty && data.error' class='error'>
        <li v-for='key in filterErrors' :key='key'>
            <span>{{errorMessages[key]}}</span>
        </li>
      </ul>
    </div>
  </div>

</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { IValidator } from "vuelidate";
import shortid from 'shortid';
import {timeout} from '@methods';
import {debounce} from 'lodash';

import { SvgIcon } from "@components";

@Component({
  components: {
    SvgIcon
  }
})
export default class FormText extends Vue {
  @Prop({type: [String, Number, null]}) value;
  @Prop({ required: false }) vl: IValidator;

  @Prop({required: true}) data: any;
  

  public formId = null;
  public errorMessages = {
    required: "Ce champs est requis",
    email: "L'adresse mail doit être valide",
    minLength: `${this.vl.$params.minLength ? this.vl.$params.minLength.min : ""} caractères minimum`,
    maxLength: `${this.vl.$params.maxLength ? this.vl.$params.maxLength.max : ""} caractères maximum`,
    sameAs: "Les mots de passe doivent être identiques",
    isMailUnique: 'Cet email est déjà utilisé',
    isNameUnique: 'Ce nom est déjà utilisé',
    phone: 'Le numéro de téléphone doit être valide',
    numeric: 'Ce champs doit être un nombre'
  };

  public isFocused = false;
  public debounceValue = null;

  get filterErrors() {return Object.keys(this.vl.$params).filter(key => !this.vl[key]);}
  get isPlaceholderHere() {return (this.value.length > 0 || this.isFocused);}
  get valid() {return !this.vl.$invalid}
  get dirty() {return this.vl.$dirty;}

  updateValue(value) {
    this.vl.$touch();
    this.$emit("input", value);
  }

  async handleBlur() {
    this.isFocused = false;
  }

  handleFocus() {
    this.isFocused = true;
  }

  mounted() {
    this.formId = shortid.generate();
    if (this.value && this.value.trim().length) {
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
</script>



<style lang='scss' scoped>
  
.input-box {
  display: block;
  position: relative;
  flex: 0 1 auto;
  min-width: 250px;
  width: 100%;
  padding: 5px 0 5px 0;

  .errorMessage {
    display: flex;
    position: relative;
    flex-flow: columns wrap;
    justify-content: flex-start;
    font-size: 11px;
    font-weight: bold;
    color: $red1;
    margin-left: 5px;

    .pending {
      color: $yellow1;
    }

    ul {
      display: flex;
      flex-flow: column wrap;
    }
  }
}

.input-container {
  display: flex;
  position: relative;
  flex-flow: row wrap;

  .input-form {
    position: relative;
    display: block;
    background-color: #e0e1e4;
    color: $mainColor;
    height: 45px;
    padding: 15px 30px 0 15px;
    margin: 5px 0 5px 0;
    transition: all 0.2s;
    width: 100%;
    font-size: 15px;
    border-radius: 5px;
    border: 1px solid transparent;

    &.icon {
      padding-left: 60px;

      & ~ .input-placeholder {
        left: 60px;
      }
    }

    &:not(.placeholder)::-webkit-datetime-edit{ color: transparent; }

    &:focus::-webkit-datetime-edit{ color: $mainColor; } 

    &:focus {
      background-color: #d8d9dd;
    }

    &.formValid {
      ~ .input-icon-contain .input-icon /deep/ svg {
        fill: $mainStyle;
      }
    }

    &.formError {
      ~ .input-icon-contain .input-icon /deep/ svg {
        fill: $red1;
      }
    }
  }

  .input-placeholder {
    position: absolute;
    display: flex;
    align-content: center;
    justify-content: flex-start;
    transition: all 0.2s;
    font-size: 16px;
    font-weight: normal;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: $w150;
    cursor: text;
    
    &.top {
      font-size: 12px;
      top: 16px;
      cursor: default;
    }
  }

  .input-icon-contain {
    position: absolute;
    left: 0;
    top: 0;
    width: 50px;
    height: calc(100% - 26px);
    margin-top: 13px;
    margin-bottom: 13px;
    display: flex;
    overflow: hidden;
    transition: all 0.2s;
    justify-content: center;
    align-items: center;
    border-right: 1px solid $w200;

    .input-icon {
      height: 22px;
      width: 22px;
    }
  }

  /deep/ svg {
    fill: $mainColor;
  }
}
</style>

