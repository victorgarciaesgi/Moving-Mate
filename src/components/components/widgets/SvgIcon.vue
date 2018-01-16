<template>
  <div class='svg-container' v-html='baseToSvg'
    :style='{
      fill: activeColor
    }'>
    
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';

@Component({})
export default class SvgIcon extends Vue {

  @Prop({required: true}) src: string; // base64 svg
  @Prop({required: false}) size: number;
  @Prop({required: false}) color: string;

  get activeColor() {
    return this.color + '!important';
  }

  get baseToSvg(): string {
    return window.atob(this.src.split(',')[1]);
  }
}
</script>

<style lang="scss">
  .svg-container{
    display: flex;
    flex: 0 0 auto;
  }
</style>

