<template lang='html'>
  <transition name='slide'>
    <div class='view'>
      <!-- <section class='image-home'>
        <div class='background-mask'></div>
      </section> -->

      <StarRating v-model='note' />

      {{note}}


    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { State, Getter, Mutation } from 'vuex-class';

import { StarRating } from '@components'

import SearchComponent from './SearchComponent.vue';

@Component({
  components: {
    SearchComponent,
    StarRating
  }
})
export default class Home extends Vue {

  public note: number = 2;

}
</script>


<style lang="scss" scoped>

section{
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  position: relative;
}

.image-home {
  // background-image: url('~@images/home_image.jpg');
  position: relative;
  height: 500px;
  @include bg-center;

  .background-mask {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: transparentize($g20, 0.7);
  }
}


</style>


