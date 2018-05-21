<template>
  <div class="movers-list-root">
    <div v-if='searching' class='loader' >
      <img src="~@images/loading.svg">
    </div>
    <template v-else-if='moverList.length'>
      <ul class='movers-list' >
        <MoverCard v-for='mover in moverList' 
          :key='mover.id'
          :mover='mover' 
          :invite='invite'/>
      </ul>
    </template>
    <div v-else class='no-result flexy'>
      <SvgIcon :src='require("@icons/divers/face_bad.svg")' 
        :size='50' color='#5a5a5a'/>
      Aucune déménageur trouvé
    </div>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator';
import { MoverStore } from '@store';
import MoverCard from './MoverCard.vue';
import { SvgIcon } from '@components';

@Component({
  components: { MoverCard, SvgIcon},
  props: ["Store", "invite"]
})
export default class MoversList extends Vue {

  @Prop() invite: boolean;
  @Prop() Store;

  get moverList() {return this.Store.state.moverList}
  get searching() {return this.Store.state.searchingMoverList}

}
</script>


<style lang="scss" scoped>


.movers-list-root {
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

  ul.movers-list {
    display: flex;
    position: relative;
    flex-flow: row wrap;
    justify-content: center;
    align-items: flex-start;
    align-content: flex-start;
    width: 100%;
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


