<template>
  <div class='map-container'>
    <svg v-show='ready'>
      <g>
        <path />
        
      </g>
    </svg>

    <img v-if='!ready' class='loading' src='~@images/loading.svg' height="30" width="30">
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import axios from 'axios';

interface path {
  id: string,
  class: string,
  title: string,
  draw: string,
}

@Component({})
export default class SvgIcon extends Vue {

  @Prop({required: true}) svgPath: string;

  public ready: boolean = false;
  public paths: path[] = []

  async created() {
    let response = await axios.get(`maps/${this.svgPath}.json`);
    console.log( response);
    if (response.status == 200) {

    }
  }
  

  
}
</script>

<style lang="scss">

.land {
  fill: #CCCCCC;
  fill-opacity: 1;
  stroke:white;
  stroke-opacity: 1;
  stroke-width:0.5;
}
  
</style>

