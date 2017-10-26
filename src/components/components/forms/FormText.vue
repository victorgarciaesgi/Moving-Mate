<template>
    <div>
      <div class="input-container">
        <input ref='input' class='input-form'
                :type='type'
                :value='value'
                :class='{
                  formError: (!valid && dirty && error),
                  formValid: (valid && dirty && error),
                  icon: icon,
                  big: !!big
                }'
                :placeholder="placeholder"
                :required='required'
                :disabled='disabled'
                @blur='hidePopup()'
                @click='showPopup()'
                @focus='showPopup()'
                @input="updateValue($event.target.value)" />
                
        <img class='input-icon' v-if='icon && !inline' :src="icon">
        <SvgIcon class='input-icon' v-else :src="icon" />

        <div v-if='valid && dirty && error' class="form-valid-icon form-valid"></div>
        <div v-if='!valid && dirty && error' class="form-valid-icon form-invalid"></div>
        <div v-if='!dirty && $v.required' class="form-valid-icon form-required"></div>

        <div class='popup-message' v-if='description || $v.$error' 
            :style='popupPosition'>
          <span v-if='description && !$v.$error'>{{description}}</span>
          <ul v-if='!$v.error' class='error'>
            <li v-for='(key, index) in filterErrors' :key='key'>
              • {{errorMessages[key]}}
            </li>
          </ul>
          <span v-if='$v.$pending' class='info'>Verification...</span>
        </div>

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
  @Prop({required: false}) icon: string;
  @Prop({required: false, default: true}) inline: boolean;
  @Prop({required: false}) big: boolean;
  @Prop({required: false}) $v: IValidator;


  public popupPosition: any = {
    bottom: null,
    left: null,
    width: null,
    display: 'none'
  };
  public errorMessages = {
    required: "Ce champs est requis",
    email: "L'adresse mail doit être valide"
  }

  updateValue(value){
    this.$v.$touch();
    this.$emit('input', value);
  }

  hidePopup() {
     Vue.set(this.popupPosition , 'display', 'none');
  }

  showPopup() {
    let bottom, left, width, height;
    let element = this.$refs['input'];
    width = $(element).outerWidth();
    height = $(element).outerHeight() + 2;
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
      display: 'flex'
    }
  }

  handleScroll() {
    console.log('test')
    Vue.set(this.popupPosition , 'display', 'none');
  }

  get filterErrors() {
    return Object.keys(this.$v.$params).filter(key => !this.$v[key]);
  }

  get valid(){
    return !this.$v.$invalid;
  }

  get dirty(){
    return this.$v.$dirty;
  }


  mounted () {
    window.addEventListener('scroll', this.handleScroll);
  }

  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
</script>



<style lang='scss'>


.input-container{
  display: flex;
  position: relative;
  flex-flow: row wrap;
  justify-content: center;
  flex: 1 1 auto;
  margin: 5px;
  min-width: 250px;

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
    flex: 1 1 auto;
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
    }

    &.formValid + .input-icon svg {
      fill: $mainStyle;
    }

    &.formError + .input-icon svg {
      fill: $red1;
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

    &.icon{
      padding-left: 40px;
    }
  }

  .popup-message {
    position: fixed;
    background-color: white;
    border-radius: 3px;
    box-shadow: 0 0 5px $ombre;
    padding: 10px;
    color: $w110;
    font-weight: bold;
    height: auto;
    width: 100%;
    z-index: 10010;
    font-size: 13px;
    display: none;
    flex-flow: column wrap;

    .error{
      position: relative;
      color: $red1;
    }
    .info {
      color: #ea730b;
    }
  }
}
</style>

