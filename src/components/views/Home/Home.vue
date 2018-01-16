<template lang='html'>
  <transition name='slide'>
    <!-- <section class='image-home'>
      <div class='background-mask'></div>
    </section> -->

    <!-- <div style='width: 300px'>
        :displayNote='true'/>
      <StarRating v-model='note' 
    </div> -->
    <h1>Home</h1>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { State, Getter, Mutation } from 'vuex-class';
import { StarRating } from '@components'

@Component({
  components: {
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
  background-image: url('~@images/home_image.jpg');
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


