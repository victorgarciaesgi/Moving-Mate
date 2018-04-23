<template>
  <div class='Form-message'>
    <div class='border-content'>
      <div class='title'>
        <slot name='title'></slot>
      </div>
      
      <div class='content'>
        <slot></slot>
      </div>
    </div>
  </div>

</template>

<script lang="ts">


import Vue from 'vue'
import {Component, Prop, Watch } from 'vue-property-decorator';

@Component({})
export default class FormMessage extends Vue {


}



</script>

<style lang="scss" scoped>


.Form-message {
  display: flex;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  margin: 0 0 10px 0;
  border-radius: 3px;
  overflow: hidden;
  font-size: 14px;
  

  .border-content {
    border-left: 5px solid $mainStyle;
    justify-content: center;
    align-content: center;
    align-items: center;
    padding: 10px;
    flex-flow: column wrap;

    .title {
      flex: 0 0 auto;
      display: flex;
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .content {
      color: $w120;
    }
  }

}
</style>
