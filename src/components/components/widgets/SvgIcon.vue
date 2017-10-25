<template>
  <div class='svg-container' v-html='baseToSvg'></div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator'

@Component({})
export default class SvgIcon extends Vue {

  @Prop({required: true}) icon: string; // base64 svg
  @Prop({required: false}) size: number; 


  get baseToSvg(): string {
    return window.atob(this.icon.split(',')[1]);
  }
}
</script>

<style lang="scss">
  .svg-container{
    display: flex;
    flex: 0 0 auto;
  }
</style>

