<template>
  <transition name='hide'>
    <ul id="alertes-container" v-show='notificationList.length'>
      <transition-group name='alert'>
        <component :is='isLink(alert)'
          :to='alert.link'
          v-for='alert in notificationList'
          :key='alert.id' 
          :type='alert.type'
          class='alert'>
          <div class='alert-icon'>
            <img src="~@icons/notifs/success.svg" v-if='alert.type == "success"'>
            <img src="~@icons/notifs/error.svg" v-else-if='alert.type == "error"'>
            <img src="~@icons/notifs/warning.svg" v-else-if='alert.type == "warning"'>
            <img src="~@icons/notifs/infos.svg" v-else-if='alert.type == "alert"'>
          </div>
          <div class='alert-text'>
            <span>{{alert.message}}</span>
          </div>
          <div class='alert-quit' @click.prevent='deleteAlert(alert)'>
            <img src='~@icons/quit_white.svg'>
          </div>
        </component>
      </transition-group>
    </ul>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { NotificationsStore } from "@modules";
import { INotification } from '@types';

@Component({})
export default class Notifications extends Vue {

  get notificationList() {return NotificationsStore.state.notificationList}
  private deleteAlert = NotificationsStore.mutations.deleteAlert;

  get isLink() {
    return (notif: INotification) => {
      if (notif.link) {
        return 'router-link';
      }
      return 'li';
    }
  }

}
</script>



<style lang='scss' scoped>
ul#alertes-container {
  position: fixed;
  top: $headerHeight;
  left: 0;
  padding: 10px;
  width: 380px;
  height: auto;
  z-index: 10001;
  display: flex;
  flex-direction: column;

  .alert {
    position: relative;
    height: auto;
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    margin-bottom: 5px;
    padding: 13px 10px 13px 0px;
    box-shadow: 0 0 10px rgba(20, 20, 20, 0.2);
    font-size: 14px;
    color: white;
    text-align: center;
    font-weight: bold;
    border-radius: 3px;
    background-color: $g70;
    line-height: 17px;

    @at-root {
      a#{&} {
        cursor: pointer;
      }
    }

    div {
      display: flex;
      align-content: center;
      align-items: center;
      justify-content: center;

      &.alert-text {
        flex: 1 1 auto;
      }
      &.alert-icon {
        width: 50px;
        flex: 0 0 auto;
        img {
          height: 27px;
          width: 27px;
        }
      }
      
      &.alert-quit {
        width: 30px;
        cursor: pointer;
        flex: 0 0 auto;

        img {
          height: 20px;
          width: 20px;
        }
      }
    }



  }
}

.hide-leave-active {
  transition: all 0.6s;
}



.alert-enter-active, .alert-leave-active {
  transition: all 0.5s;
}

.alert-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.alert-enter {
  opacity: 0;
  transform: translateX(-100%);
}

.alert-enter-to {
  transform: translateX(0);
}

</style>

