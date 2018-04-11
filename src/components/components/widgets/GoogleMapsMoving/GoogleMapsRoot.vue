<template>
  <div class="google-map-root">
    <div ref="googlemap" id='googlemap'></div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';
import { GoogleMaps } from '@store';

@Component({
})
export default class GoogleMapsRoot extends Vue {

  async mounted() {
    const mapElement: HTMLElement = this.$refs['googlemap'];
    await GoogleMaps.actions.initMap(mapElement);
  }
}
</script>


<style lang="scss" scoped>

.google-map-root {
  position: relative;
  height: 100%;
  width: 100%;

  #googlemap {
    height: 100%;
    width: 100%;
  }
}



</style>


