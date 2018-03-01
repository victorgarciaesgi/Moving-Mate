<template>
  <div ref="movingmap" class="moving-map-root">
    
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';
import { MovingStore, GoogleMaps } from '@store';
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
    let mapElement: HTMLElement = this.$refs['movingmap'];
    GoogleMaps.actions.initMap(mapElement);
  }


}
</script>


<style lang="scss" scoped>

.moving-map-root {
  display: flex;
  position: relative;
  flex-flow: row nowrap;
  flex: 1 1 auto;

}



</style>


