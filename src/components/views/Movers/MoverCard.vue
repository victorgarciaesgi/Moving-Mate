<template>
  <router-link tag='li' class='Mover-card' :to='redirectToDetail'>
    <div class="header">
      <div class='userPicture'>
        <BackgroundLoader :src='profilePic' />
      </div>
      <div class='userName'>
        <span class='value'>
          <span>{{userName}}</span> 
          <SvgIcon :src='require("@icons/movers/verified.svg")' :size='18' color='white'/>
        </span>
        <span class='place'>
          <span class='city'>{{mover.city || 'Paris'}}</span>
          <span class='zip'>{{mover.zipcode || '75001'}}</span>
        </span>
      </div>
      <div class='userDisponibility' v-if='!display'>
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
          <div class='icon'><SvgIcon :size='21' :color='css.mainStyle' :src="require('@icons/movers/happy.svg')"/></div>
          <span class='value'>
            <StarRating :value='starDetail.value' :data='starDetail'/>
          </span>
        </li>
        <li class='place info' v-if='!minimal'>
          <div class='icon'><SvgIcon :size='21' :color='css.mainStyle' :src="require('@icons/truck.svg')"/></div>
          <span class='value'>
            <span class='count'>2</span>
            <span class='type'>{{5 | pluralize('déménagement')}}</span>
          </span>
        </li>
        <li class='place info' v-if='!minimal'>
          <div class='icon'><SvgIcon :size='21' :color='css.mainStyle' :src="require('@icons/comment.svg')"/></div>
          <span class='value'>
            <span class='count'>5</span>
            <span class='type'>{{5 | pluralize('commentaire')}}</span>
          </span>
        </li>
      </ul>
      <div class='mover-actions' v-if='invite || note || canDelete || isMe'>
        <div class='button-ask button' @click.stop='askHelp' v-if='invite'>Demander de l'aide</div>
        <div class='button-note button' @click.stop='noteMover' v-if='note && !isMe'>Noter</div>
        <div class='button-delete button' @click.stop='deleteMover' v-if='canDelete'>Supprimer</div>
        <div class='button-leave button' @click.stop='leaveMoving' v-if='isMe'>Se retirer</div>
      </div>
    </div>
  </router-link>

</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop} from 'vue-property-decorator';
import {IMover} from '@types';
import {required} from 'vuelidate/lib/validators';
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
  @Prop() display: boolean;
  @Prop() minimal: boolean;
  @Prop() note:boolean;
  @Prop() canDelete: boolean;
  @Prop() isMe: boolean;


  public css = require('@css');
  public profilePic = null;

  get userName() {return this.mover.username};
  get userPrice() {return this.mover.pricePerHour || 15};
  get movingEvent() {return MovingStore.state.oneAnnouncement}

  public starDetail = new Forms.StarRating({
    editable: false,
    value: 4.5,
    size: 22,
    displayNote: true,
    center: false
  })

  get redirectToDetail() {
    return {name: routesNames.user, params: {userId: this.mover.id.toString()}};
  }

  async askHelp() {
    try {
      const response = await new AlertsElement.FormAlert({
        title: `Demander de l'aide à ${this.userName}`,
        message: `En confirmant, ${this.userName} recevra une demande d'aide de votre part`,
        formElement: {
          form: new Forms.Form({
            message: new Forms.FieldForm({
              placeholder: `Message pour ${this.userName} (optionnel)`
            })
          }),
          submit: {
            params: {
              moverId: this.mover.id,
              movingId: this.movingEvent.uuid
            },
            trigger:  MovingStore.actions.createAskHelp
          }
        }
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

  async noteMover() {
    try {
      const response = await new AlertsElement.FormAlert({
        title: `Noter ${this.userName}`,
        formElement: {
          form: new Forms.Form({
            note: new Forms.StarRating({
              displayNote: true,
              size: 28
            }),
            commentaire: new Forms.FieldForm({
              placeholder: `Commentaire sur ${this.userName} (optionnel)`
            })
          }),
          validations: {
            note: {required}
          },
          submit: {
            params: {
              id: this.mover.id
            },
            trigger:  MovingStore.actions.createAskHelp // A changer
          }
        }
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

  mounted() {
    this.profilePic = this.mover.avatar || require('@images/user.jpg');
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
      flex: 1 0 auto;
      height: 160px;
      overflow: hidden;
    }

    .userName {
      display: flex;
      flex-flow: column wrap;
      align-items: flex-start;
      justify-content: center;
      position: absolute;
      bottom: 0px;
      left: 0;
      background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.4));
      color: white;
      height: 60px;
      width: 100%;
      padding: 0 0 0 15px;

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

      .place {
        @include ellipsis;
        width: 100%;
        .city {
          color: $w245;
        }

        .zip {
          font-size: 14px;
          color: $w230;
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
        flex-wrap: nowrap;
        height: 40px;
        padding: 5px 20px 5px 20px;
        align-items: center;

        .icon {
          display: flex;
          padding: 3px;
          flex: 0 0 auto;
          // border: 1px solid $w230;
          border-radius: 4px;
        }

        .value {
          margin-left: 10px;
          flex: 1 1 auto;

          .zip {
            color: $w120;
            font-size: 13px;
          }

          .count {
            font-weight: bold;
            font-size: 15px;
            color: $g90;
          }

          .type {
            font-size: 15px;
          }
        }
      }
    }

    .mover-actions {
      display: flex;
      flex-flow: column wrap;
      padding: 5px 10px 0 10px;

      .button {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        width: 100%;
        border-radius: 3px;
        margin-top: 5px;
        font-size: 16px;
        font-weight: bold;
        @include userselect;
        cursor: pointer;

        &.button-ask {
          background-color: $mainStyle;
          color: white;
          &:hover {background-color: darken($mainStyle, 5%);}
          &:active { background-color: darken($mainStyle, 10%);}
        }

        &.button-delete, &.button-leave {
          background-color: white;
          color: $red1;
          &:hover {background-color: darken(white, 5%);}
          &:active { background-color: darken(white, 10%);}
        }

        &.button-note {
          background-color: white;
          color:$mainStyle;
          &:hover {background-color: darken(white, 5%);}
          &:active { background-color: darken(white, 10%);}
        }
      }
    }
  }

}

</style>


