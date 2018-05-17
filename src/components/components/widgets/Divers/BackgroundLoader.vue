<template>
  <div ref='root' class='background-loader'
    :style='loaderImg' :class='{blured: smallImgLoaded}'>
    <img v-if='smallImgLoaded && !smallSrc' src="~@images/loading.svg">
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

@Component({})
export default class BackgroundLoader extends Vue {

  @Prop({required: true}) src: string;
  @Prop({required: false}) smallSrc: string;
  @Prop({default: 'jpg'}) extension: string;
  @Prop(Boolean) moving: boolean;

  public smallImgLoaded = false;
  public bigImgLoaded = false;
  public displaySrc = null;

  get loaderImg() {
    return {backgroundImage: `url(${this.displaySrc})`};
  }

  loadImage(src, value) {
    this.smallImgLoaded = value;
    this.displaySrc = src;
  }

  mounted() {
    let smallSrc;
    let bigSrc;
    if (this.moving) {
      smallSrc = require(`@images/${this.src}/${this.src}_lazy.${this.extension}`);
      bigSrc = require(`@images/${this.src}/${this.src}.${this.extension}`);
    } else {
      smallSrc = this.smallSrc;
      bigSrc = this.src;

      this.displaySrc = smallSrc || bigSrc;
    }
    if (smallSrc) {
      let smallImg = new Image();
      smallImg.onload = () => {
        if (!this.bigImgLoaded) {
          this.loadImage(smallSrc, true)
        }
      }
      smallImg.src = smallSrc;
    } else {
      this.smallImgLoaded = true;
    }
    let bigImg = new Image();
    bigImg.onload = () => {
      this.bigImgLoaded = true;
      this.loadImage(bigSrc, false);
    }
    bigImg.src = bigSrc;
  }
}
</script>

<style lang="scss" scoped>

.background-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  @include bg-center;
  transition: filter 0.3s;

  img {
    height: 30px;
    width: 30px;
  }

  .blured {
    filter: blur(50px);
  }
}



</style>

