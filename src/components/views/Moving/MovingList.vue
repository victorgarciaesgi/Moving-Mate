<template>
  <div class="moving-list-root">
    <div v-if='searching' class='loader' >
      <img src="~@images/loading.svg">
    </div>
    <ul v-else-if='movingList.length' class='moving-list' >
      <MovingCard v-for='moving in movingList' 
                  :key='moving.id'
                  :moving='moving'>
      </MovingCard>
    </ul>
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

  get movingList() {return MovingStore.getters.formatedMovingList}
  get searching() {return MovingStore.state.searchingMovingList}


  mounted() {
    console.log(this.movingList);
  }


}
</script>


<style lang="scss" scoped>


.moving-list-root {
  display: flex;
  position: relative;
  flex-flow: column nowrap;
  min-height: 100%;
  width: 100%;

  div.list-filter-container {
    display: flex;
    flex: 0 0 auto;
    height: 50px;
  }


  ul.moving-list {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: flex-start;
    align-content: flex-start;
    flex: 1 1 auto;
    padding: 10px;
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


