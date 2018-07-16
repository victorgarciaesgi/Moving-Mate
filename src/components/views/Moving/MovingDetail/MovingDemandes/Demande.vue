<template>
  <div class='demande'>
    <MoverCard :mover='demande' display/>
    <div class='infos'>
      <div class='properties'>
        <div class='prop'>
          <span class='title'>Type de demande:</span>
          <span class='value'>{{getHelpString(demande.help)}}</span>
        </div>
        <div class='prop'>
          <span class='title'>Véhicule:</span>
          <span class='value'>{{demande.proposeCar?'Oui': 'Non'}}</span>
        </div>
        <div class='prop' v-if='demande.message'>
          <span class='title'>Message</span>
          <span class='value'>{{demande.message}}</span>
        </div>
      </div>
      <div class='actions'>
        <div class='button button-delete' @click='refuseDemande'>Refuser
          <img v-if='loadingRefuse' src="~@images/loading.svg" height="20" width="20">
        </div>
        <div class='button button-accept' @click='acceptDemande'>Accepter
          <img v-if='loadingAccept' src="~@images/loading.svg" height="20" width="20">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop} from 'vue-property-decorator';
import { StarRating, SvgIcon, UISwitch, FormMessage, FormButton } from '@components';
import moment from 'moment';
import Api from '@api';
import MoverCard from '@views/Movers/MoverCard.vue';
import {MovingStore, NotificationsStore} from '@store';
import {routesNames} from '@router';
import { IDemande } from '@types';
import { AlertsElement } from '@classes';

@Component({
  components: {
    FormMessage, SvgIcon, MoverCard
  },
})
export default class Demande extends Vue {

  @Prop() demande: IDemande;

  public loadingRefuse = false;
  public loadingAccept = false;

  
  get movingEvent() {return MovingStore.state.oneAnnouncement}

  get demandes() {
    return MovingStore.state.oneAnnouncement.userNotParticipating;
  }

  get getHelpString() {
    return id => {
      return ['Pour le départ seulement', `Pour l'arrivéee seulement`, `Pour le trajet seulement`, `Pour tout`][id + 1];
    }
  }

  async acceptDemande() {
    if (this.movingEvent.userParticipating) {
      if (this.movingEvent.userParticipating.length >= this.movingEvent.menRequired) {
        new AlertsElement.WarningAlert({
          title: 'Nombre maximum de déménageurs atteint',
          message: "Vous ne pouvez plus accepter de déménageurs"
        })
        return;
      }
    } 
    this.loadingAccept = true;
    try {
      const response = await MovingStore.actions.acceptDemande(this.demande.participationId);
      MovingStore.actions.getAnnouncementDetails({id: this.movingEvent.uuid, force: true});
      NotificationsStore.actions.addNotification({
        type: 'success',
        message: 'Demande acceptée'
      })
    } finally {
      this.loadingAccept = false;
    }
  }

  async refuseDemande() {
    this.loadingRefuse = true;
    try {
      const response = await MovingStore.actions.refuseDemande(this.demande.participationId)
      MovingStore.actions.getAnnouncementDetails({id: this.movingEvent.uuid, force: true});
      NotificationsStore.actions.addNotification({
        type: 'success',
        message: 'Demande refusée'
      })
    } finally {
      this.loadingRefuse = false;
    }
  }

  get inviteRoute() {
    return {name: routesNames.movingInvite, params: {movingId: this.movingEvent.uuid}}
  }

}
</script>



<style lang='scss' scoped>
 

.demande {
  display: flex;
  flex-flow: row nowrap;
  border-radius: 5px;
  margin-bottom: 20px;
  position: relative;
  justify-content: center;
  align-items: center;

  .infos {
    display: flex;
    width: 300px;
    flex-flow: column nowrap;
    padding-left: 5px;
    background-color: white;
    border: 1px solid $mainStyle;
    height: 310px;
    margin-left: -20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);

    .properties {
      display: flex;
      flex-flow: column nowrap;
      flex: 1 1 auto;

      .prop {
        display: flex;
        flex-flow: column nowrap;
        margin-bottom: 10px;

        .title {
          font-weight: bold; 
          height: 30px;
          background-color: $w245;
          font-size: 15px;
          margin-bottom: 5px;
          padding-left: 15px;
          line-height: 30px;
        }

        .value {
          font-size: 15px;
          text-align: center;
          font-weight: bold;
        }
      }
    }

    .actions {
      display: flex;
      flex: 0 0 auto;
      padding: 10px;
      justify-content: space-around;
      align-items: center;
      .button {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 35px;
        border-radius: 5px;
        padding: 0 15px 0 15px;
        margin-top: 5px;
        font-size: 16px;
        font-weight: bold;
        @include userselect;
        cursor: pointer;

        &.button-delete {
          background-color: white;
          color: $red1;
          &:hover {background-color: $w245}
          &:active { background-color: $w235}
        }

        &.button-accept {
          background-color: white;
          color: $mainStyle;
          &:hover {background-color: $w245}
          &:active { background-color: $w235}
        }

        img {
          margin-left: 5px;
        }
      }
    }
  }
}


</style>

