<template>
  <div class="moving-list-root">
    <ul class='moving-list'>
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
  components: {MovingCard}
})
export default class MovingList extends Vue {

  get movingList() {return MovingStore.getters.formatedMovingList}

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




</style>


