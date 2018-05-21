<template>
  <div class='Moving'>
    <section class='searchResults'>
      <section class='searchComponent' :class='{shadow}'>
        <SearchMoving :store='MovingStore'
          @updateRoute='updateRoute'
          createMoving
          ></SearchMoving>
      </section>
      <section class='resultsList'>
        <MovingList/>
      </section>
    </section>

    <section class='resultsMap'>
      <MovingMap/>
    </section>

    <router-view></router-view>
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

  get MovingStore() {return MovingStore}

  updateRoute(value) {
    MovingStore.mutations.updateSearchRoute(value);
  }

  handleBodyScroll() {
    if ($(document).scrollTop() === 0) {
      this.shadow = false;
    } else {
      this.shadow = true;
    }
  }

  created() {
    $(document).scroll(this.handleBodyScroll);
  }

  beforeDestroy() {
    MovingStore.mutations.updateMovingList([])
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
    position: relative;
    display: flex;
    flex-flow: column nowrap;
    min-height: 100%;
    height: auto;
    width: calc(100% - 500px);
    background-color: white;

    section.resultsList {
      display: flex;
      flex-flow: row wrap;
      width: 100%;
      flex: 1 1 auto;
      height: auto;
      align-self: flex-start;
      background-color: white;

    }

    section.searchComponent {
      position: sticky;
      align-self: flex-start;
      left: 0;
      top: $headerHeight;
      height: auto;
      display: flex;
      z-index: 10;
      width: 100%;
      flex: 0 0 auto;
      transition: box-shadow 0.3s;

      &.shadow {
        box-shadow: 0 0 10px transparentize($g0, 0.8);
      }
    }
  }
}


</style>


