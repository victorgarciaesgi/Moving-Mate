<template>
    <div class="input-box">
      <div class="input-container">
        <input ref='input' class='input-form'
                :type='type'
                :value='value'
                :class='[{
                  formError: (!valid && dirty && error),
                  formValid: (valid && dirty && error),
                  icon,
                  big: !!big,
                }, design]'
                :placeholder="placeholder"
                :required='required'
                :disabled='disabled'
                @blur='hidePopup()'
                @click='showPopup()'
                @focus='showPopup()'
                @input="updateValue($event.target.value)" />
                
        <img class='input-icon' v-if='icon && !inline' :src="icon">
        <SvgIcon class='input-icon' v-if='icon && inline' :src="icon" />

        <div v-if='valid && dirty && error' class="form-valid-icon form-valid"></div>
        <div v-if='!valid && dirty && error' class="form-valid-icon form-invalid"></div>
        <div v-if='!dirty && vl.required' class="form-valid-icon form-required"></div>

        <div class='popup-message' v-if='description && popupPosition.display'
            :style='popupPosition'>
          <span v-if='description && !vl.$error' class='description'>{{description}}</span>
          <!-- <ul v-if='!vl.error && dirty && error' class='error'>
            <li v-for='(key, index) in filterErrors' :key='key'>
               <span>{{errorMessages[key]}}</span>
            </li>
          </ul>
          <span v-if='vl.$pending' class='info'>Verification...</span> -->

          <div class='triangle'></div>
        </div>

      </div>

      <div class='errorMessage'>
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
import { IValidator } from 'vuelidate';
import $ from 'jquery';

import { SvgIcon } from '@components';

@Component({
  components: {
    SvgIcon
  }
})
export default class FormText extends Vue {

  @Prop() value: string;
  @Prop({required: false, default: 'text'}) type: string;
  @Prop({required: false}) placeholder: string;
  @Prop({required: false, default: true}) error: boolean;
  @Prop({required: false}) disabled: boolean;
  @Prop({required: false}) description: string;
  @Prop({required: false, default: true}) required: boolean;
  @Prop({required: false, default: null}) icon: string;
  @Prop({required: false, default: true}) inline: boolean;
  @Prop({required: false}) big: boolean;
  @Prop({required: false}) design: string;
  @Prop({required: false}) vl: IValidator;


  public popupPosition: any = {
    bottom: null,
    left: null,
    width: null,
    display: false
  };
  public errorMessages = {
    required: "Ce champs est requis",
    email: "L'adresse mail doit être valide",
    minLength: `${this.vl.$params.minLength?this.vl.$params.minLength.min:""} caractères minimum`,
    maxLength: `${this.vl.$params.maxLength?this.vl.$params.maxLength.max:""} caractères maximum`,
    sameAs: "Les mots de passe doivent être identiques"
  }

  updateValue(value){
    this.vl.$touch();
    this.$emit('input', value);
  }

  hidePopup() {
     Vue.set(this.popupPosition , 'display', false);
  }

  showPopup() {
    let element = this.$refs['input'];
    let width = $(element).outerWidth();
    let height = $(element).outerHeight() + 12;
    let viewportOffset = element.getBoundingClientRect();
    let windowHeight = $(window).height();
    let position = {
      left: Math.round(viewportOffset.left),
      bottom: (windowHeight - Math.round(viewportOffset.bottom) + height)
    }
    this.popupPosition =  {
      bottom: position.bottom + "px",
      left: position.left + "px",
      width: width + "px",
      display: true
    }
  }

  handleScroll() {
    Vue.set(this.popupPosition , 'display', false);
  }

  get filterErrors() {
    return Object.keys(this.vl.$params).filter(key => !this.vl[key]);
  }

  get valid(){
    return !this.vl.$invalid;
  }

  get dirty(){
    return this.vl.$dirty;
  }

  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  }

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
</script>



<style lang='scss' >

.input-box {
  display: block;
  position: relative;
  flex: 1 1 auto;
  min-width: 250px;
  max-width: 450px;


  .errorMessage {
    display: flex;
    position: relative;
    flex-flow: row wrap;
    justify-content: center;
    font-size: 13px;
    font-weight: bold;
    margin-top: 5px;
    color: $red1;
  }
}


.input-container{
  display: flex;
  position: relative;
  flex-flow: row wrap;
  justify-content: center;
  margin: 5px;

  .input-icon{
    position: absolute;
    left: 9px;
    height: 22px;
    width: 22px;
    top: 50%;
    @include translateY(-50%);
  }


  svg {
    fill: $g90;
  }

  .input-form {
    position: relative;
    background-color: $w230;
    border: 1px solid transparent;
    color: $g60;
    height: 40px;
    padding: 5px 30px 5px 9px;
    margin: 5px 0 5px 0;
    width: 100%;
    line-height: 30px;
    font-size: 15px;
    border-radius: 3px;

    &.big{
      height: 50px;
      font-size: 18px;
      border-radius: 5px;
    }

    &:focus{
      background-color: $w225;
      &~ .input-icon svg {
        fill: $g60;
      }
      & + .input-form-result{
        display: block;
      }
    }

    &.formValid ~ .input-icon svg {
      fill: $mainStyle;
    }

    &.formError ~ .input-icon svg {
      fill: $red1;
    }

    &.icon{
      padding-left: 40px;
    }

    &.white {
      background-color: white;
      box-shadow: 0 0 10px $ombre;
    }
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

    .error{
      color: $red1;
    }
    .info {
      color: $yellow1;
    }

    .triangle{
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
      filter: drop-shadow(0px 6px 4px rgba(50,50,50, 0.1));
    }
  }
}
</style>

