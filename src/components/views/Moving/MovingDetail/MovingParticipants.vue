<template>
  <div class='Participants'>
    <ul class='mover-list' v-if='participantsList'>
      <li class='mover-section' v-for='mover of participantsList' :key='mover.id'>
        <MoverCard :mover='mover' embed />
        <div class='mover-infos'>
          <div class='infos'>
            <div class='info'>
              <span class='title'>Numéro de téléphone</span>
              <span class='value'>0681887787</span>
            </div>
            <div class='info'>
              <span class='title'>Adresse</span>
              <span class='value'>35 rue du Chibre Anal</span>
            </div>
          </div>
          <div class='mover-actions'>
            <div class='delete bouton'>
              <span>Supprimer</span>
            </div>
            <div class='present'>
              <span>Present</span>
            </div>
            <div class='absent'>
              <span>Absent</span>
            </div>
            <div class='note'>
              <span>Note</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div v-else class=''>Aucun participants</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop} from 'vue-property-decorator';
import { StarRating, SvgIcon, UISwitch, FormMessage } from '@components';
import moment from 'moment';
import MoverCard from '@views/Movers/MoverCard.vue';
import {MovingStore} from '@store';
import axios from 'axios';

@Component({
  components: {
    FormMessage, SvgIcon, MoverCard
  },
})
export default class MovingParticipants extends Vue {
  
  get participantsList() {
    return MovingStore.state.oneAnnouncement.participations.users;
  }

}
</script>



<style lang='scss' scoped>

.Participants {
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: center;
  align-items: flex-start;

  ul.mover-list {
    display: flex;
    flex-flow: column wrap;
    flex: 0 1 auto;
    width: 650px;

    li.mover-section {
      display: flex;
      height: auto;
      flex-flow: row nowrap;


    }
  }
}
 
</style>

