<template>
  <div class="moving-list-root">
    <div v-if='searching' class='loader' >
      <img src="~@images/loading.svg">
    </div>
    <template v-else-if='movingList.length'>
      <ul class='moving-list'>
        <MovingCard v-for='moving in movingList' 
                    :key='moving.uuid'
                    :moving='moving'>
        </MovingCard>
        <!-- <div class='loading-lazy' v-if='!offsetState && loadingLazy'>
          <img src="~@images/loading.svg" height='50' width="50">
        </div> -->
    </ul>
    </template>
    <div v-else class='no-result flexy'>
      <SvgIcon :src='require("@icons/divers/face_bad.svg")' 
        :size='50' color='#5a5a5a'/>
      Aucune annonce trouvée
    </div>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';
import { MovingStore } from '@store';
import MovingCard from './MovingCard.vue';
import { SvgIcon } from '@components';

@Component({
  components: { MovingCard, SvgIcon}
})
export default class MovingList extends Vue {

  public loadingLazy = false;

  get movingList() {return MovingStore.getters.formatedMovingList}
  get searching() {return MovingStore.state.searchingMovingList}
  get offsetState() {return MovingStore.state.endOffset}
  
  scrollContent() {
    if (this.offsetState) return;
    else {
      this.loadingLazy = true;
      try {
        MovingStore.actions.fetchMovingOffset()
      } finally {
        this.loadingLazy = false;
      }
    }
  }


  mounted() {
  }


}
</script>


<style lang="scss" scoped>


.moving-list-root {
  display: flex;
  position: relative;
  flex-flow: column wrap;
  min-height: 100%;
  height: auto;
  width: 100%;

  div.list-filter-container {
    display: flex;
    flex: 0 0 auto;
    height: 50px;
  }


  ul.moving-list {
    display: flex;
    position: relative;
    flex-flow: row wrap;
    justify-content: center;
    align-items: flex-start;
    align-content: flex-start;
    width: 100%;
    flex: 1 1 auto;
    padding: 10px;

    .loading-lazy {
      width: 100%;
      display: flex;
      height: 70px;
      justify-content: center;
      align-items: center;
    }
    
  }

  .no-result {
    font-weight: bold;
  }

  .loader {
    display: flex;
    flex: 1 1 auto;
    justify-content: center;
    align-items: center;

    img {
      width: 50px;
      height: 50px;
    }
  }
}

</style>


