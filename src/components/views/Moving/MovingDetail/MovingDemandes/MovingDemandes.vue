<template>
  <div class='Demandes'>
    <div v-if='demandes' class='list'>
      <Demande :demande='demande' v-for='demande of demandes' :key='demande.id'/>
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
import Demande from './Demande.vue';

@Component({
  components: {
    FormMessage, SvgIcon, Demande
  },
})
export default class MovingDemandes extends Vue {
  
  get movingEvent() {return MovingStore.state.oneAnnouncement}

  get demandes() {
    return this.movingEvent.userNotParticipating;
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


  .list {
    
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

