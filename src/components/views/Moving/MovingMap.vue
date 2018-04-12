<template>
  <div class="moving-map-root">
    <GoogleMapsRoot>
      <MarkerElement v-for='marker in getMarkers' 
        :key='marker.id'
        :markerData='marker'>
            <MovingCard :moving='marker.infos' onMap/>
      </MarkerElement>
    </GoogleMapsRoot>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';
import { GoogleMapsRoot, MarkerElement } from '@components';
import {GoogleMaps} from '@store';
import MovingCard from './MovingCard.vue';

@Component({
  components: {
    GoogleMapsRoot, MarkerElement, MovingCard
  }
})
export default class MovingMap extends Vue {

  get getMarkers() { return GoogleMaps.state.markers}

  public salut = 'loool';

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


