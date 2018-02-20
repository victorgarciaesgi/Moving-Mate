<template>
  <div class='svg-container' v-html='baseToSvg'
    :class='{relative: size}'
    :style='{
      fill: activeColor,
      width: `${size}px`,
      height: `${size}px`
    }'>
    
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';

const css = require('@css');

@Component({})
export default class SvgIcon extends Vue {

  @Prop({required: true}) src: string; // base64 svg
  @Prop({required: false}) size: number;
  @Prop({required: false, default: 'rgb(130,130,130)'}) color: string;

  get activeColor() {
    return this.color + '!important';
  }

  get baseToSvg(): string {
    try {
      let svg = window.atob(this.src.split(',')[1]);
      return svg;
    }
    catch {
      console.error(`Le fichier source passé au composant n'est pas un fichier svg`)
      return;
    }
  }
}
</script>

<style lang="scss">
  .svg-container{
    display: flex;
    flex: 0 0 auto;

    &.relative svg {
      height: 100%;
      width: 100%;
    }
  }
</style>

