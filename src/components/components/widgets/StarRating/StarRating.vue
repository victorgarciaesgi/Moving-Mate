<template>
  <div class='star-component'>
    <div class="star-container" @mouseleave='leave()'>
      <div class="starRating"
          v-for='(index) in data.starCount' :key='index' 
          :style='getSize'
          :class='getActiveClass(index)' 
          >
        <SvgIcon :src='getActiveImage(index)'
          :color='getActiveColor(index)'
          :size='data.size'/>
        <template v-if='data.editable'>
          <div class="part" @mouseenter="hover(index - 0.5)" @click="set(index - 0.5)"></div>
          <div class="part" @mouseenter="hover(index)" @click="set(index)"></div>
        </template>
      </div>
    </div>
    
    <img v-if='isPending' class='form-valid-icon' src='~@images/loading.svg'>
    <div v-else-if='valid && dirty && data.error' class="form-valid-icon form-valid"></div>
    <div v-else-if='!valid && dirty && data.error' class="form-valid-icon form-invalid"></div>
    <div v-else-if='!dirty && required' class="form-valid-icon form-required"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";
import { IValidator } from "vuelidate";
import SvgIcon from '../Divers/SvgIcon.vue';
import {Component, Mixin, Mixins} from 'vue-mixin-decorator';
import {FormMixin} from '../../Mixins/FormMixin';


@Component({
  components: {
    SvgIcon: SvgIcon
  }
})
export default class StarRating extends FormMixin {
  @Prop() value: number;

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
      height: `${this.data.size}px`,
      width: `${this.data.size}px`,
    }
  }

  get getActiveColor() {
    return index => {
      if (this.data.editable) {
        return (!this.hoverStar && this.vl?this.vl.$dirty:false)?this.data.selectedColor:this.data.baseColor;
      } else {
        return this.data.baseColor;
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
      if (this.data.editable) {
        return {
          full: index <= this.hoverCount,
          half: index == this.hoverCount + 0.5,
          empty: index > this.hoverCount,
          editable: this.data.editable
        }
      } else {
        return {
          full: index <= this.hoverCount,
          half: (index > this.hoverCount) && (index - 0.5 <= this.hoverCount),
          empty: index > this.hoverCount && (index - 0.5 > this.hoverCount),
          editable: this.data.editable
        }
      }
    }
  }

  mounted() {
    this.hoverCount = this.value || this.data.init;
  }

  hover(value) {
    this.hoverStar = true;
    this.hoverCount = value;
  }

  leave() {
    if (this.data.editable) {
      this.hoverStar = false;
      if (this.vl) {
        this.hoverCount = this.vl.$dirty ? this.rating : this.data.init;
      } else {
        this.hoverCount = this.value ? this.value : this.data.init;
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

