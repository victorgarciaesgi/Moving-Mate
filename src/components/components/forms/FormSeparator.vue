<template>
  <div class='form-separator'>
    <div class='line left'></div>
    <span>
      <slot></slot>
    </span>
    <div class='line right'></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class FormSeparator extends Vue {}
</script>



<style lang='scss' scoped>


.form-separator {
  display: flex;
  width: 100%;
  height: auto;
  flex-flow: row nowrap;
  align-content: center;
  align-items: center;
  justify-content: center;

  .line {
    flex: 1 1 auto;
    height: 1px;
    background-color: $w230;
    border-radius: 3px;
  }

  span {
    padding: 5px;
    font-size: 14px;
    text-transform: uppercase;
    color: $w190;
    flex: 0 0 auto;
  }

}


</style>

