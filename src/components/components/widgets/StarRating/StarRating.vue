<template>
  <div class='star-component'>
    <div class="star-container" @mouseleave='leave()'>
      <div class="starRating"
          v-for='(index) in starCount' :key='index' 
          :style='getSize'
          :class='getActiveClass(index)' 
          >
        <SvgIcon :src='getActiveImage(index)' 
          :color='getActiveColor(index)'
          :size='size'/>
        <template v-if='editable'>
          <div class="part" @mouseenter="hover(index - 0.5)" @click="set(index - 0.5)"></div>
          <div class="part" @mouseenter="hover(index)" @click="set(index)"></div>
        </template>
      </div>
    </div>

    <div class="star-displayNumber" v-if='displayNote'>
      {{ (hoverCount != 0?(hoverCount):'-') }} / {{starCount}}
    </div>
    <div class="star-displayCount" v-if='displayNote && noteCount'>
      {{noteCount}} {{noteCount > 1?'notes':'note'}}
    </div>
    
    <template v-if='vl'>
      <div v-if='!vl.$dirty && !displayNote' class="form-valid-icon form-required"></div>
      <div v-if='!vl.$invalid && vl.$dirty && !displayNote' class="form-valid-icon form-valid"></div>
      <div v-if='vl.$invalid && vl.$dirty && !displayNote' class="form-valid-icon form-invalid"></div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { IValidator } from "vuelidate";
import SvgIcon from '../Divers/SvgIcon.vue';
const css = require('@css');


@Component({
  components: {
    SvgIcon: SvgIcon
  }
})
export default class StarRating extends Vue {
  @Prop({required: false}) value: number;
  @Prop({ default: 5 }) starCount: number;
  @Prop({ default: false }) required: boolean;
  @Prop({ default: css.fontColor}) baseColor: string;
  @Prop({ default: css.mainColor}) selectedColor: string;
  @Prop({ default: 25}) size: number;
  @Prop({ default: true }) editable: boolean;
  @Prop({ default: 0 }) init: number;
  @Prop({ required: false}) noteCount: number;
  @Prop({ default: false }) displayNote: boolean;
  @Prop({ required: false}) vl: IValidator;

  public rating: number = 0; 
  public hoverCount: number = 0;
  public hoverStar: boolean = false;
  public rated: boolean = false;
  public starImages = {
    empty: require('./assets/star_empty.svg'),
    half: require('./assets/star_half.svg'),
    full: require('./assets/star_full.svg'),
  }

  get getSize() {
    return {
      height: `${this.size}px`,
      width: `${this.size}px`,
    }
  }

  get getActiveColor() {
    return index => {
      if (this.editable) {
        return (!this.hoverStar && this.vl?this.vl.$dirty:false)?this.selectedColor:this.baseColor;
      } else {
        return this.baseColor;
      }
    }
  }

  get getActiveImage() {
    return index => {
      let activeClass = this.getActiveClass(index);
      let [image] = Object.keys(activeClass).filter(m => activeClass[m]);
      return this.starImages[image];
    }
  }

  get getActiveClass() {
    return index => {
      if (this.editable) {
        return {
          full: index <= this.hoverCount,
          half: index == this.hoverCount + 0.5,
          empty: index > this.hoverCount,
          editable: this.editable
        }
      } else {
        return {
          full: index <= this.hoverCount,
          half: (index > this.hoverCount) && (index + 0.5 <= this.hoverCount),
          empty: index > this.hoverCount && (index + 0.5 > this.hoverCount),
          editable: this.editable
        }
      }
    }
  }

  mounted() {
    this.hoverCount = this.value || this.init;
  }

  hover(value) {
    this.hoverStar = true;
    this.hoverCount = value;
  }

  leave() {
    if (this.editable) {
      this.hoverStar = false;
      if (this.vl) {
        this.hoverCount = this.vl.$dirty ? this.rating : this.init;
      } else {
        this.hoverCount = this.value ? this.value : this.init;
      }
    }
  }

  set(value) {
    this.hoverStar = false;
    this.rating = value;
    this.$emit("input", value);
    this.$emit("rate", value);
  }
}
</script>


<style lang="scss" scoped>

.star-component {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  position: relative;

  .star-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
    flex-flow: row wrap;
    flex: 0 0 auto;

    .starRating {
      position: relative;
      display: flex;
      flex-flow: row nowrap;
      margin: -2px;

      /deep/ .svg-container {
        position: absolute;
      }

      &.editable {
        cursor: pointer;
      }

      .part {
        position: relative;
        flex: 0 0 auto;
        height: 100%;
        width: 50%;
      }
    }
  }

  .star-displayNumber {
    color: white;
    flex: 1 1 auto;
    display: flex;
    justify-content: flex-start;
    padding: 3px 10px 3px 10px;
    border-radius: 30px;
    font-size: 14px;
    // background-color: $yellow1;
  }

  .star-displayCount {
    color: white;
    flex: 1 1 auto;
    display: flex;
    justify-content: flex-end;
    padding: 3px 10px 3px 10px;
    border-radius: 30px;
    font-size: 12px;
    // background-color: $yellow1;
  }
}


</style>

