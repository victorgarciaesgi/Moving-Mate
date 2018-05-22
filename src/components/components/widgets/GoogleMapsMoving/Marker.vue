<template>
</template>

<script lang="ts">
import Vue from 'vue';
import {VNode} from 'vue/types';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { GoogleMaps, getMapInstance } from '@store';
import { IMovingEvent, IMarker } from '@types';
import { CreateElement } from 'vue/types/vue';
import { timeout } from '@methods';


@Component({})
export default class MarkerElement extends Vue {

  @Prop() markerData: IMarker;

  public marker: google.maps.Marker = null;
  public $slots;
  public $scopedSlots;

  async mounted() {
    const mapInstance = await getMapInstance();
    google.maps.event.addDomListenerOnce(mapInstance, 'idle', this.renderMarker)
  }

  async renderMarker() {
    const mapInstance = await getMapInstance();
    this.marker = new google.maps.Marker({
      position: this.markerData.position,
      map: mapInstance,
      animation: google.maps.Animation.DROP,
      title: this.markerData.title,
      icon: require('@icons/truck_blue.svg'),
    })
    GoogleMaps.mutations.addMarkersFromMap(this.marker);
    this.marker.addListener('click', async () => {
      GoogleMaps.mutations.closeMarkers();
      this.markerData.infoBox.open(mapInstance, this.marker);
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

  beforeDestroy() {
    if (this.marker) {
      this.marker.setMap(null);
      this.markerData.infoBox.close();
    }
  }
}
</script>


<style lang="scss" scoped>

</style>


