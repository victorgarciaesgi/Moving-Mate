<template>
  <div class='UITabs' >
    <ul class='tab-list' ref='tabList'>
      <router-link class='tab' tag='li' v-for='tab in filteredTabs' :key='tab.title' 
        :class='{childs: tab.childs}' :to='tab.to'>
          <div class='icon normal'><SvgIcon :size='22' color='#5a5a5a' v-if='tab.icon' :src='tab.icon' /></div>
          <div class='icon blue'><SvgIcon :size='22' :color='css.mainStyle' v-if='tab.icon' :src='tab.icon' /></div>
          <span>{{tab.title}}</span>
          <div v-if='tab.badge' class='badge'>{{tab.badge}}</div>
      </router-link>
    </ul>
  </div>
</template>



<script lang="ts">
import Vue from "vue";
import {Component, Prop} from "vue-property-decorator";
import {SvgIcon} from '@components';
import {ITab} from '@types'

@Component({
  components: {SvgIcon}
})
export default class UITabs extends Vue {

  @Prop() tabs: Array<ITab>;

  get filteredTabs() {
    return this.tabs.filter(m => {
      if (m.condition == null) {
        return true
      } else if (m.condition) {
        return true
      }
      return false;
    })
  }

  public css = require('@css');

  mounted() {
    this.$refs['tabList'].addEventListener("touchstart", () => {}, <any>{ passive: true });
  }

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

      .badge {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 7px 0 7px;
        height: 20px;
        background-color: $g90;
        font-size: 12px;
        color: white;
        border-radius: 40px;
        margin-left: 5px;
      }

      &.childs.router-link-active, &.router-link-exact-active{
        color: $mainStyle;
        border-color: $mainStyle;

        .icon.blue {
          display: block;
        }

        .badge {background-color: $mainStyle}

        .icon.normal {
          display: none;
        }
      }
    }
  }
}


</style>

