<template>
  <div class="progress" :style="{
    width: percent+'%',
    height: height,
    backgroundColor: canSuccess? color : failedColor,
    opacity: show ? 1 : 0
  }"></div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { State, Getter, Mutation } from 'vuex-class';

@Component({})
export default class ProgressBar extends Vue {
  
}
</script>

<style scoped>
.progress {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  height: 2px;
  width: 0%;
  transition: width 0.2s, opacity 0.4s;
  opacity: 1;
  background-color: #efc14e;
  z-index: 999999;
}
</style>