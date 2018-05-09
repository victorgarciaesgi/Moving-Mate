<template>
  <div class="switch">
    <ul class="options">
      <li class='option' v-for='(option, index) in options' 
        :key='index'
        :class='{selected: index == value}'
        @click.stop='updateValue(index)'>
          {{option}}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import shortid from 'shortid';

@Component({})
export default class UISwitch extends Vue {

  @Prop() value: number;
  @Prop() options: Array<string>;
  @Prop() name: string;

  public percent: number;
  public id;

  updateValue(value: number) {
    this.$emit('input', value);
  }

  created() {
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
    overflow: hidden;
    width: auto;
    border-radius: 5px;
    background-color: $w240;
    font-size: 14px;
    border: 1px solid $w230;

    li.option {
      display: flex;
      flex-flow: row wrap;
      flex: 1 0 0;
      font-size: 14px;
      width: auto;
      padding: 5px 10px 5px 10px;

      &.selected {
        background-color: white;
      }
    }
  }
}

</style>

