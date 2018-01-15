<template lang='html'>
  <div>
    <div class="star-container" @mouseleave='leave()'>
      <template v-if='editable'>
        <div class="starRating" v-for='(star, index) in starCount' :key='index'  editable 
            :class='{
              full: index < hoverCount,
              half: index == hoverCount - 0.5,
              empty: index >= hoverCount
            }' 
            :color='(!hoverStar && vl?vl.$dirty:false)?"green":"brown"'
            @mouseenter="float?'':hover(index + 1)" @click="float?'':set(index + 1)">
          <div class="part" @mouseenter="hover(index + 0.5)" @click="set(index + 0.5)"></div>
          <div class="part" @mouseenter="hover(index + 1)" @click="set(index + 1)"></div>
        </div>
      </template>
      <template v-else>
        <div class="starRating" v-for='(star, index) in starCount' :key='index'
            :class='{
              full: index + 1 <= hoverCount,
              half: (index + 1 > hoverCount) && (index + 0.5 <= hoverCount),
              empty: index + 1 > hoverCount && (index + 0.5 > hoverCount),
            }'  color='brown'>
        </div>
      </template>

      <div class="star-displayNumber" v-if='displayNote'>
        {{ (hoverCount != 0?(hoverCount | numberFilter(1) ):'-') }} / {{starCount}}
      </div>
      <div class="star-displayCount" v-if='displayNote && noteCount'>
        {{noteCount}} {{noteCount > 1?'notes':'note'}}
      </div>
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

interface IStarValidate extends IValidator {
  filled: IValidator;
}

@Component({
  filters: {
    numberFilter: numberFilter
  },
})
export default class StarRating extends Vue {
  public rating: number = 0; // Alternive variable pour garder la valeur d'avant lors d'un hover
  public hoverCount: number = 0; // Valeur de la note affichée
  public hoverStar: boolean = false; // Etat hover du block d'étoiles

  @Prop() value: number;
  @Prop({ default: 5 }) starCount: number;
  @Prop({ default: false }) required: boolean;
  @Prop() name: string;
  @Prop({ default: true }) editable: boolean;
  @Prop({ default: 0 }) init: number;
  @Prop() noteCount: number;
  @Prop({ default: false }) displayNote: boolean;
  @Prop({ default: true }) float: boolean;
  @Prop() vl: IStarValidate;

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
        this.hoverCount = this.vl.filled.$dirty ? this.rating : this.init;
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

  // @Watch('starModel') starValueChanged(newVal, oldVal) {
  //   if (this.editable) {
  //     if (!!newVal) {
  //       if (!this.vl.filled.$dirty) {
  //         this.vl.filled.$touch;
  //       }
  //       this.filled = (newVal.length == 0 ? null : "filled");
  //     }
  //     else {
  //       this.hoverCount = (this.init ? this.init : 0);
  //       this.filled = "";
  //     }
  //   }
  // }

  // @Watch('init') initChanged(newVal, oldVal) {
  //   if (!this.editable) {
  //     this.hoverCount = (!!newVal ? newVal : 0);
  //   }
  // }
}
</script>


<style lang="scss" scoped>
.star-container {
  display: inline-block;
  width: auto;
  height: auto;

  .starRating {
    position: relative;
    float: left;
    height: 25px;
    width: 25px;
    margin-bottom: -4px;
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
      background-image: url("./assets/star_plain_green.svg");
    }
    &.half[color="green"] {
      background-image: url("./assets/star_half_green.svg");
    }
    &.empty[color="green"] {
      background-image: url("./assets/star_empty_green.svg");
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
  .star-zero {
    position: relative;
    float: left;
    height: 25px;
    width: 13px;
    cursor: pointer;
  }

  .star-displayNumber {
    position: absolute;
    right: 5px;
    top: 50%;
    @include translateY(-50%);
    color: white;
    padding: 3px 10px 3px 10px;
    border-radius: 30px;
    font-size: 14px;
    background-color: $yellow1;
  }

  .star-displayCount {
    position: absolute;
    left: 5px;
    top: 50%;
    @include translateY(-50%);
    color: white;
    padding: 3px 10px 3px 10px;
    border-radius: 30px;
    font-size: 12px;
    background-color: $yellow1;
  }
}
</style>

