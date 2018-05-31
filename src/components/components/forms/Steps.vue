<template>
  <div class="Step-root">
    <ul class='step-list'>
      <li class='step-item' 
        @click="emitClick(index)"
        v-for="(stepItem, index) in steps" :key='stepItem'
        :class='{active: isActive(index), passed: isPassed(index)}'>
        <div class='line'></div>
        <div class='icon'>
          <SvgIcon :src='stepItem' :size='25' :color='getColor(index)' />
        </div>
        <div class='line'></div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import SvgIcon from '../widgets/Divers/SvgIcon.vue';

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
    if (index < this.step) {
      this.$emit('click', index);
    }
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

  ul.step-list {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    align-content: center;
    justify-content: center;
    padding: 10px 60px 10px 60px;

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

      &.passed {
        .line:last-child {
          background-color: $mainStyle;
        }
        .icon {
          cursor: pointer;
        }
      }

      .icon {
        flex: 0 0 auto;
        border-radius: 100%;
        background-color: $w230;
        padding: 10px;
      }

      .line {
        flex: 1 1 auto;
        height: 4px;
        background-color: $w230;
      }
    }
  }
}

</style>

