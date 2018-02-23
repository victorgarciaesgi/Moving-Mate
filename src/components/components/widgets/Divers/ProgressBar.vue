<template>
  <transition name='fade'>
    <div class="progress" v-if="progressState.show"
      :style="{
        width: progressState.percent+'%',
        height: progressState.height,
        backgroundColor: progressState.canSuccess? progressState.color : progressState.failedColor,
      }" 
    ></div>
  </transition>
</template>

<script lang='ts'>
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import {ProgressBar} from '@store';

@Component({})
export default class ProgressBarComponent extends Vue {

  get progressState() {
    return ProgressBar.state;
  }
  
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
  transition: width 0.2s linear;
  z-index: 999999;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}


</style>