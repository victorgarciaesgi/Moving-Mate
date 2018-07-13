<template>
  <div ref='root' class='background-loader' :class='{loaded: bigImgLoaded, blur, user}'>
    <transition name='fade' mode='out-in'>
      <img v-if="bigImgLoaded && !!absolute" class='image' :src="displaySrc">
      <div v-else-if='bigImgLoaded' class='cover' :style='loaderImg'></div>
      <img v-else class='icon' src="~@images/loading_white.svg">
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Watch} from 'vue-property-decorator';
import { isAbsolute } from 'path';

@Component({
  props: ['src', 'absolute', 'blur', 'user']
})
export default class BackgroundLoader extends Vue {

  @Prop({default: 'jpg'}) extension: string;
  @Prop(Boolean) moving: boolean;
  @Prop() absolute: boolean;
  @Prop() user: boolean;
  @Prop() src; 
  @Prop() blur: boolean

  public bigImgLoaded = false;
  public displaySrc = null;

  get loaderImg() {
    return {backgroundImage: `url('${this.displaySrc}')`};
  }

  @Watch('src') watchSrc(newVal, oldVal) {
    this.bigImgLoaded = false;
    this.displaySrc = null;
    let smallSrc;
    let bigSrc;
    if (this.moving) {
      bigSrc = require(`@images/${newVal}/${newVal}.${this.extension}`);
    } else {
      bigSrc = newVal;
      this.displaySrc = bigSrc;
    }
    let bigImg = new Image();
    bigImg.onload = () => {
      this.loadImage(bigSrc);
    }
    bigImg.src = bigSrc;
  }

  loadImage(src) {
    this.bigImgLoaded = true;
    this.displaySrc = src;
    this.$emit('loaded')
  }

  mounted() {
    this.watchSrc(this.src, null);
  }
}
</script>

<style lang="scss" scoped>

.background-loader {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: $g90;
  transition: all 0.3s;
  min-height: 200px;
  max-height: 100%;
  overflow: hidden;

  &.user {
    position: absolute;
    top: 0;
    left: 0;
  }

  &.blur {
    .cover {filter: blur(30px);}
  }

  .image {
    width: 100%;
    height: auto;
  }

  .cover {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    width: 100%;
  }

  .icon {
    height: 30px;
    width: 30px;
  }
}



</style>

