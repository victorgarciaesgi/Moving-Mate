<template>
  <div class="moving-list-root">
    <div class='loader' v-if='searching'>
      <img src="~@images/loading.svg">
    </div>
    <ul class='moving-list' v-else>
      <MovingCard v-for='moving in movingList' 
                  :key='moving.id'
                  :moving='moving'>
      </MovingCard>
    </ul>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';
import { MovingStore } from '@store';
import MovingCard from './MovingCard.vue';

@Component({
  components: { MovingCard }
})
export default class MovingList extends Vue {

  get movingList() {return MovingStore.getters.formatedMovingList}
  get searching() {return MovingStore.state.searchingMovingList}


  get formatedAddress() {
    return address => {
      return address.replace(/|/gi, ' ');
    }
  }

  mounted() {
    console.log(this.movingList);
  }


}
</script>


<style lang="scss" scoped>


.moving-list-root {
  display: flex;
  position: relative;
  flex-flow: row nowrap;
  min-height: 100%;
  width: 100%;


  ul.moving-list {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: flex-start;
    align-content: flex-start;
    flex: 1 1 auto;
    padding: 10px;
  }

  .loader {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;

    img {
      width: 50px;
      height: 50px;
    }
  }
}

</style>


