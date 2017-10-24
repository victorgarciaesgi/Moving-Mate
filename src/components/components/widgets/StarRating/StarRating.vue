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
            :color='(!hoverStar && $v.filled.$dirty)?"green":"brown"'>
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
    <input type="hidden" :name='name' v-model='filled'>

    <div v-if='!$v.filled.$dirty && !displayNote' class="form-valid-icon form-required"></div>
    <div v-if='!$v.filled.$invalid && $v.filled.$dirty && !displayNote' class="form-valid-icon form-valid"></div>
    <div v-if='$v.filled.$invalid && $v.filled.$dirty && !displayNote' class="form-valid-icon form-invalid"></div>

  </div>
 
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { required } from 'vuelidate/lib/validators';
import { Vuelidate } from 'vuelidate';

import { numberFilter } from '@filters';


interface IStarValidate {
  filled: string;
}

@Component({
  name: 'StarRating',
  validations: {
    filled: {
      required: required
    }
  },
  filters: {
    'numberFilter': numberFilter
  },
})
export default class StarRating extends Vue {

  starCount: number = 5; // Nombre d'étoiles
  rating: number = 0; // Alternive variable pour garder la valeur d'avant lors d'un hover
  hoverCount: number = 0; // Valeur de la note affichée
  hoverStar: boolean = false; // Etat hover du block d'étoiles
  filled: string = ''; // Placeholder qui rempli le champs input hidden
  $v: Vuelidate<IStarValidate>

  @Prop({ required: false }) starModel: number;
  @Prop({ required: false }) required: boolean;
  @Prop({ required: false }) name: string;
  @Prop({ required: false }) editable: boolean;
  @Prop({ required: false }) init: number;
  @Prop({ required: false }) noteCount: number;
  @Prop({ required: false }) displayNote: boolean;


  mounted() {
    if (!this.starModel) {
      this.hoverCount = (this.init ? this.init : 0);
      // Store.commit('increment');
    }
    else {
      this.hoverCount = this.starModel;
    }
  }

  hover(value) {
    if (this.editable) {
      this.hoverStar = true;
      this.hoverCount = value;
    }
  }

  leave() {
    if (this.editable) {
      this.hoverStar = false;
      this.hoverCount = (this.$v.filled.$dirty ? this.rating : this.init);
    }
  }

  set(value) {
    if (this.editable && this.starModel) {
      this.hoverStar = false;
      this.starModel = value;
      this.rating = value;
      this.$emit('onSelectResult', { note: value });
    }
    else {
      this.hoverStar = false;
      this.hoverCount = value;
      this.rating = value;
    }
  }

  @Watch('starModel') starValueChanged(newVal, oldVal) {
    if (this.editable) {
      if (!!newVal) {
        if (!this.$v.filled.$dirty) {
          this.$v.filled.$touch;
        }
        this.filled = (newVal.length == 0 ? null : "filled");
      }
      else {
        this.hoverCount = (this.init ? this.init : 0);
        this.filled = "";
      }
    }
  }

  @Watch('init') initChanged(newVal, oldVal) {
    if (!this.editable) {
      this.hoverCount = (!!newVal ? newVal : 0);
    }
  }

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

    &.full[color='brown'] {
      background-image: url('./assets/star_plain.svg');
    }
    &.half[color='brown'] {
      background-image: url('./assets/star_half.svg');
    }
    &.empty[color='brown'] {
      background-image: url('./assets/star_empty.svg');
    }
    &.full[color='green'] {
      background-image: url('./assets/star_plain_green.svg');
    }
    &.half[color='green'] {
      background-image: url('./assets/star_half_green.svg');
    }
    &.empty[color='green'] {
      background-image: url('./assets/star_empty_green.svg');
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

