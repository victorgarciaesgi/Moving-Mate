<template>
  <div class="Step-root">
    <ul class='step-list'>
      <li class='step-item' 
        @click="emitClick(index)"
        v-for="(stepItem, index) in steps" :key='stepItem'
        :class='{active: isActive(index), passed: isPassed(index)}'>
        <div class='line'></div>
        <div class='icon'>
          <SvgIcon :src='stepItem' :size='30' :color='getColor(index)' />
        </div>
        <div class='line'></div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import {SvgIcon} from '@components'

@Component({
  components: {SvgIcon}
})
export default class UISteps extends Vue {

  @Prop({required: true}) step: number;
  public css = require('@css');

  public steps = [
    require('@icons/moving/phone.svg'),
    require('@icons/moving/content.svg'),
    require('@icons/moving/valid.svg')
  ]

  emitClick(index: number) {
    this.$emit('click', index);
  }

  get isActive() {return index => index === this.step;}
  get isPassed() {return index => index < this.step;}
  get getColor() {return index => {
    if (this.isActive(index) || this.isPassed(index)) {
      return 'white'
    } else {
      return 'rgb(90,90,90)';
    }
  }}
  
}
</script>



<style lang='scss' scoped>


.Step-root {
  position: relative;
  display: flex;
  width: 100%;
  flex: 0 0 auto;
  flex-flow: column nowrap;
  justify-content: center;
  padding: 10px;

  ul.step-list {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    align-content: center;
    justify-content: center;
    padding: 10px 30px 10px 30px;

    li.step-item {
      display: flex;
      flex-flow: row nowrap;
      flex: 1 1 auto;
      align-content: center;
      align-items: center;
      justify-content: center;

      &:first-child .line:first-child {
        opacity: 0;
      }
      &:last-child .line:last-child {
        opacity: 0;
      }

      &.active, &.passed {
        .line, .icon {
          background-color: $mainStyle;
        }
      }

      .icon {
        flex: 0 0 auto;
        border-radius: 100%;
        background-color: $w230;
        padding: 10px;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .line {
        flex: 1 1 auto;
        height: 4px;
        background-color: $w230;
        transition: background-color 0.2s;
      }
    }
  }
}

</style>

