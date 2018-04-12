<template>
</template>

<script lang="ts">
import Vue from 'vue';
import Vue$ from 'vue/dist/vue.esm.js'
import { Component, Prop } from 'vue-property-decorator';
import { GoogleMaps, getMapInstance } from '@store';
import {IMovingEvent, IMarker} from '@types';

@Component({})
export default class MarkerElement extends Vue {

  @Prop() markerData: IMarker;

  public marker: google.maps.Marker;

  mounted() {
    const templateInfo = `
      <div id='markerRoot${this.markerData.id}'>
        <div id='marker${this.markerData.id}'>
          {{test}}
        </div>
      </div>
    `;
    console.log(getMapInstance())
    this.marker = new google.maps.Marker({
      position: this.markerData.position,
      map: getMapInstance(),
      title: 'tesssst',
    })
    const infoWindow = new google.maps.InfoWindow({
      content: templateInfo
    })
    this.marker.addListener('click', () => {
      infoWindow.open(getMapInstance(), this.marker);
      const markerVue = new Vue$({
        el: `#marker${this.markerData.id}`,
        data() {
          return {
            test: "coucou"
          }
        }
      })
    });
  }

  destroyed() {
    this.marker.setMap(null);
  }
}
</script>


<style lang="scss" scoped>

</style>


