<template>
  <div class='Moving'>
    <section class='searchComponent'>
      <SearchMoving></SearchMoving>
    </section>
    <section class='searchResults'>
      <section class='resultsList'>
        <MovingList/>
      </section>
      <section class='resultsMap'>
        <MovingMap/>
      </section>

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
  flex-flow: column nowrap;
  height: 100%;
  width: 100%;

  section.searchComponent {
    position: fixed;
    top: $headerHeight;
    left: 0;
    display: flex;
    width: 100%;
    z-index: 10;
    box-shadow: 0 0 10px transparentize($g20, 0.8);

  }

  section.searchResults {
    margin-top: 90px;
    display: flex;
    flex-flow: row nowrap;
    width: calc(100% - 500px);
    height: calc(100% - 90px);
    background-color: white;

    section.resultsList {
      display: flex;
      flex: 1 1 auto;
      background-color: $w245;
      height: 100%;
    }

    section.resultsMap {
      position: fixed;
      top: 0;
      height: 100%;
      left: calc(100% - 500px);
      display: flex;
      width: 500px;
      border-left: 1px solid $w210;
    }
  }
}


</style>


