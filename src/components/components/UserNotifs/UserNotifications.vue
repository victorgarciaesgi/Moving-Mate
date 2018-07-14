<template>
  <div class='Notifs'>
    <div v-if='notifications.length' class='notif-list'>
      <Notif v-for="notif of notifications" :key='notif.id' :notif='notif'/>
    </div>
    <div v-else class='center' >
      <SvgIcon :src='require("@icons/notifs/notification_none.svg")'/>
      <span>Aucune notification</span>
    </div>
  </div>

  
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import {UserStore} from '@store';
import Api from '@api';
import {SvgIcon} from '@components'
import {INotif} from '@types';
import Notif from './Notif.vue';

@Component({
  components: {Notif, SvgIcon}
})
export default class UserNotifications extends Vue {

  // get notifications() : INotif[]{
  //   return [
  //     {
  //       id: 0, 
  //       type: 'invitation', 
  //       read: false,
  //       createdAt: 0,
  //       text: `Victor vous a invité à l'aider pour son déménagement`,
  //       content: {
  //         userFrom: {
  //           avatar: require('@images/user.jpg'),
  //           id: 10,
  //           firstname: 'Victor'
  //         },
  //         announcementUuId: '06f0d676-7dd1-11e8-8c7f-34363bcb2f1c',
  //         participationId: 10
  //       }
  //     },
  //     {
  //       id: 1, 
  //       type: 'success', 
  //       read: true, 
  //       createdAt: 0,
  //       text: `Maxence a accepté votre demande d'aide`,
  //       content: {
  //         userFrom: {
  //           avatar: require('@images/user.jpg'),
  //           id: 10,
  //           firstname: 'Victor'
  //         },
  //         announcementUuId: '06f0d676-7dd1-11e8-8c7f-34363bcb2f1c',
  //         participationId: 11
  //       }
  //     }
  //   ]
  // }

  get notifications() : INotif[]{
    return UserStore.state.notifications;
  }

  get readNotifs() {
    return this.notifications.reduce((acc, curr, index) => {
      if (curr.read) return acc++;
    }, 0)
  }


}
</script>



<style lang='scss' scoped>

.Notifs {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;

  .center {
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
  }
  
  .notif-list {
    display: flex;
    width: 100%;
    flex-flow: column wrap;
    overflow: hidden;
    border-radius: 5px;
  }
}

</style>

