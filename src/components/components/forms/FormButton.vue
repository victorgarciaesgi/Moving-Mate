<template>
  <button @click='emitClick()' :class='[{submitting: submitting, disabled: disabled}, colorClass]'>
    <img v-if='!!icon' :src="icon">
    <span>
      <slot></slot>
    </span>
    <img class='loading' src='~@images/loading.svg'>
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Model } from "vue-property-decorator";

@Component({})
export default class FormButton extends Vue {

  @Prop({required: false}) submitting: boolean;
  @Prop({required: false}) disabled: boolean;
  @Prop({required: false}) icon: string;
  @Prop({required: false}) color: string;

  emitClick(){
    this.$emit('click');
  }

  get colorClass(){
    return this.color?this.color:'';
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
  height: 33px;
  border-radius: 4px;
  margin: 0 5px 0 5px;
  text-align: center;
  cursor: pointer;
  outline: none;
  border: 1px solid transparent;
  padding: 0px 13px 0px 13px;
  @include userselect;

  span{
    font-size: 15px;
    color: $mainColor;
    font-weight: bold;
    text-transform: uppercase;
  }

  .loading{
    display: none;
    margin-left: 6px;
  }

   img{
    height: 17px;
    width: 17px;
  }

  &[disabled='disabled']{
    cursor: not-allowed;
    opacity: 0.7;
  }

  &.submitting .loading{
    display: block;
  }

  &:hover{
    background-color: $w230;
  }

  &:active{
    background-color: $w220;
  }

  &.blue span{
    color: $mainStyle;
  }

  
}

</style>

