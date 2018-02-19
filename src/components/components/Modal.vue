<template>
  <div v-if='show' class='modal-base' @click='closeModal()' 
    :class='{
      full: !window
    }'>
    <div class="modal-window" @click.stop :style='{
        maxHeight: height?`${height}px`:"",
        width: width?`${width}px`:"",
      }'>
      <div class='header'>
        <div class='header-slot'>
          <slot name='header'></slot>
        </div>
        <div class='close-wrap'>
          <img src='~@icons/quit.svg' @click="closeModal()">
        </div>
      </div>
      <div class='content'>
        <slot name='content'></slot>
      </div>
      <div class='footer' >
        <slot name='footer'></slot>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";

@Component({})
export default class Modal extends Vue {
  
  @Prop() show: boolean;
  @Prop() window: boolean;
  @Prop({required: false}) height: number;
  @Prop({required: false}) width: number;

  closeModal(){
    this.$emit('close');
  }

}
</script>



<style lang='scss' scoped>

.modal-base{
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: transparentize($g20,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  z-index: 10002;

  &.full{
    z-index: 2;
    background-color: $w245
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
    max-height: 80vh;
    max-width: 80vw;
    flex-flow: column nowrap;
    overflow: hidden;
    
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
}


</style>

