<template>
  <div class='MovingDetail' v-if='movingEvent'>
    <div class='moving-cover'>
      <BackgroundLoader @loaded='imagePrevisuLoaded = true' class='cover-image' :src='backgroundCover'/>
      <div class='icon-enlarge' v-if="imagePrevisuLoaded" @click='toggleImage(true)'>
        <SvgIcon :src='require("@icons/moving/fullscreen.svg")' color='white' :size='60'/>
      </div>
    </div>
    <UITabs :tabs='tabs' v-if='canSeeInfos'/>
    <div class='child-views'>
      <transition name='slide' mode='out-in'>
        <router-view/>
      </transition>
    </div>
    <div class='image-previsu'>
      <UIModal :show='imagePrevisu' @close='toggleImage(false)' full onlyContent :width='900'>
        <BackgroundLoader :src='backgroundCover' :absolute='true'/>
      </UIModal>
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
import {UITabs, BackgroundLoader, UIModal, SvgIcon} from '@components'
import {ITab} from '@types';

@Component({
  components: {UITabs, BackgroundLoader, UIModal, SvgIcon}
})
export default class MovingDetail extends Vue {
  

  public tabs: ITab[] = [
    {title: 'Informations',icon: require('@icons/infos.svg'), to: {name: routesNames.movingInfos, params: {movingId: this.paramId}}},
    {title: 'Participants validés',icon: require('@icons/done.svg'),badge: this.movingEvent.userParticipating?this.movingEvent.userParticipating.length:null, to: {name: routesNames.movingParticipants, params: {movingId: this.paramId}}},
    {title: 'Demandes',condition: this.isMovingMine,badge: this.movingEvent.userNotParticipating?Object.values(this.movingEvent.userNotParticipating).length:null, icon: require('@icons/moving/inbox.svg'), to: {name: routesNames.movingDemandes, params: {movingId: this.paramId}}},
    {title: 'Inviter des déménageurs', condition: this.isMovingMine, icon: require('@icons/moving/invite.svg'),childs: true, to: {name: routesNames.movingInvite, params: {movingId: this.paramId}}},
    {title: 'Offres partenaires',condition: this.isMovingMine,  icon: require('@icons/moving/offer.svg'),to: {name: routesNames.movingOffers, params: {movingId: this.paramId}}},
  ]
  public imagePrevisu = false;
  public imagePrevisuLoaded = false;

  get canSeeInfos() {
    if (this.isMovingMine) return true;
    else {
      if (this.movingEvent.userParticipating) {
        return this.movingEvent.userParticipating.some(m => m.id == LoginStore.state.userInfos.id)
      }
      return false;
    }
  }

  get paramId() {
    return MovingStore.state.oneAnnouncement?MovingStore.state.oneAnnouncement.uuid: null;
  }

  public backgroundCover = null;

  get movingEvent() {return MovingStore.state.oneAnnouncement}
  get isMovingMine() {return this.movingEvent.user.id == LoginStore.state.userInfos.id}

  toggleImage(value: boolean) {
    this.imagePrevisu = value;
  }

  beforeDestroy() {
    MovingStore.mutations.updateOneAnnouncement(null)
  }

  created() {
    this.backgroundCover = this.movingEvent.staticMap;
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
    height: auto;
    position: relative;
    background-color: $g50;
    overflow: hidden;
    height: 300px;
    cursor: pointer;

    .image-cover {
      z-index: 1;
    }

    &:hover .icon-enlarge {
      opacity: 1;
    }

    .icon-enlarge {
      position: absolute;
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      background-color: rgba(0,0,0,0.4);
      align-items: center;
      z-index: 3;
      opacity: 0;
      transition: opacity 0.3s;
    }
  }

  .child-views {
    display: flex;
    position: relative;
    flex-flow: row nowrap;
    width: 100%;
    height: auto;
    padding-top: 20px;
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

