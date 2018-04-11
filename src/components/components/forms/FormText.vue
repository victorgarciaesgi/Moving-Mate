<template>
  <div class="input-box">
    <div class="input-container">
      <input ref='input' class='input-form'
        :id='formId'
        :type='type'
        :value='value'
        :class='[{
          formError: (!valid && dirty && error),
          formValid: (valid && dirty && error),
          icon,
          big: !!big,
        }, design]'
        :required='required'
        :disabled='disabled'
        @focus='handleFocus()'
        @blur='handleBlur()'
        @input="updateValue($event.target.value)" />
              
      <div class='input-icon-contain'>
        <img class='input-icon' v-if='icon && !inline' :src="icon">
        <SvgIcon class='input-icon' v-if='icon && inline' :src="icon" />
      </div>

      <label :for='formId' class='input-placeholder' :class='{top: isPlaceholderHere}'>
        {{placeholder}}
      </label>

      <div v-if='valid && dirty && error' class="form-valid-icon form-valid"></div>
      <div v-if='!valid && dirty && error' class="form-valid-icon form-invalid"></div>
      <div v-if='!dirty && !vl.required' class="form-valid-icon form-required"></div>

      <div class='popup-message' v-if='description && popupPosition.display'
          :style='popupPosition'>
        <span v-if='description && !vl.$error' class='description'>{{description}}</span>
        <div class='triangle'></div>
      </div>
    </div>

    <div class='errorMessage' v-if='((vl.$error && error) || description || vl.$pending) && showError'>
      <span v-if='description && !vl.$error' class='description'>{{description}}</span>
      <ul v-if='!vl.error && dirty && error' class='error'>
        <li v-for='key in filterErrors' :key='key'>
            <span>{{errorMessages[key]}}</span>
        </li>
      </ul>
      <span v-if='vl.$pending' class='info'>Verification...</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { IValidator } from "vuelidate";
import $ from "jquery";
import shortId from 'shortid';
import {timeout} from '@methods';

import { SvgIcon } from "@components";

@Component({
  components: {
    SvgIcon
  }
})
export default class FormText extends Vue {
  @Prop() value: string;
  @Prop({ required: false, default: "text" }) type: string;
  @Prop({ required: false }) placeholder: string;
  @Prop({ required: false, default: true }) label: boolean;
  @Prop({ required: false, default: true }) error: boolean;
  @Prop({ required: false }) disabled: boolean;
  @Prop({ required: false }) description: string;
  @Prop({ required: false, default: true }) required: boolean;
  @Prop({ required: false, default: null }) icon: string;
  @Prop({ required: false, default: true }) inline: boolean;
  @Prop({ required: false }) big: boolean;
  @Prop({ required: false }) design: string;
  @Prop({ required: false }) vl: IValidator;

  public formId = shortId.generate();

  public popupPosition: any = {
    bottom: null,
    left: null,
    width: null,
    display: false
  };
  public errorMessages = {
    required: "Ce champs est requis",
    email: "L'adresse mail doit être valide",
    minLength: `${this.vl.$params.minLength ? this.vl.$params.minLength.min : ""} caractères minimum`,
    maxLength: `${this.vl.$params.maxLength ? this.vl.$params.maxLength.max : ""} caractères maximum`,
    sameAs: "Les mots de passe doivent être identiques"
  };
  public showError = false;
  public isFocused = false;

  updateValue(value) {
    this.vl.$touch();
    this.$emit("input", value);
  }

  async handleBlur() {
    this.isFocused = false;
    await timeout(100);
    this.showError = false;
  }

  handleFocus() {
    this.showError = true;
    this.isFocused = true;
  }

  mounted() {
    if (this.value.trim().length) {
      this.vl.$touch();
    }
  }

  get filterErrors() {
    return Object.keys(this.vl.$params).filter(key => !this.vl[key]);
  }

  get isPlaceholderHere() {
    return (this.value.length > 0 || this.isFocused);
  }

  get valid() {
    return !this.vl.$invalid;
  }

  get dirty() {
    return this.vl.$dirty;
  }
}
</script>



<style lang='scss' scoped>
.input-box {
  display: block;
  position: relative;
  flex: 1 1 auto;
  min-width: 250px;
  padding: 5px 0 5px 0;
  max-width: 450px;

  label {
    font-weight: bold;
    color: $w110;
    font-size: 15px;

    &.formError {
      color: $red1;
    }
  }

  &:last-child {
    .errorMessage {
      border: none;
    }
  }

  .errorMessage {
    display: flex;
    position: relative;
    flex-flow: row wrap;
    justify-content: center;
    text-align: center;
    font-size: 13px;
    font-weight: bold;
    margin-top: 5px;
    padding-bottom: 10px;
    border-bottom: 1px solid $w240;
    color: $red1;

    ul {
      display: flex;
      flex-flow: column wrap;
      align-items: center;
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
    padding: 15px 30px 0 0;
    margin: 5px 0 5px 0;
    transition: all 0.2s;
    width: 100%;
    font-size: 14px;
    border-radius: 5px;
    border: 1px solid transparent;

    &.icon {
      padding-left: 60px;
    }

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

    &.white {
      background-color: white;
      box-shadow: 0 0 10px $ombre;
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
    left: 60px;
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

  .popup-message {
    position: fixed;
    background-color: $w250;
    border-radius: 5px;
    box-shadow: 0 0 10px transparentize($g0, 0.7);
    padding: 10px;
    color: $g90;
    font-weight: bold;
    height: auto;
    width: 100%;
    z-index: 10010;
    font-size: 13px;
    display: flex;
    flex-flow: column wrap;
    align-self: center;
    text-align: center;

    .error {
      color: $red1;
    }
    .info {
      color: $yellow1;
    }

    .triangle {
      position: absolute;
      z-index: 10009;
      top: 100%;
      left: 50%;
      @include translateX(-50%);
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid $w250;
      filter: drop-shadow(0px 6px 4px rgba(50, 50, 50, 0.1));
    }
  }
}
</style>

