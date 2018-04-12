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

declare var InfoBox;

@Component({})
export default class MarkerElement extends Vue {

  @Prop() markerData: IMarker;

  public marker: google.maps.Marker;
  public $slots;
  public $scopedSlots;

  async mounted() {

    const templateInfo = `
      <div id='markerRoot${this.markerData.id}'>
        <div id='marker${this.markerData.id}'></div>
      </div>`;
    const mapInstance = await getMapInstance();


    this.marker = new google.maps.Marker({
      position: this.markerData.position,
      map: mapInstance,
      title: this.markerData.title,
    })
    const infoBox: google.maps.InfoWindow = new InfoBox({
      content: templateInfo
    })
    this.marker.addListener('click', async () => {
      infoBox.open(mapInstance, this.marker);
      mapInstance.panTo(infoBox.getPosition())
      const _this = this;
      google.maps.event.addListener(infoBox, 'domready', () => {
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

  }

  createInfoBox(infoBox) {
    
  }

  destroyed() {
    this.marker.setMap(null);
  }
}
</script>


<style lang="scss" scoped>

</style>


