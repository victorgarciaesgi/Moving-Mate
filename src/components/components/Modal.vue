<template>
  <transition name='bounce'>
    <div v-if='show' class='modal-base' @click='closeModal()'
      :class='{full: !isPopup}'>
      <div class="modal-window" @click.stop='emitClosePopup()' :style='{
          maxHeight: height?`${height}px`:"",
          width: width?`${width}px`:"",
        }'>
        <template v-if='!onlyContent'>
          <div class='header' v-if='isPopup && $slots.header'>
            <div class='header-slot' >
              <slot name='header'></slot>
            </div>
            <div class='close-wrap'>
              <img src='~@icons/quit.svg' @mousedown.prevent="closeModal()">
            </div>
          </div>
          <div class='content'>
            <slot name='content'></slot>
          </div>
          <div class='footer' v-if='$slots.footer' :class='{footerShadow}'>
            <slot name='footer'></slot>
          </div>
        </template>

        <template v-else>
          <slot></slot>
        </template>

      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { EventBus } from '@store';

@Component({})
export default class UIModal extends Vue {
  
  @Prop() show: boolean;
  @Prop({required: false, default: true}) isPopup: boolean;
  @Prop({required: false}) height: number;
  @Prop({required: false}) width: number;
  @Prop({requried: false}) onlyContent: boolean
  @Prop({}) footerShadow: boolean;

  $slots;

  closeModal(){
    this.$emit('close', true);
  }

  emitClosePopup() {
    EventBus.$emit('closePopups');
  }

  mounted() {
  }

}
</script>



<style lang='scss' scoped>

.modal-base{
  position: fixed;
  height: 100%;
  left: 0;
  top: 0;
  width: 100%;
  background-color: transparentize($g20,0.7);
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  align-items: center;
  align-content: center;
  overflow-y: auto;
  z-index: 10002;

  &.full{
    z-index: 2;
    background-color: $w245;
  
    .modal-window {
      border-radius: 5px;
    }
  }

  &:before {
    content: '';
    height: 30px;
    width: 100%;
  }

  &:after {
    content: '';
    height: 30px;
    width: 100%;
  }

  .modal-window{
    display: flex;
    position: relative;
    background-color: white;
    border-radius: 3px;
    box-shadow: 0 0 20px rgba(20, 20, 20, 0.3);
    height: auto;
    min-height: 200px;
    min-width: 300px;
    max-width: 80vw;
    flex-flow: column nowrap;
    overflow: hidden;
    transition: height 0.2s;

    div.header {
      display: flex;
      flex-flow: row wrap;
      flex: 0 0 auto;
      height: 40px;
      padding-left: 10px;
      font-weight: bold;
      border-bottom: 1px solid $w230;

      div.header-slot{
        display: flex;
        flex: 1;
        align-items: center;
      }

      div.close-wrap {
        display: flex;
        width: 40px;
        cursor: pointer;
        flex: 0 0 auto;
        justify-content: center;
        align-items: center;
      }

    }

    div.content {
      display: flex;
      position: relative;
      flex-flow: column wrap;
      flex: 1 1 auto;
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
      // border-top: 1px solid $w230;

      &.footerShadow {
        box-shadow: 0 2px 20px rgba(0,0,0,0.1);
      }
    }

  }
}

.bounce-enter-active {
  transition: color 0.5s, opacity 0.2s;
  .modal-window {
    animation: bounce-in 0.5s;
  }
}
.bounce-leave-active {
  transition: color 0.2s, opacity 0.2s;
  .modal-window {
    animation: bounce-out 0.2s;
  }
}

.bounce-enter, .bounce-leave-to {
  opacity: 0;
}




@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.4);
    opacity: 0;
  }
}





</style>

