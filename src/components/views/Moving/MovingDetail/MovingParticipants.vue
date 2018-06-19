<template>
  <div class='Participants'>
    <ul class='mover-list' v-if='participantsList'>
      <MoverCard :mover='mover' v-for='mover of participantsList' :key='mover.id'
        :canDelete='isMovingMine' :isMe='mover.id == myId' note display minimal/>
    </ul>
    <div v-else class='no-result flexy'>
      <SvgIcon :src='require("@icons/divers/face_bad.svg")' 
        :size='50' color='#5a5a5a'/>
      Aucun participants
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop} from 'vue-property-decorator';
import { StarRating, SvgIcon, UISwitch, FormMessage } from '@components';
import moment from 'moment';
import MoverCard from '@views/Movers/MoverCard.vue';
import {MovingStore, LoginStore} from '@store';
import axios from 'axios';

@Component({
  components: {
    FormMessage, SvgIcon, MoverCard
  },
})
export default class MovingParticipants extends Vue {
  
  get participantsList() {
    return MovingStore.state.oneAnnouncement.usersParticipating;
  }

  get myId() {return LoginStore.state.userInfos.id}

  get movingEvent() {return MovingStore.state.oneAnnouncement}
  get isMovingMine() {return this.movingEvent.user.id == LoginStore.state.userInfos.id}


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
    flex-flow: row wrap;
    flex: 1 1 auto;
    padding-top: 20px;
    justify-content: center;
    align-items: flex-start;

  }
}
 
</style>

