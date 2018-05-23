<template>
  <div ref='root' class='background-loader' :class='{loaded: bigImgLoaded}'>
    <transition name='fade' mode='out-in'>
      <div v-if='bigImgLoaded' class='cover' :style='loaderImg'></div>
      <img v-else src="~@images/loading_white.svg">
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Watch} from 'vue-property-decorator';

@Component({
  props: ['src']
})
export default class BackgroundLoader extends Vue {

  @Prop({default: 'jpg'}) extension: string;
  @Prop(Boolean) moving: boolean;

  public src;

  public bigImgLoaded = false;
  public displaySrc = null;

  get loaderImg() {
    return {backgroundImage: `url(${this.displaySrc})`};
  }

  @Watch('src') watchSrc(newVal, oldVal) {
    this.bigImgLoaded = false;
    this.displaySrc = null;
    let smallSrc;
    let bigSrc;
    if (this.moving) {
      bigSrc = require(`@images/${this.src}/${this.src}.${this.extension}`);
    } else {
      bigSrc = this.src;
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
  }



  mounted() {
    
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

  // &.loaded {
  //   background-color: transparent;
  // }

  .cover {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    @include bg-center;
    width: 100%;
  }

  img {
    height: 30px;
    width: 30px;
  }
}



</style>

