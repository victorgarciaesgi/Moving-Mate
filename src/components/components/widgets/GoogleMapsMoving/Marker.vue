<template>
</template>

<script lang="ts">
import Vue from 'vue';
import {VNode} from 'vue/types';
import Vue$ from 'vue/dist/vue.esm.js';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { GoogleMaps, getMapInstance } from '@store';
import { IMovingEvent, IMarker } from '@types';
import { CreateElement } from 'vue/types/vue';
import { timeout } from '@methods';


@Component({})
export default class MarkerElement extends Vue {

  @Prop() markerData: IMarker;

  public $slots;
  public $scopedSlots;

  async mounted() {

    const templateInfo = `
      <div id='markerRoot${this.markerData.id}'>
        <div id='marker${this.markerData.id}'></div>
      </div>`;
    const mapInstance = await getMapInstance();

    this.markerData.marker.addListener('click', async () => {
      GoogleMaps.mutations.closeMarkers();
      this.markerData.infoBox.open(mapInstance, this.markerData.marker);
      mapInstance.panTo(this.markerData.infoBox.getPosition())
      const _this = this;
      google.maps.event.addListener(this.markerData.infoBox, 'domready', () => {
        new Vue({
          el: `#marker${this.markerData.id}`,
          render(h: CreateElement): VNode {
            return h('div', [ 
              _this.$slots.default
            ])
          },
        })
      })      
    });
    google.maps.event.addListener(mapInstance, 'click', () => {
      this.markerData.infoBox.close()
    })

  }

  createInfoBox(infoBox) {
    
  }

  destroyed() {
    this.markerData.marker.setMap(null);
  }
}
</script>


<style lang="scss" scoped>

</style>


