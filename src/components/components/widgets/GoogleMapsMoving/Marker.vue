<template>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator';
import { GoogleMaps, getMapInstance } from '@store';
import {IMovingEvent, IMarker} from '@types';

@Component({})
export default class MarkerElement extends Vue {

  @Prop() markerData: IMarker;

  mounted() {
    const templateInfo = `
      <div id='marker${this.markerData.id}'>
        tessttt
      </div>
    `
    // const templateInfo = Vue.component('info-window',{
    //   template: 'tessst du composant',
    //   data() {
    //     return this.infos
    //   }
    // })
    console.log(getMapInstance())
    const marker = new google.maps.Marker({
      position: this.markerData.position,
      map: getMapInstance(),
      title: 'tesssst',
    })
    const infoWindow = new google.maps.InfoWindow({
      content: templateInfo
    })
    marker.addListener('click', function() {
      infoWindow.open(getMapInstance(), marker);
    });
  }

  destroyed() {
    
  }
}
</script>


<style lang="scss" scoped>

</style>


