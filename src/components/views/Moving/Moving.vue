<template>
  <div class='Moving'>
    <section class='searchResults'>
      <section class='resultsList'>
        <MovingList/>
      </section>
      <section class='searchComponent' :class='{shadow}'>
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

import $ from 'jquery';


@Component({
  components: {
    SearchMoving, MovingList, MovingMap
  }
})
export default class Moving extends Vue {

  @Prop({required: false}) search: string;

  public shadow = false;

  handleBodyScroll() {
    if ($(document).scrollTop() === 0) {
      this.shadow = false;
    } else {
      this.shadow = true;
    }
  }

  created() {
    $(document).scroll(this.handleBodyScroll)
  }

}
</script>


<style lang="scss" scoped>

.Moving {
  display: flex;
  position: relative;
  flex-flow: row wrap;
  min-height: 100%;
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
    z-index: 11;
  }
  
  section.searchResults {
    margin-top: 90px;
    display: flex;
    flex-flow: row wrap;
    width: calc(100% - 500px);
    background-color: white;

    section.resultsList {
      display: flex;
      flex-flow: row wrap;
      width: 100%;
      height: auto;
    }

    section.searchComponent {
      position: fixed;
      top: $headerHeight;
      left: 0;
      display: flex;
      width: calc(100% - 500px);
      z-index: 10;
      transition: box-shadow 0.3s;

      &.shadow {
        box-shadow: 0 0 10px transparentize($g0, 0.8);
      }
    }
  }
}


</style>


