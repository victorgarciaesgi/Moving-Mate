<template>
  <div class='MovingDetail' v-if='movingEvent'>
    <div class='moving-cover' :style='backgroundCover'></div>
    <div class='moving-tabs'>
      <ul class='tab-list'>
        <li class='tab' v-for='tab in tabs' :key='tab.title'>
          <router-link :class='{childs: tab.childs}' :to='{name: tab.path, params: {movingId: tab.params}}'>
            <span>{{tab.title}}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class='child-views'>
      <transition name='fade' mode='out-in'>
        <router-view/>
      </transition>
    </div>
  </div>
  <div v-else>
    Aucun déménagement trouvé
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop} from 'vue-property-decorator';
import { MovingStore, LoginStore } from '@store';
import { routesNames } from '@router';

@Component({})
export default class MovingDetail extends Vue {
  

  public tabs = [
    {title: 'Informations',childs: false, path: routesNames.movingInfos, params: this.paramId},
    {title: 'Inviter des déménageurs',childs: true, path: routesNames.movingInvite, params: this.paramId},
    {title: 'Offres partenaires',childs: false, path: routesNames.movingOffers, params: this.paramId}
  ]

  get paramId() {
    return MovingStore.state.oneAnnouncement?MovingStore.state.oneAnnouncement.id: null;
  }

  get backgroundCover() {
    return {backgroundImage: `url(${this.movingEvent?this.movingEvent.staticMap:null})`}
  }

  get movingEvent() {return MovingStore.state.oneAnnouncement}
  get isMovingMine() {return this.movingEvent.user.id == LoginStore.state.userInfos.id}


}
</script>



<style lang='scss' scoped>

.MovingDetail {
  display: flex;
  position: relative;
  flex-flow: column wrap;
  width: 100%;
  min-height: 100%;
  height: auto;
  background-color: white;

  .moving-cover {
    display: flex;
    height: 300px;
    background-color: $g50;
  }

  .child-views {
    position: relative;
    width: 100%;
    height: auto;
  }

  .moving-tabs {
    display: flex;
    position: sticky;
    top: $headerHeight;
    justify-content: center;
    align-items: center;
    background-color: white;
    z-index: 100;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);

    ul.tab-list {
      display: flex;
      flex-flow: row nowrap;

      li.tab {
        display: flex;
        color: $g90;
        font-size: 16px;
        padding: 0 10px 0 10px;

        a {
          span {
            padding: 15px 10px 10px 10px;
          }

          &.childs.router-link-active{
            color: $g60;
            font-weight: bold;
            span {
              border-bottom: 2px solid $g60;
            }
          }
          &.router-link-exact-active {
            color: $g60;
            font-weight: bold;
            span {
              border-bottom: 2px solid $g60;
            }
          }
        }
      }
    }
  }
}
 
</style>

