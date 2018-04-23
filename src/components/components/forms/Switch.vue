<template>
  <div class="switch">
    <ul class="options">
      <li class='option' v-for='(option, index) in options' 
        :key='option'
        :style='{width: percent + "%"}'
        @click.stop='setIndex(index)'>
        {{option}}
      </li>
      <div @click.stop class='cursor' :style='getPosition'>
        {{options[selected]}}
      </div>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import shortid from 'shortid';

@Component({})
export default class UISwitch extends Vue {

  @Prop() value: boolean;
  @Prop() options: Array<string>;
  @Prop() name: string;

  public selected = 0;
  public percent: number;
  public id;

  get getPosition() {
    return {left: this.percent*this.selected + '%', width: this.percent + '%'};
  }

  setIndex(index: number) {
    this.selected = index;
  }

  updateValue(value){
    this.$emit('input', value);
  }

  created() {
    this.percent = Math.round(100 / this.options.length);
    this.id = shortid.generate();
  }
}
</script>



<style lang='scss' scoped>
.switch {
  position: relative;
  display: flex;
  flex-flow: row wrap;

  ul.options {
    position: relative;
    display: flex;
    justify-content: center;
    flex-flow: row wrap;
    border-radius: 40px;
    width: auto;
    background-color: $w240;
    font-size: 14px;

    li.option {
      display: flex;
      flex-flow: row wrap;
      flex: 1 0 0;
      font-size: 14px;
      width: auto;
      padding: 5px 10px 5px 10px;
    }

    .cursor {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0;
      height: 100%;
      padding: 5px 10px 5px 10px;
      border-radius: 40px;
      background-color: white;
      transition: left 0.3s;
      font-weight: bold;
      box-shadow: 0 0 5px rgba(0,0,0,0.1);
    }
  }
}

</style>

