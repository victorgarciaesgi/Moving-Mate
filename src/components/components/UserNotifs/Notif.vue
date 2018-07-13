<template>
  <div class='notif'>
    <div class='infos'>
      <div class='icon'>
        <div class='profil' :style='getProfil'></div>
        <!-- <SvgIcon v-else :src='getIcon' :size='30' color='white'/> -->
      </div>
      <div class='text'>
        {{notif.content.text}}
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
  padding: 5px 5px 10px 5px;
  background-color: white;
  color: $g60;

  &:not(:last-child) {
    border-bottom: 1px solid $w235;
    margin-bottom: 10px;
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
    }

    .text {
      display: flex;
      flex: 1 1 auto;
      white-space: normal;
      line-height: 20px;
      padding: 5px;
      font-size: 15px;
      align-items: center;
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

