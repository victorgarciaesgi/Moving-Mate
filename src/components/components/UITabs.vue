<template>
  <div class='UITabs' >
    <ul class='tab-list' @scroll.passive>
      <router-link class='tab' tag='li' v-for='tab in tabs' :key='tab.title' 
        :class='{childs: tab.childs}' :to='tab.to'>
          <div class='icon normal'><SvgIcon :size='22' color='#5a5a5a' v-if='tab.icon' :src='tab.icon' /></div>
          <div class='icon blue'><SvgIcon :size='22' :color='css.mainStyle' v-if='tab.icon' :src='tab.icon' /></div>
          <span>{{tab.title}}</span>
      </router-link>
    </ul>
  </div>
</template>



<script lang="ts">
import Vue from "vue";
import {Component, Prop} from "vue-property-decorator";
import {SvgIcon} from '@components';


@Component({
  components: {SvgIcon}
})
export default class UITabs extends Vue {

  @Prop() tabs: Array<any>;

  public css = require('@css');

}
</script>



<style lang='scss' scoped>

.UITabs {
  display: flex;
  position: relative;
  position: sticky;
  top: $headerHeight;
  justify-content: center;
  align-items: center;
  background-color: white;
  z-index: 8899;
  box-shadow: 0 6px 10px rgba(100,100,100,0.1);

  ul.tab-list {
    display: flex;
    flex-flow: row nowrap;
    overflow-x: auto;

    li.tab {
      display: flex;
      flex-flow: row nowrap;
      color: $g90;
      font-size: 14px;
      padding: 0 10px 0 10px;
      align-items: center;
      transition: all 0.3s;
      font-weight: bold;
      border-bottom: 2px solid transparent;
      margin: 0 5px 0 5px;
      cursor: pointer;

      &:hover {
        border-color: $w150;
      }

      .icon.icon.blue {
        display: none;
      }

      span {
        display: flex;
        flex-wrap: nowrap;
        white-space: nowrap;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 15px 0 15px 5px;
      }

      &.childs.router-link-active, &.router-link-exact-active{
        color: $mainStyle;
        border-color: $mainStyle;

        .icon.blue {
          display: block;
        }

        .icon.normal {
          display: none;
        }
      }
    }
  }
}


</style>

