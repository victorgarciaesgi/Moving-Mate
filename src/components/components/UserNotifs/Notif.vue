<template>
  <div class='notif' :class="{read: !notif.read}">
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
        <div class='time'>Il y a 9 minutes</div>
      </div>
    </div>
    <div class='actions' v-if="notif.type == 'invitation'">
      <div class='bouton'>Voir l'annonce</div>
      <div class='bouton red'>Refuser</div>
      <div class='bouton blue'>Accepter</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import {UserStore} from '@store';
import Api from '@api';
import {INotif} from '@types';
import {SvgIcon} from '@components'

@Component({
  components: {SvgIcon}
})
export default class Notif extends Vue {

  @Prop() notif: INotif;

  get getIcon() {
    if (this.notif.type == 'success') return require('@icons/notifs/success.svg')
  }

  get getProfil() {
    return {backgroundImage: `url('${require('@images/user.jpg')}')`}
  }

}
</script>



<style lang='scss' scoped>

.notif {
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  height: auto;
  padding: 10px 10px 10px 10px;
  background-color: white;
  color: $g60;

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
    }
  }
}

</style>

