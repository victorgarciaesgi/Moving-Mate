<template>
  <li class='Mover-card' @click.prevent='redirectToDetail'>
    <div class="header">
      <div class='userPicture' >
        <BackgroundLoader :src='profilePic' />
      </div>
      <div class='userName'>
        <span class='value'>
          <span>{{userName}}</span> 
          <SvgIcon :src='require("@icons/movers/verified.svg")' :size='18' color='white'/>
        </span>
      </div>
      <div class='userDisponibility'>
        <div class='iconState'></div>
        <div class='stateValue'>Disponible</div>
      </div>
    </div>
    <div class='content'>
      <div class='userPrice'>
        <span class='value'>
          <strong>{{userPrice}}€</strong>
          <span>/heure</span>
        </span>
      </div>
      <ul class='userInfos'>
        <li class='place info'>
          <div class='icon'><SvgIcon :size='20' :color='css.mainStyle' :src="require('@icons/localisation.svg')"/></div>
          <span class='value'>
            <span class='city'>Paris</span>
            <span class='zip'>75001</span>
          </span>
        </li>
        <li class='place info'>
          <div class='icon'><SvgIcon :size='20' :color='css.mainStyle' :src="require('@icons/movers/happy.svg')"/></div>
          <span class='value'>
            <StarRating :value='starDetail.value' :data='starDetail'/>
          </span>
        </li>
        <li class='place info'>
          <div class='icon'><SvgIcon :size='20' :color='css.mainStyle' :src="require('@icons/comment.svg')"/></div>
          <span class='value'>
            <span class='count'>5</span>
            <span class='type'>{{5 | pluralize('commentaire')}}</span>
          </span>
        </li>
      </ul>
      <div class='boutonInvite' v-if='invite'>
        <div class='button-ask' @click.stop='proposeHelp'>Demander de l'aide</div>
      </div>
    </div>
  </li>

</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop} from 'vue-property-decorator';
import {IMover} from '@types';
import { StarRating, SvgIcon, UISwitch, BackgroundLoader } from '@components';
import * as Chance from 'chance';
import axios from 'axios';
import {MovingStore, LoginStore} from '@store';
import Router, {routesNames} from '@router';
import {DateMoving, Forms, AlertsElement, ActionsElements} from '@classes';

@Component({
  components: {
    StarRating, SvgIcon, UISwitch, BackgroundLoader
  }
})
export default class MoverCard extends Vue {

  @Prop({required: true}) mover: IMover;
  @Prop() invite: boolean;


  public css = require('@css');
  public profilePic = null;

  get userName() {return this.mover.username};
  get userPrice() {return this.mover.pricePerHour || 15};
  get movingEvent() {return MovingStore.state.oneAnnouncement}


  public starDetail = new Forms.StarRating({
    editable: false,
    value: 4.5,
    size: 22
  })

  redirectToDetail() {
    // A changer vers id
    // Router.push({name: routesNames.moverInfos, params: {moverId: this.mover.id.toString()}});
  }

  async proposeHelp() {
    try {
      const response = await new AlertsElement.Alert({
        title: `Proposer son aide à ${this.userName}`,
        type: 'confirm',
        message: `En confirmant, ${this.userName} recevra une demande d'aide de votre part`,
        strict: true,
        actions: [
          new ActionsElements.ConfirmAction({
            text: 'Confirmer',
          }),
          new ActionsElements.CancelAction()
        ]
      }).waitResponse();

      if (response) {
        new AlertsElement.SuccessAlert({
          title: `Proposition envoyée`,
          message: `Votre demande a bien été envoyée à ${this.userName}`,
        })
      }
    } catch(e) {
      new AlertsElement.ErrorAlert({
        title: `La proposition a échoué`,
        message: `Une erreur s'est produite lors de l'envoi de la proposition`,
      })
    }
  }

  async fetchImage() {
    let {data} = await axios.get(`https://randomuser.me/api/?inc=picture`);
    this.profilePic = data.results[0].picture.large;
  }

  async mounted () {
    await this.fetchImage();
  }
}
</script>


<style lang="scss" scoped>

$radius: 8px;

.Mover-card {
  display: flex;
  position: relative;
  flex-flow: column nowrap;
  flex: 0 0 auto;
  width: 250px;
  border-radius: 5px;
  box-shadow: 0 0 25px rgba(30,30,30,0.16);
  background-color: white;
  overflow: hidden;
  margin: 10px;
  font-size: 16px;
  font-weight: normal;
  color: $g90;
  font-family: 'Open Sans', sans-serif;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }

  &:active {
    transform: scale(0.95);
  }

  .header {
    display: flex;
    position: relative;
    flex-flow: row nowrap;
    flex: 0 0 auto;
    height: auto;
    border-radius: 5px 5px 0 0;

    .userPicture {
      flex: 1 1 auto;
      height: 160px;
    }

    .userName {
      display: flex;
      flex-flow: row wrap;
      position: absolute;
      bottom: 0px;
      left: 0;
      background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.4));
      color: white;
      height: 60px;
      width: 100%;
      align-items: center;
      padding: 30px 10px 10px 15px;

      .value {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        font-weight: bold;
        text-transform: capitalize;
        font-size: 19px;
        
        span{
          margin-right: 5px;
        }
      }
    }

    .userDisponibility {
      display: flex;
      position: absolute;
      flex-flow: row nowrap;
      width: auto;
      top: 15px;
      left: 15px;
      padding: 4px 15px 4px 15px;
      background-color: white;
      border-radius: 40px;
      font-size: 13px;
      box-shadow: 0 0 15px rgba(0,0,0,0.1);
      align-items: center;

      .iconState {
        flex: 0 0 auto;
        height: 10px;
        width: 10px;
        background-color: $green1;
        border-radius: 100%;
        margin-right: 10px;
      }
    }
  }

  .content {
    display: flex;
    flex-flow: column wrap;
    padding-bottom: 10px;

    .userPrice {
      display: flex;
      height: 45px;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 20px;
      // border-bottom: 1px solid $w230;
      box-shadow: 0 0 5px rgba(0,0,0,0.15);

      .value {
        span {
          color: $w120;
          font-size: 16px;
        }
      }
    }

    .userInfos {
      display: flex;
      flex-flow: column wrap;
      margin-top: 10px;

      li.info {
        display: flex;
        height: 40px;
        padding: 5px 20px 5px 20px;
        align-items: center;

        .icon {
          display: flex;
          padding: 3px;
          border: 1px solid $w230;
          border-radius: 4px;
        }

        .value {
          margin-left: 10px;

          .zip {
            color: $w120;
            font-size: 13px;
          }

          .count {
            font-weight: bold;
            font-size: 15px;
          }

          .type {
            font-size: 14px;
          }
        }
      }
    }

    .boutonInvite {
      padding: 10px 10px 0 10px;
      .button-ask {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        width: 100%;
        border-radius: 3px;
        font-size: 16px;
        font-weight: bold;
        background-color: $mainStyle;
        color: white;
        @include userselect;
        cursor: pointer;

        &:hover {
          background-color: darken($mainStyle, 5%);
        }

        &:active {
          background-color: darken($mainStyle, 10%);
        }
      }
    }
  }

}

</style>


