<template>
  <div class='star-component'>
    <div class="star-container" @mouseleave='leave()'>
      <template v-if='editable'>
        <div class="starRating" v-for='(index) in starCount' :key='index'  editable 
            :class='{
              full: index < hoverCount,
              half: index == hoverCount - 0.5,
              empty: index >= hoverCount
            }' 
            :color='(!hoverStar && vl?vl.$dirty:false)?"green":"brown"'
            >
          <div class="part" @mouseenter="hover(index + 0.5)" @click="set(index + 0.5)"></div>
          <div class="part" @mouseenter="hover(index + 1)" @click="set(index + 1)"></div>
        </div>
      </template>
      <template v-else>
        <div class="starRating" v-for='(index) in starCount' :key='index'
            :class='{
              full: index + 1 <= hoverCount,
              half: (index + 1 > hoverCount) && (index + 0.5 <= hoverCount),
              empty: index + 1 > hoverCount && (index + 0.5 > hoverCount),
            }'  color='brown'>
        </div>
      </template>
    </div>

    <div class="star-displayNumber" v-if='displayNote'>
      {{ (hoverCount != 0?(hoverCount ):'-') }} / {{starCount}}
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
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { IValidator } from "vuelidate";
import { numberFilter } from "@filters";

@Component({})
export default class StarRating extends Vue {

  @Prop() value: number;
  @Prop({ default: 5 }) starCount: number;
  @Prop({ default: false }) required: boolean;
  @Prop() name: string;
  @Prop({ default: true }) editable: boolean;
  @Prop({ default: 0 }) init: number;
  @Prop() noteCount: number;
  @Prop({ default: false }) displayNote: boolean;
  @Prop({ default: true }) float: boolean;
  @Prop() vl: IValidator;

  public rating: number = 0; 
  public hoverCount: number = 0;
  public hoverStar: boolean = false; 

  mounted() {
    this.hoverCount = this.value;
  }
  

  updateValue(value) {
    this.vl.$touch();
    this.$emit("input", value);
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
    if (this.editable) {
      this.hoverStar = false;
      this.rating = value;
      this.$emit("input", value);
    } else {
      this.hoverStar = false;
      this.hoverCount = value;
      this.rating = value;
    }
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
      height: 25px;
      width: 25px;
      background-position: center center;
      background-size: 30px 30px;

      &.full[color="brown"] {
        background-image: url("./assets/star_plain.svg");
      }
      &.half[color="brown"] {
        background-image: url("./assets/star_half.svg");
      }
      &.empty[color="brown"] {
        background-image: url("./assets/star_empty.svg");
      }
      &.full[color="green"] {
        background-image: url("./assets/star_plain_done.svg");
      }
      &.half[color="green"] {
        background-image: url("./assets/star_half_done.svg");
      }
      &.empty[color="green"] {
        background-image: url("./assets/star_empty_done.svg");
      }

      &[editable] {
        cursor: pointer;
      }

      .part {
        position: relative;
        float: left;
        height: 100%;
        width: 50%;
      }
    }
  }

  .star-displayNumber {
    position: absolute;
    color: white;
    right: 5px;
    top: 50%;
    @include translateY(-50%);
    padding: 3px 10px 3px 10px;
    border-radius: 30px;
    font-size: 14px;
    background-color: $yellow1;
  }

  .star-displayCount {
    position: absolute;
    color: white;
    left: 5px;
    top: 50%;
    @include translateY(-50%);
    padding: 3px 10px 3px 10px;
    border-radius: 30px;
    font-size: 12px;
    background-color: $yellow1;
  }
}


</style>

