<template>
  <div class='popup-root'>
    <div v-show='show' @click.stop ref='popup'
      class="popup-box"
      :style='getWidth' :class='[PopupXYTypes.XType,PopupXYTypes.YType,{active: show}]'>
        <div class='triangle up' v-if='show'
          :class='[
            PopupXYTypes.XType,
            PopupXYTypes.YType,
            {active: show}
          ]'></div>
        <slot name='popup' />
    </div>
    <div class='bouton-popup' 
        @click.stop="togglePopup()"
        :class='{active: show}'
        ref='button'>
      <slot name='button' />
    </div>
  </div>
</template>



<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { merge } from 'lodash'

import { EventBus } from '@store';
import { calculatePopupRelativePosition } from '@methods';
import { Prop } from "vue-property-decorator";
import { relative, isAbsolute } from "path";

@Component({})
export default class Popup extends Vue {

  @Prop() width: number;
  @Prop({required: false}) container: HTMLElement;

  public show: boolean = false;

  public PopupXYTypes = {
    XType: null,
    YType: null
  }
  get getWidth() {
    if (!this.width) return;
    return {width: this.width + 'px'}
  }

  togglePopup() {
    if (!this.show) {
      const origin = this.$refs['button'];
      const target = this.$refs['popup'];
      const Types = calculatePopupRelativePosition(origin, target);
      this.PopupXYTypes = Types;
      EventBus.$emit('closePopups', this);
      this.show = true;
      this.$emit('open');
    } 
    else {
      this.show = false;
    }
  }

  created(){
    EventBus.$on('closePopups', (element?) => {
      if (element !== this) {
        this.show = false;
        this.$emit('close');
      }
    })
  }

}
</script>



<style lang='scss' scoped>

.popup-root {
  position: relative;
    
  .popup-box{
    position: absolute;
    display: flex;
    // justify-content: center;
    // align-items: center;
    background-color: white;
    top: calc(100% + 15px);
    border-radius: 5px;
    box-shadow: 0 0 20px rgba(10,10,10,0.2);
    height: auto;
    min-height: 200px;
    min-width: 250px;
    width: auto;
    max-height: 80vh;
    max-width: 80vw;
    flex-flow: row nowrap;
    z-index: 10011;

    .center {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
    }

    &.center {
      left: 50%;
      transform: translateX(-50%);
    }

    &.left { left: 0 }

    &.right { right: 0 }


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
  }


  $triangleSize: 13px;
  $triangleColor: #FFF;

  .triangle{
    position: absolute;
    z-index: 10009;
    width: 0;
    height: 0;
    border-left: $triangleSize solid transparent;
    border-right: $triangleSize solid transparent;
    border-top: $triangleSize solid $triangleColor;
    filter: drop-shadow(0px -6px 4px rgba(50,50,50, 0.1));

    &.up {
      border-bottom: $triangleSize solid $triangleColor;
      border-top: $triangleSize solid transparent;
    }

    &.left {
      border-left: $triangleSize solid transparent;
      border-right: $triangleSize solid transparent;
      border-top: $triangleSize solid $triangleColor;
    }

    &.bottom {bottom: 100%;}
    &.top {top: 100%}
    &.right { right: 5px;}
    &.center {
      left: 50%;
      @include translateX(-50%);
    }
  }
}


</style>

