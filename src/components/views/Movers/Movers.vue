<template lang='html'>
  <div class='Movers'>
    <section class='searchResults'>
      <section class='searchComponent' :class='{shadow}'>
        <SearchMoving :store='MoverStore'
          @updateRoute='updateRoute'
          ></SearchMoving>
      </section>
      <section class='resultsList'>
        <MoversList/>
      </section>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop } from 'vue-property-decorator';
import { MoverStore } from '@store';
import MoversList from './MoversList.vue';
import SearchMoving from '../Moving/SearchMoving.vue';
import $ from 'jquery';


@Component({
  components: {
    SearchMoving, MoversList
  }
})
export default class Movers extends Vue {

  get MoverStore() {return MoverStore}
  public shadow = false;


  updateRoute(value) {
    MoverStore.mutations.updateSearchRoute(value);
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
}
</script>


<style lang="scss" scoped>

.Movers {
  display: flex;
  position: relative;
  flex-flow: row wrap;
  min-height: 100%;
  width: 100%;
  background-color: white;
  
  section.searchResults {
    position: relative;
    display: flex;
    flex-flow: row wrap;
    min-height: 100%;
    width: 100%;
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


