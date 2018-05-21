<template>
  <div class="google-map-root">
    <div ref="googlemap" id='googlemap'></div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { GoogleMaps } from '@store';

@Component({
})
export default class GoogleMapsRoot extends Vue {

  @Prop() initFunction: Function;
  @Prop({type: String}) reload;


  @Watch('reload') reloadMap() {
    this.initFunction();
  }


  async mounted() {
    const mapElement: HTMLElement = this.$refs['googlemap'];
    await GoogleMaps.actions.initMap(mapElement);
    await this.initFunction();
  }

  beforeDestroy() {
    GoogleMaps.mutations.deleteMarkersFromMap();
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


