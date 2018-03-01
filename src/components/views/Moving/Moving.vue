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
    display: flex;
    flex: 0 0 auto;
    z-index: 10;
    box-shadow: 0 0 10px transparentize($g20, 0.8);

  }

  section.searchResults {
    display: flex;
    flex-flow: row nowrap;
    flex: 1 0 auto;
    background-color: white;

    section.resultsList {
      display: flex;
      flex: 1 1 auto;
      background-color: $w245;

    }

    section.resultsMap {
      display: flex;
      flex: 0 0 auto;
      width: 500px;
      border-left: 1px solid $w210;
    }
  }
}


</style>


