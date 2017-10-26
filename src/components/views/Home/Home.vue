<template lang='html'>
  <transition name='slide'>
    <div class='view'>
      <section></section>
      <SearchComponent/>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { State, Getter, Mutation } from 'vuex-class';

import SearchComponent from './SearchComponent.vue';

@Component({
  components: {
    SearchComponent
  }
})
export default class Home extends Vue {

}
</script>


<style lang="scss" scoped>


section{
  display: flex;
  height: 500px;
  background-image: url('~@images/home_image.jpg');
  @include bg-center;
}


</style>


