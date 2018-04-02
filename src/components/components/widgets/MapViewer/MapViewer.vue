<template>
  <div class='map-container'>
    <svg v-if='ready' ref='svg' :width="size" :height="size" viewBox="0 0 620 600">
      <g x=''>
        <path v-for='path in paths' :key='path.id'
          :id='path.id'
          :title='path.title'
          :class='path.class'
          :d='path.draw'
          @click="emitClick(path, $event)"
          @mouseover='mouseHoverHandler(path, $event)'
          @mouseout="mouseOutHandler(path, $event)"
          v-once/>
      </g>
    </svg>

    <div v-if='showInfos' class='path-info' v-show='infoPath.show'
      :style='infoPath.style'>
      <span>{{infoPath.data.title}}</span>
      <span>{{infoPath.data.info}}</span>
      <div class='triangle'></div>
    </div>

    <img v-if='!ready' class='loading' src='~@images/loading.svg' height="30" width="30">
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import axios from "axios";
import $ from "jquery";
import { timeout } from "@methods";
import { GlobalStore } from "@store";
import { svgPath } from '@types';
import { globalAgent } from "http";

@Component({})
export default class MapViewer extends Vue {
  @Prop({ required: true, default: 'departements'}) svgPath: string;
  @Prop({default: 500}) size: number;
  @Prop({default: true}) showInfos: boolean;

  infoPath = {
    data: {
      title: '',
      info: ''
    },
    show: false,
    style: {
      left: null,
      top: null
    }
  };

  get paths() {
    return GlobalStore.state.svgMapPaths
  }

  get ready() {
    return GlobalStore.getters.svgMapReady;
  }

  async created() {
    GlobalStore.actions.fetchPaths(this.svgPath);
  }

  emitClick(path: string, event: MouseEvent) {
    console.log(path)
    this.$emit("pathSelected", path);
  }

  mouseHoverHandler(path: svgPath, event: any) {
    let pathRect = event.target.getBoundingClientRect();
    let svgRect = this.$refs["svg"].getBoundingClientRect();
    this.infoPath = {
      show: true,
      data: {
        title: path.title,
        info: '15 déménageurs disponibles'
      },
      style: {
        left: pathRect.left + pathRect.width + 10 + 'px',
        top: (pathRect.top - svgRect.top) + (pathRect.height / 2) +'px'
      }
    };
    this.$emit("mouseover", path);
  }

  mouseOutHandler(path: any, event: MouseEvent) {
    this.infoPath.show = false;
    this.$emit("mouseout", path);
  }
}
</script>





<style lang="scss" scoped>
.map-container {
  display: flex;
  position: relative;
  max-width: 100%;
  height: auto;
  justify-content: center;
  align-items: center;
  padding: 10px;

  svg {
    display: flex;
    justify-content: center;
    align-items: center;
    .land {
      fill: $mainStyle;
      fill-opacity: 1;
      stroke: white;
      stroke-opacity: 1;
      stroke-width: 1.5;
      stroke-linejoin: round;
      cursor: pointer;
      transition: transform 0.4s;

      &:hover {
        fill: darken($mainStyle, 15%);
      }
    }
  }
}

.path-info {
  position: absolute;
  display: flex;
  flex-flow: column wrap;
  background-color: white;
  padding: 5px 15px 5px 15px;
  width: auto;
  height: auto;
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(10,10,10,0.2);
  // @include translateY(-50%);

  
  .triangle {
    position: absolute;
    z-index: 10009;
    top: 50%;
    right: calc(100% - 1px);
    @include translateY(-50%);
    width: 0;
    height: 0;
    border-bottom: 10px solid transparent;
    border-top: 10px solid transparent;
    border-right: 10px solid white;
    border-left: 0 solid transparent;
    filter: drop-shadow(-2px 1px 4px rgba(50,50,50, 0.1));
  }
}

</style>

