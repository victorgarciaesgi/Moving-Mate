<template>
  <div ref='root' class='lazy-blur-background'>
    <div class='placeholder' v-if='!smallImgLoaded'>
      <slot></slot>
    </div>
    <img :src='smallImgSrc' class='imgPlaceHolder'>
    <img class='img-small lazy' :class='{loaded: smallImgLoaded}' :src='smallImgSrc' @load='handleSmallLoaded()'>
    <img :class='{loaded: bigImgLoaded}' :src='bigImgSrc' @load='handleBigLoaded()' class='lazy'>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

@Component({})
export default class BlurLoader extends Vue {

  @Prop({required: true}) src: string;
  @Prop({required: false}) smallSrc: string;
  @Prop({default: 'jpg'}) extension: string;
  @Prop(Boolean) moving: boolean;

  public smallImgSrc = null;
  public bigImgSrc = null;
  public smallImgLoaded = false;
  public bigImgLoaded = false;

  handleSmallLoaded() {
    this.smallImgLoaded = true;
  }

  handleBigLoaded() {
    console.log('big loaded')
    this.bigImgLoaded = true;
  }

  mounted() {
    if (this.moving) {
      this.smallImgSrc = require(`@images/${this.src}/${this.src}_lazy.${this.extension}`);
      this.bigImgSrc = require(`@images/${this.src}/${this.src}.${this.extension}`);
    } else if(this.smallSrc) {
      this.smallImgSrc = this.smallSrc;
      this.bigImgSrc = this.src;
    } else {
      throw new Error('No small image source specified');
    }
  }
}
</script>

<style lang="scss" scoped>

.lazy-blur-background {
  position: relative;
  overflow: hidden;

  img.lazy {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    transition: opacity 1s linear;

    &.loaded {
      opacity: 1;
    }
  }

  img.imgPlaceHolder {
    position: relative;
    width: 100%;
    height: auto;
    opacity: 0;
  }

  .img-small {
    filter: blur(50px);
    transform: scale(1);
  }

  .placeholder {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    height: 100%;
    background-color: rgb(60,60,60);
  }
}



</style>

