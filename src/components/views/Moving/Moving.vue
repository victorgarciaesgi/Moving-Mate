<template>
  <div class='Moving'>

    <section class='searchComponent'>
      <SearchMoving></SearchMoving>
    </section>
    <section class='searchResults'>
      <section class='resultsList'>

      </section>
      <section class='resultsMap'>

      </section>

    </section>
    
    

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import SearchMoving from './SearchMoving.vue';
import { Prop } from 'vue-property-decorator';
import { MovingStore } from '@store';

@Component({
  components: {
    SearchMoving
  }
})
export default class Moving extends Vue {

  @Prop({required: false}) search: string;

  mounted() {
    if (this.search) {
      MovingStore.mutations.updateSearchValue(this.search);
    }
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


