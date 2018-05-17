<template>
  <div class="input-box">
    <div class="input-container">
      <input ref='input' class='input-form'
        :id='formId'
        :type='data.type'
        :value='formatedValue'
        :class='{
          formError: (!valid && dirty && data.error && !isPending),
          formValid: (valid && dirty && data.error && !isPending),
          placeholder: isPlaceholderHere,
          icon: data.icon,
        }'
        :disabled='data.disabled'
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

      <img v-if='isPending' class='form-valid-icon' src='~@images/loading.svg'>
      <div v-else-if='valid && dirty && data.error && !isPending' class="form-valid-icon form-valid"></div>
      <div v-else-if='!valid && dirty && data.error && !isPending' class="form-valid-icon form-invalid"></div>
      <div v-else-if='!dirty && required' class="form-valid-icon form-required"></div>

    </div>

    <FormError v-if='vl' :vl='vl' :data='data'/>
  </div>

</template>

<script lang="ts">
import {Prop, Watch} from "vue-property-decorator";
import {Component, Mixin, Mixins} from 'vue-mixin-decorator';
import {FormMixin} from '../Mixins/FormMixin';

@Component({
  mixins: [FormMixin]
})
export default class FormText extends FormMixin {
  
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

