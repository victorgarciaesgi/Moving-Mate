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

      </section>

    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SearchMoving from './SearchMoving.vue';
import {Component, Prop } from 'vue-property-decorator';
import { MovingStore } from '@store';
import MovingList from './MovingList.vue';

@Component({
  components: {
    SearchMoving, MovingList
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
    height: 150px;
    flex: 0 0 auto;
    border-bottom: 1px solid $w210;
  }

  section.searchResults {
    display: flex;
    flex-flow: row nowrap;
    flex: 1 0 auto;
    background-color: white;

    section.resultsList {
      display: flex;
      flex: 1 1 auto;
    }

    section.resultsMap {
      display: flex;
      flex: 0 0 auto;
      width: 300px;
      border-left: 1px solid $w210;
    }
  }
}


</style>


