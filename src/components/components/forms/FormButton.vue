<template>
  <button @mousedown.prevent='emitClick($event)'  @click='emitClick($event)' :type='type' :class='[{submitting: submitting, disabled: disabled}, colorClass]'>
    <img v-if='!!icon' :src="icon">
    <span :style='{color}'>
      <slot></slot>
    </span>
    <SvgIcon class='loading' :src='require("@images/loading.svg")' :size='17' />
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop, Model } from "vue-property-decorator";
import SvgIcon from '@components/widgets/Divers/SvgIcon.vue';

@Component({
  components: {
    SvgIcon
  }
})
export default class FormButton extends Vue {

  @Prop({required: false}) submitting: boolean;
  @Prop({required: false}) disabled: boolean;
  @Prop({required: false, default: 'button'}) type: string;
  @Prop({required: false}) icon: string;
  @Prop({required: false}) theme: string;
  @Prop({required: false}) color: string;
  
  public css = require('@css');

  emitClick(event: Event) {
    if (!this.submitting && !this.disabled) {
      this.$emit('click');
    } else{
      event.preventDefault();
    }
  }

  get colorClass(){
    return this.theme || '';
  }

}
</script>



<style lang='scss' scoped>

button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex: 0 0 auto;
  height: auto;
  border-radius: 4px;
  margin: 0 5px 0 5px;
  text-align: center;
  cursor: pointer;
  outline: none;
  border: 1px solid transparent;
  padding: 6px 13px 6px 13px;
  transition: all 0.3s;
  @include userselect;

  span{
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    font-size: 15px;
    color: $mainColor;
    font-weight: bold;
    text-transform: uppercase;

    /deep/ img, .svg-container {
      margin-right: 5px;
    }
  }

  .loading{
    display: none;
    margin-left: 6px;

    /deep/ svg{
      margin-top: 2px;
    }
  }

  &.disabled{
    cursor: not-allowed;
    opacity: 0.7;
  }

  &.submitting {
    cursor: wait;
    .loading{
      display: flex;
    }
  }

  &:hover{background-color: $w240;}

  &:active{background-color: $w220;}

  &.blue span{
    color: $mainStyle;
  }
  &.red span{
    color: $red1;
  }
}

</style>

