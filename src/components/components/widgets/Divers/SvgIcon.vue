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
import {Component, Prop} from 'vue-property-decorator';

@Component({
  name:'SvgIcon'
})
export default class SvgIcon extends Vue {

  public defaultColor = '#5a5a5a'
  @Prop({required: true}) src: string; // base64 svg
  @Prop({required: false, default: 24}) size: number;
  @Prop({required: false, default: '#5a5a5a', type: [String, Object]}) color;

  get activeColor() {
    if (typeof this.color == 'string') {
      return this.color + '!important';
    } else {
      let keys = Object.keys(this.color);
      let filtered = keys.filter(key => this.color[key]);
      return filtered[0] || this.defaultColor  + '!important';
    }
  }

  get baseToSvg(): string {
    try {
      let svg = window.atob(this.src.split(',')[1]);
      
      return svg;
    }
    catch {
      console.error(`Le fichier source passé au composant n'est pas une image svg`)
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

