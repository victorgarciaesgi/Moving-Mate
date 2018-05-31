<template>
  <div class='MovingDetail' v-if='movingEvent'>
    <div class='moving-cover' :style='backgroundCover'></div>
    <UITabs :tabs='tabs' v-if='isMovingMine'/>
    <div class='child-views'>
      <transition name='slide' mode='out-in'>
        <router-view/>
      </transition>
    </div>
  </div>
  <div v-else class='noResult'>
    Aucun déménagement trouvé
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop} from 'vue-property-decorator';
import { MovingStore, LoginStore } from '@store';
import { routesNames } from '@router';
import {UITabs} from '@components'
import {ITab} from '@types';

@Component({
  components: {UITabs}
})
export default class MovingDetail extends Vue {
  

  public tabs: ITab[] = [
    {title: 'Informations',icon: require('@icons/infos.svg'), to: {name: routesNames.movingInfos, params: {movingId: this.paramId}}},
    {title: 'Participants validés',icon: require('@icons/done.svg'), to: {name: routesNames.movingParticipants, params: {movingId: this.paramId}}},
    {title: 'Demandes',icon: require('@icons/moving/inbox.svg'), to: {name: routesNames.movingDemandes, params: {movingId: this.paramId}}},
    {title: 'Inviter des déménageurs',icon: require('@icons/moving/invite.svg'),childs: true, to: {name: routesNames.movingInvite, params: {movingId: this.paramId}}},
    {title: 'Offres partenaires', icon: require('@icons/moving/offer.svg'),to: {name: routesNames.movingOffers, params: {movingId: this.paramId}}},
  ]

  get paramId() {
    return MovingStore.state.oneAnnouncement?MovingStore.state.oneAnnouncement.id: null;
  }

  get backgroundCover() {
    return {backgroundImage: `url(${this.movingEvent?this.movingEvent.staticMap:null})`}
  }

  get movingEvent() {return MovingStore.state.oneAnnouncement}
  get isMovingMine() {return this.movingEvent.user.id == LoginStore.state.userInfos.id}

  beforeDestroy() {
    MovingStore.mutations.updateOneAnnouncement(null)
  }

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
    position: relative;
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
      overflow-x: auto;

      li.tab {
        display: flex;
        color: $g90;
        font-size: 16px;
        padding: 0 10px 0 10px;

        a {
          span {
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
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

