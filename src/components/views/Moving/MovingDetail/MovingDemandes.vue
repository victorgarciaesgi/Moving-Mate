<template>
  <div class='Demandes'>
    <div v-if='demandes'>
      <div class='demande' v-for='demande of demandes' :key='demande.id'>
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
            <div class='prop'>
              <span class='title'>Message</span>
              <span class='value'>{{demande.message}}</span>
            </div>
          </div>
          <div class='actions'>
            <div class='button button-delete' @click='refuseDemande(demande.participationId)'>Refuser</div>
            <div class='button button-accept' @click='acceptDemande(demande.participationId)'>Accepter</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class='no-result flexy'>
      <SvgIcon :src='require("@icons/divers/face_bad.svg")' 
        :size='50' color='#5a5a5a'/>
      Aucune demande
      <router-link class='link' :to='inviteRoute'>Inviter des déménageurs</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop} from 'vue-property-decorator';
import { StarRating, SvgIcon, UISwitch, FormMessage } from '@components';
import moment from 'moment';
import Api from '@api';
import MoverCard from '@views/Movers/MoverCard.vue';
import {MovingStore, NotificationsStore} from '@store';
import {routesNames} from '@router';

@Component({
  components: {
    FormMessage, SvgIcon, MoverCard
  },
})
export default class MovingDemandes extends Vue {
  
  get movingEvent() {return MovingStore.state.oneAnnouncement}

  get demandes() {
    return MovingStore.state.oneAnnouncement.userNotParticipating;
  }

  get getHelpString() {
    return id => {
      return ['Pour le départ seulement', `Pour l'arrivéee seulement`, `Pour le trajet seulement`, `Pour tout`][id + 1];
    }
  }

  async acceptDemande(id: number) {
    try {
      const response = await MovingStore.actions.acceptDemande(id);
      MovingStore.actions.getAnnouncementDetails({id: this.movingEvent.uuid, force: true});
      NotificationsStore.actions.addNotification({
        type: 'success',
        message: 'Demande acceptée'
      })
    } catch(e) {

    }
  }

  async refuseDemande(id: number) {
    try {
      const response = await MovingStore.actions.refuseDemande(id)
      MovingStore.actions.getAnnouncementDetails({id: this.movingEvent.uuid, force: true});
      NotificationsStore.actions.addNotification({
        type: 'success',
        message: 'Demande refusée'
      })
    } catch(e) {

    }
  }

  get inviteRoute() {
    return {name: routesNames.movingInvite, params: {movingId: this.movingEvent.uuid}}
  }

}
</script>



<style lang='scss' scoped>
 

.Demandes {
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  justify-content: flex-start;
  align-items: center;


  .demande {
    display: flex;
    flex-flow: row nowrap;
    padding: 10px;
    box-shadow: 0 0 5px rgba(0,0,0,0.2);
    border-radius: 5px;
    margin-bottom: 20px;

    .infos {
      display: flex;
      width: 400px;
      flex-flow: column nowrap;
      padding: 5px;

      .properties {
        display: flex;
        flex-flow: column nowrap;
        flex: 1 1 auto;

        .prop {
          display: flex;
          flex-flow: column nowrap;
          margin-top: 10px;

          .title {
            font-weight: bold; 
            font-size: 16px;
          }

          .value {
            font-size: 14px;
          }
        }
      }

      .actions {
        display: flex;
        flex: 0 0 auto;
        padding: 5px;
        justify-content: space-around;
        align-items: center;
        .button {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          border-radius: 5px;
          padding: 0 30px 0 30px;
          margin-top: 5px;
          font-size: 16px;
          font-weight: bold;
          @include userselect;
          cursor: pointer;

          &.button-delete {
            background-color: $red1;
            color: white;
            &:hover {background-color: darken($red1, 5%);}
            &:active { background-color: darken($red1, 10%);}
          }

          &.button-accept {
            background-color: $mainStyle;
            color: white;
            &:hover {background-color: darken($mainStyle, 5%);}
            &:active { background-color: darken($mainStyle, 10%);}
          }

          img {
            margin-left: 5px;
          }
        }
      }
    }
  }

  .link {
    margin-top: 5px;
    color: $mainStyle;
    &:hover {
      text-decoration: underline;
    }
  }
}


</style>

