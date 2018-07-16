<template>
  <router-link :to='getPath' class='notif' :class="{read: !notif.read}">
    <div class='infos'>
      <div class='icon'>
        <div class='profil' :style='getProfil'></div>
        <div class='isNew' v-if='!notif.read'>
          <span>NEW</span>
        </div>
        <!-- <SvgIcon v-else :src='getIcon' :size='30' color='white'/> -->
      </div>
      <div class='details'>
        <div class='text'>
          {{notif.text}}
        </div>
        <div class='time'>{{fromNow}}</div>
      </div>
    </div>
    <div class='message' v-if='notif.message && notif.type == "invitation"'>
      <span class='text'>{{notif.message}}</span>
    </div>
    <div class='actions' v-if="notif.type == 'invitation'">
      <router-link :to='getPath' class='bouton'>Voir l'annonce</router-link>
      <div class='bouton red' @click.stop.prevent='refuseDemande'>Refuser
        <img v-if='loadingRefuse'  src="~@images/loading_grey.svg" height="16" width="16">
      </div>
      <div class='bouton blue' @click.stop.prevent='acceptDemande' >Accepter
        <img v-if='loadingAccept' src="~@images/loading_grey.svg" height="16" width="16">
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import {UserStore} from '@store';
import moment from 'moment';
import Api from '@api';
import {MovingStore, NotificationsStore} from '@store';
import {INotif} from '@types';
import {SvgIcon} from '@components'
import {routesNames} from '@router';

@Component({
  components: {SvgIcon}
})
export default class Notif extends Vue {

  @Prop() notif: INotif;

  public loadingRefuse = false;
  public loadingAccept = false;

  get getIcon() {
    if (this.notif.type == 'success') return require('@icons/notifs/success.svg')
  }

  get getPath() {return {name: routesNames.movingInfos, params: {movingId: this.notif.content.announcementUuid}}}

  get fromNow() {
    return moment(this.notif.createdAt * 1000).fromNow();
  }

  async acceptDemande() {
    this.loadingAccept = true;
    try {
      const response = await MovingStore.actions.acceptDemande(this.notif.content.participationId);
      NotificationsStore.actions.addNotification({
        type: 'success',
        message: 'Invitation acceptée'
      })
    } finally {
      this.loadingAccept = false;
    }
  }

  async refuseDemande() {
    this.loadingRefuse = true;
    try {
      const response = await MovingStore.actions.refuseDemande(this.notif.content.participationId)
      NotificationsStore.actions.addNotification({
        type: 'success',
        message: 'Invitation refusée'
      })
    } finally {
      this.loadingRefuse = false;
    }
  }


  get getProfil() {
    return {backgroundImage: `url('${this.notif.content.userFrom.avatar}')`}
  }

}
</script>



<style lang='scss' scoped>

.notif {
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  height: auto;
  flex: 0 0 auto;
  padding: 10px 10px 10px 10px;
  background-color: white;
  margin-bottom: 10px;
  border-radius: 5px;
  color: $g60;

  &:hover {
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }

  &:not(:last-child) {
    border-bottom: 1px solid $w235;
  }

  .infos {
    display: flex;
    position: relative;
    flex-flow: row nowrap;
    width: 100%;
    height: auto;

    .icon {
      display: flex;
      padding: 5px;
      flex: 0 0 auto;
      justify-content: center;
      align-items: center;

      .profil {
        width: 50px;
        height: 50px;
        @include bg-center;
        border-radius: 100%;
        border: 2px solid $mainStyle;
      }

      .isNew {
        position: absolute;
        left: -3px;
        top: -3px;
        span {
          background-color: $red1;
          color: white;
          border-radius: 40px;
          padding: 3px 8px 3px 8px;
          font-weight: bold;
          font-size: 10px;
        }
      }
    }

    .details {
      display: flex;
      flex-flow: column wrap;
      flex: 1 1 auto;
      justify-content: center;
      padding-left: 5px;

      .text {
        display: flex;
        white-space: normal;
        flex: 1 1 auto;
        line-height: 20px;
        font-size: 15px;
        align-items: flex-end;
      }

      .time {
        flex: 1 1 auto;
        color: $w120;
        font-size: 12px;
      }
    }
  }

  .message {
    padding: 10px 10px 10px 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .text {
      background-color: $w230;
      color: $g60;
      padding: 10px 20px 10px 20px;
      border-radius: 40px;
      font-size: 14px;
      white-space: normal;
    }
  }

  .actions {
    display: flex;
    flex-flow: row nowrap;
    padding: 10px 0 5px 0;

    .bouton {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 5px 0 5px;
      background-color: white;
      border: 1px solid $w230;
      color: $g60;
      font-weight: bold;
      border-radius: 3px;
      flex: 1 1 auto;
      padding: 5px;
      font-size: 14px;

      &.blue {color: $green4;}
      &.red {color: $red1}

      img {
        margin-left: 5px;
      }
    }
  }
}

</style>

