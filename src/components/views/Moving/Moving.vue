<template>
  <div class='Moving'>
    <section class='searchResults'>
      <section class='resultsList'>
        <MovingList/>
      </section>
      <section class='searchComponent'>
        <SearchMoving></SearchMoving>
      </section>
    </section>

    <section class='resultsMap'>
      <MovingMap/>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component, Prop } from 'vue-property-decorator';
import { MovingStore } from '@store';

import MovingList from './MovingList.vue';
import SearchMoving from './SearchMoving.vue';
import MovingMap from './MovingMap.vue';


@Component({
  components: {
    SearchMoving, MovingList, MovingMap
  }
})
export default class Moving extends Vue {

  @Prop({required: false}) search: string;

  mounted() {

  }

}
</script>


<style lang="scss" scoped>

.Moving {
  display: flex;
  position: relative;
  flex-flow: row nowrap;
  height: 100%;
  width: 100%;
  background-color: white;



  section.resultsMap {
    position: fixed;
    top: $headerHeight;
    height: calc(100% - #{$headerHeight});
    left: calc(100% - 500px);
    display: flex;
    width: 500px;
    border-left: 1px solid $w210;
  }
  
  section.searchResults {
    margin-top: 90px;
    display: flex;
    flex-flow: row nowrap;
    width: calc(100% - 500px);
    height: 100%;
    background-color: white;

    section.resultsList {
      display: flex;
      flex: 1 1 auto;
      height: calc(100% - 90px);
    }

    section.searchComponent {
      position: fixed;
      top: $headerHeight;
      left: 0;
      display: flex;
      width: calc(100% - 500px);
      z-index: 10;
      box-shadow: 0 0 10px transparentize($g20, 0.8);
    }
  }
}


</style>


