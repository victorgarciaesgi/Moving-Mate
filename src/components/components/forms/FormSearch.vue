<template lang='html'>
  <div>
    <div class="input-container">
      <input  class='input-form'
              type='text'
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
              @input="updateValue($event.target.value)" />
              
      <img class='input-icon' v-if='icon && !inline' :src="icon">
      <SvgIcon class='input-icon' v-else :src="icon" />

      <div v-if='valid && dirty && error' class="form-valid-icon form-valid"></div>
      <div v-if='!valid && dirty && error' class="form-valid-icon form-invalid"></div>
      <div v-if='!dirty && $v.required' class="form-valid-icon form-required"></div>
    </div>
    <div class="errorMessage" v-if='!valid && dirty'>
      <span v-if='$v.$error.required && $v.required'>Champs requis</span>
    </div>
    <div class="infoMessage" v-if='$v.$pending'>
      <span>Verification...</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { IValidator } from 'vuelidate';

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
  @Prop({required: false}) required: boolean;
  @Prop({required: false}) icon: string;
  @Prop({required: false, default: true}) inline: boolean;
  @Prop({required: false}) big: boolean;
  @Prop({required: false}) $v: IValidator;

  updateValue(value){
    this.$v.$touch();
    this.$emit('input', value);
  }

  get valid(){
    return !this.$v.$invalid;
  }

  get dirty(){
    return this.$v.$dirty;
  }
}
</script>



<style lang='scss'>


.input-container{
  display: flex;
  position: relative;
  flex-flow: row wrap;

  .input-icon{
    position: absolute;
    left: 9px;
    height: 22px;
    width: 22px;
    top: 50%;
    @include translateY(-50%);
  }

  .input-form:focus + .input-icon svg {
    fill: $g60;
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
    width: 100%;
    margin: 5px 0 5px 0;
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
      & + .input-form-result{
        display: block;
      }
    }

    &.icon{
      padding-left: 40px;
    }
  }

  .errorMessage{
    height: auto;
    width: 100%;
    color: $red1;
    font-size: 13px;

    span{
      padding: 5px;
    }
  }
  .infoMessage{
    @extend .errorMessage;
    color: #ea730b;
  }
}

.input-form-result{
  position: absolute;
  top: calc(100% - 6px);
  left: 0;
  width: 100%;
  height: auto;
  z-index: 3;
  background-color: white;
  box-shadow: 0 0 5px transparentize($g30, 0.7);
  border-radius: 3px;
  overflow: hidden;
  display: flex;

  ul{
    display: flex;
    flex-flow: column nowrap;

    div.error_message{
      height: 30px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    li{
      width: 100%;
      height: 40px;
      border-bottom: 1px solid $w230;
      cursor: pointer;
      color: $g90;

      &:last-child{
        border: none;
      }
    }
  }
}

</style>

