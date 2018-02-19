<template>
  <div ref='popup' v-show='show' @click.stop class="popup-box" :style='popupStyles'
    :class='{active: show}'>
    <slot></slot>
  </div>
  
</template>



<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { merge } from 'lodash'

import { EventBus } from '@store';
import { calculatePopupPosition } from '@methods';
import { Prop } from "vue-property-decorator";
import { relative, isAbsolute } from "path";

@Component({})
export default class Popup extends Vue {

  @Prop() width: number;
  @Prop({default: false}) absolute: boolean;

  public show: boolean = false;
  public origin: HTMLElement;
  public popupPosition = {
    bottom: null,
    left: null,
    top: null,
    width: this.width + "px"
  };

  get popupStyles() {
    if (this.absolute) {
      return this.popupPosition;
    }
    return;
  }
  

  togglePopup(origin?: HTMLElement) {
    if (!this.show) {
      if (this.absolute) {
        this.origin = origin;
        let positions = calculatePopupPosition(origin, this.$refs['popup']);
        this.popupPosition = merge(this.popupPosition, positions);
      } 
      this.show = true;
    } 
    else {
      this.show = false;
    }
    
  }

  created(){
    EventBus.$on('closePopups', () => {
      this.show = false;
      this.$emit('close');
    })
  }

}
</script>



<style lang='scss' scoped>

.popup-box{
  position: absolute;
  background-color: white;
  left: 0px;
  top: calc(100% + 15px);
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(10,10,10,0.2);
  height: auto;
  min-height: 200px;
  min-width: 250px;
  max-height: 80vh;
  max-width: 80vw;
  flex-flow: column nowrap;
  overflow: hidden;
  z-index: 10011;

  &.right {
    left: auto;
    right: 0px;
  }

  div.header {
    display: flex;
    flex-flow: column wrap;
    flex: 0 0 auto;
    height: 40px;
    padding-left: 10px;
    font-weight: bold;
    justify-content: center;
    border-bottom: 1px solid $w230;

  }

  div.content {
    display: flex;
    flex-flow: column wrap;
    flex: 1 1 auto;
    overflow: auto;
    padding: 10px;
  }

  div.footer {
    display: flex;
    flex-flow: row nowrap;
    flex: 0 0 auto;
    padding: 5px;
    height: 50px;
    align-items: center;
    align-content: center;
    justify-content: flex-end;
  }

  .triangle{
    position: absolute;
    z-index: 10009;
    top: 100%;
    left: 50%;
    @include translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid $w250;
    filter: drop-shadow(0px 6px 4px rgba(50,50,50, 0.1));

    &.top {
      border-bottom: 10px solid $w250;
    }

    &.left {
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid $w250;
    }
  }
}

</style>

