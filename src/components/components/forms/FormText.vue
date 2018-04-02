<template>
  <div class="input-box">
    <label v-if='label && placeholder' :class='{formError: (!valid && dirty && error)}'>
      {{placeholder}}
    </label>
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
              
      <div class='input-icon-contain'>
        <img class='input-icon' v-if='icon && !inline' :src="icon">
        <SvgIcon class='input-icon' v-if='icon && inline' :src="icon" />
      </div>

      <div v-if='valid && dirty && error' class="form-valid-icon form-valid"></div>
      <div v-if='!valid && dirty && error' class="form-valid-icon form-invalid"></div>
      <div v-if='!dirty && !vl.required' class="form-valid-icon form-required"></div>

      <div class='popup-message' v-if='description && popupPosition.display'
          :style='popupPosition'>
        <span v-if='description && !vl.$error' class='description'>{{description}}</span>
        <div class='triangle'></div>
      </div>
    </div>

    <div class='errorMessage' v-if='(vl.$error && error) || description || vl.$pending'>
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

  public popupPosition: any = {
    bottom: null,
    left: null,
    width: null,
    display: false
  };
  public errorMessages = {
    required: "Ce champs est requis",
    email: "L'adresse mail doit être valide",
    minLength: `${
      this.vl.$params.minLength ? this.vl.$params.minLength.min : ""
    } caractères minimum`,
    maxLength: `${
      this.vl.$params.maxLength ? this.vl.$params.maxLength.max : ""
    } caractères maximum`,
    sameAs: "Les mots de passe doivent être identiques"
  };

  updateValue(value) {
    this.vl.$touch();
    this.$emit("input", value);
  }

  hidePopup() {
    Vue.set(this.popupPosition, "display", false);
  }

  showPopup() {
    let element = this.$refs["input"];
    let width = $(element).outerWidth();
    let height = $(element).outerHeight() + 12;
    let viewportOffset = element.getBoundingClientRect();
    let windowHeight = $(window).height();
    let position = {
      left: Math.round(viewportOffset.left),
      bottom: windowHeight - Math.round(viewportOffset.bottom) + height
    };
    this.popupPosition = {
      bottom: position.bottom + "px",
      left: position.left + "px",
      width: width + "px",
      display: true
    };
  }

  mounted() {
    if (this.value.trim().length) {
      this.vl.$touch();
    }
  }

  get filterErrors() {
    return Object.keys(this.vl.$params).filter(key => !this.vl[key]);
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
    border-bottom: 1px solid $w220;
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
  justify-content: center;

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

  .input-form {
    position: relative;
    background-color: #e0e1e4;
    color: $mainColor;
    height: 45px;
    padding: 5px 30px 5px 9px;
    margin: 5px 0 5px 0;
    transition: all 0.2s;
    width: 100%;
    line-height: 30px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid transparent;

    &.icon {
      padding-left: 60px;
    }

    &:focus {
      border-color: $g90;
      background-color: $w245;
      & + .input-form-result {
        display: block;
      }
    }

    &.formValid {
      &:focus {
        border-color: lighten($mainStyle, 10%);
      }
      ~ .input-icon-contain .input-icon /deep/ svg {
        fill: $mainStyle;
      }
    }

    &.formError {
      &:focus {
        border-color: lighten($red1, 10%);
      }
      ~ .input-icon-contain .input-icon /deep/ svg {
        fill: $red1;
      }
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

