<template>
  <div class='Notifs'>
    <div v-if='notifications.length' class='notif-list'>
      <div class='header'>
        <span>Notifications: </span>
        <span class='count'>{{notifications.length}}</span>
      </div>
      <div class='list'>
        <Notif v-for="notif in orderBy(notifications, 'createdAt', -1)" :key='notif.id' :notif='notif'/>
      </div>
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


  get notifications() : INotif[]{
    return UserStore.state.notifications;
  }


  get readNotifs() {
    return this.notifications.reduce((acc, curr, index) => {
      if (curr.read) return acc + 1;
    }, 0)
  }


}
</script>



<style lang='scss' scoped>

.Notifs {
  display: flex;
  position: relative;
  width: 100%;

  .center {
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  
  .notif-list {
    display: flex;
    width: 100%;
    height: 100%;
    flex-flow: column nowrap;
    overflow: hidden;
    border-radius: 5px;

    .header {
      display: flex;
      flex: 0 0 auto;
      align-items: center;
      padding-left: 10px;
      font-size: 14px;
      height: 35px;
      font-weight: bold;

      .count {
        margin-left: 5px;
        color: $mainStyle;
      }
    }

    .list {
      display: flex;
      flex: 1 1 auto;
      background-color: $w240;
      padding: 10px 10px 0 10px;
      flex-flow: column nowrap;
      justify-content: flex-start;
      overflow-y: auto;
    }
  }
}

</style>

