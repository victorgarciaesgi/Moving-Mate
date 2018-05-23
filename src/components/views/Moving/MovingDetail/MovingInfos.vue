<template>
  <div class='sections'>
    <section class='moving-infos'>
      <div class='header'>
        <h1 class='title'>{{movingEvent.label}}</h1>
        <div class='state'>
          <span>Annonce normale</span>
        </div>
        <div class='description'>
          {{getDescription}}
        </div>
      </div>
      <div class='content'>
        <div class='block'>
          <div class='section-title'>Date et heure du déménagement</div>
          <div class='section-content'>
            <div class='date'>
              <span class='number'>{{getBegin.number}}</span>
              <span class='month'>{{getBegin.month}} {{getBegin.year}}</span>
              <span class='hour'>{{getBegin.hour}}</span>
            </div>
            <div class='message' v-if='!isMovingMine'>
              <FormMessage noshadow>
                <template slot='title'>Vous devez respecter les horaires fournies par l'émetteur de l'annonce</template>
                Si vous n'êtes pas présent à l'heure prévue, l'émetteur peut se voir en droit de refuser votre aide et de vous mettre une mauvaise note
              </FormMessage>
            </div>
          </div>
        </div>
        <div class='block'>
          <div class='section-title'>Information sur le départ</div>
          <div class='section-content'>
            <div class='info-cards'>
              <div class='info-card' v-for='card in departCards' :key='card.title'>
                <div class='title'>
                  <SvgIcon class='icon' :src='card.image' :color='css.mainStyle' :size='card.size || 24'/>
                  <span>{{card.title}}</span>
                </div>
                <div class='value'>{{card.value}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class='block'>
          <div class='section-title'>Information sur l'arrivée</div>
          <div class='section-content'>
            <div class='info-cards'>
              <div class='info-card' v-for='card in arriveeCards' :key='card.title'>
                <div class='title'>
                  <SvgIcon class='icon' :src='card.image' :color='css.mainStyle' :size='card.size || 24'/>
                  <span>{{card.title}}</span>
                </div>
                <div class='value'>{{card.value}}</div>
              </div>
            </div>
          </div>
        </div>
         <FormMessage v-if='!isMovingMine' noshadow>
          <template slot='title'>L'addresse exacte n'est pas affichée</template>
          Pour des raisons de confidentialité, nous n'affichons pas l'addresse exacte de l'utilisateur. Seuls les déménageurs acceptés par celui-ci pourront la voir
        </FormMessage>
      </div>
    </section>
    <section class='moving-actions'>
      <div class='header'>
        <div class='user'>
          <div class='picture' :style='profilePic'></div>
        </div>
        <div class='infos'>
          <span class='name'>{{userName}}</span>
        </div>
      </div>
      <div class='content'>
        <div class='moving-places'>
          <div class='depart element'>
            <div class='icon black'></div>
            <div class='value'>
              <span class='city'>{{getDepart.city}}</span>
              <span class='zip'>   {{getDepart.zip}}</span>
          </div>
          </div>
          <div class='arrivee element'>
            <div class='icon blue'></div>
            <div class='value'>
              <span class='city'>{{getDepart.city}}</span>
              <span class='zip'>   {{getDepart.zip}}</span>
          </div>
          </div>
          <div class='liaison'></div>
        </div>
        <div class='base-info info-wrap'>
          <div class='info'>
            <div class='info-content'>
              <strong>{{getPrice}}€</strong>
              <span>par pers.</span>
            </div>
          </div>
          <div class='info'>
            <div class='info-content'>
              <strong>{{getMenNumber}}</strong>
              <span>{{getMenNumber | pluralize('déménageur')}}</span>
            </div>
          </div>
          <div class='info'>
            <div class='info-content'>
              <strong><SvgIcon :src='require("@icons/moving/timer.svg")' :size='26'  :color='css.mainStyle'/></strong>
              <span>4 heures</span>
            </div>
          </div>
          <div class='info'>
            <div class='info-content'>
              <strong>
                <SvgIcon :src='require("@icons/moving/arrow_both.svg")' :size='26' :color='css.mainStyle'/>
              </strong>
              <span>Départ/arrivée</span>
            </div>
          </div>
        </div>
      </div>
      <div class='footer'>
        <div class='participants'>
          <span class='title'>Participants validés</span>
          <ul class='result' v-if='movingEvent.participations'>
            <li v-for='part of movingEvent.participations.users' 
              :key='part.id'
              :style='{backgroundImage: `url(${part.picture})`}'>
            </li>
          </ul>
          <span class='result' v-else>Aucun participants</span>
        </div>
        <div class='button-ask' v-if='!isMovingMine' @click='proposeHelp()'>Proposer mon aide</div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop} from 'vue-property-decorator';
import {IMovingEvent, MovingStatus} from '@types';
import { StarRating, SvgIcon, UISwitch, FormMessage } from '@components';
import * as Chance from 'chance';
import axios from 'axios';
import moment from 'moment';
import {MovingStore, LoginStore} from '@store';
import {DateMoving, AlertsElement, ActionsElements} from '@classes';
import { timeout } from '@methods';
import { throws } from 'assert';

@Component({
  components: {
    FormMessage, SvgIcon
  },
})
export default class MovingDetail extends Vue {
  
  public formatedDate = null;
  public dateFrom = null;
  public backgroundCover = null;
  public profilePic = {backgroundImage: `url("${require('@images/user.jpg')}")`};
  public css = require('@css');

  get movingEvent() {return MovingStore.state.oneAnnouncement}

  get getDescription() { return this.chance.paragraph(); }
  get chance() { return new Chance(); }
  get userName() { return this.movingEvent.user.username; }
  get getDepart() { return this.movingEvent.addressIn; }
  get getArrivee() { return this.movingEvent.addressOut;}
  get getMenNumber() {return this.movingEvent.menRequired};
  get getPrice() {return this.movingEvent.pricePerHourPerUser};
  get getBegin() {
    const date = new DateMoving(this.movingEvent.dealDate);
    return date;
  }

  get isMovingMine() {return this.movingEvent.user.id == LoginStore.state.userInfos.id}

  get departCards() {
    return [
      {title: 'Ville', value: this.getDepart.city, image: require('@icons/localisation.svg')},
      {title: 'Volume', value: `${this.movingEvent.volume}cm³`, image: require('@icons/moving/volume.svg')},
      {title: 'Type', value: 'Appartement', image: require('@icons/region.svg')},
      {title: 'Ascenseur', value: 'Non', image: require('@icons/moving/elevator.svg'), size: 20},
      {title: 'Parking', value: 'Non', image: require('@icons/moving/parking.svg')},
    ]
  }

  get arriveeCards() {
    return [
      {title: 'Ville', value: this.getArrivee.city, image: require('@icons/localisation.svg')},
      {title: 'Volume', value: `${this.movingEvent.volume}cm³`, image: require('@icons/moving/volume.svg')},
      {title: 'Type', value: 'Appartement', image: require('@icons/region.svg')},
      {title: 'Ascenseur', value: 'Non', image: require('@icons/moving/elevator.svg'), size: 20},
      {title: 'Parking', value: 'Oui', image: require('@icons/moving/parking.svg')},
    ]
  }
  
  async proposeHelp() {
    try {
      const response = await new AlertsElement.Alert({
        title: `Proposer son aide à ${this.userName}`,
        type: 'confirm',
        message: `En confirmant, ${this.userName} recevra une proposition d'aide de votre part et se verra en droit de l'accepter ou de la décliner`,
        strict: true,
        actions: [
          new ActionsElements.ConfirmAction({
            text: 'Confirmer',
            triggers: [
              () => MovingStore.actions.createParticipation({
                announcement: this.movingEvent.id,
                user: LoginStore.state.userInfos.id,
                toHire: this.movingEvent.user.id
              }),
              () => MovingStore.actions.getAnnouncementDetails(this.movingEvent.id.toString())
            ]
          }),
          new ActionsElements.CancelAction()
        ]
      }).waitResponse();

      if (response) {
        new AlertsElement.SuccessAlert({
          title: `Proposition envoyée`,
          message: `Votre proposition a bien été envoyée à ${this.userName}`,
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
    // let {data} = await axios.get(`https://randomuser.me/api/?inc=picture&seed=${this.moving.username}`);
    if (this.movingEvent.participations) {
      this.movingEvent.participations.users.map(async (m) => {
        let {data} = await axios.get(`https://randomuser.me/api/?inc=picture`);
        m['picture'] = data.results[0].picture.thumbnail;
        return m;
      })
    }
    let {data} = await axios.get(`https://randomuser.me/api/?inc=picture`);
    this.profilePic = {backgroundImage: `url("${data.results[0].picture.medium}")`};
    this.formatedDate = moment.unix(this.movingEvent.dealDate).format('dddd Do MMMM YYYY, hh:mm');
  }

  mounted () {
    this.fetchImage();
  }
}
</script>



<style lang='scss' scoped>

.sections {
  display: flex;
  position: relative;
  flex-flow: row wrap;
  padding: 20px;
  padding-top: 30px;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;

  section.moving-infos {
    display: flex;
    width: 650px;
    height: auto;
    flex-flow: column wrap;
    padding: 10px;
    padding-top: 0;

    .header {
      display: flex;
      flex-flow: column nowrap;
      margin-bottom: 10px;
      padding: 0 0 15px 0;


      h1.title {
        font-size: 30px;
        margin-bottom: 5px;
      }

      .state {
        span {
          border-radius: 40px;
          padding: 3px 10px 3px 10px;
          background-color: $mainStyle;
          color: white;
          font-size: 13px;
        }
      }

      .description {
        font-size: 15px;
        line-height: 25px;
        color: $w130;
        margin-top: 10px;
      }
    }

    .content {
      display: flex;
      flex-flow: column wrap;
      
      .block {
        display: flex;
        flex-flow: column wrap;
        // border-bottom: 1px solid $w220;

        &::after {
          content: '';
          height: 1px;
          width: 100%;
          margin: 15px 0 15px 0;
          background-color: $w230;
        }

        &:last-child {
          border: none;
        }

        .section-title {
          color: $g90;
          font-weight: bold;
          font-size: 18px;
        }

        .section-content {
          display: flex;
          flex-flow: column wrap;
          margin-top: 15px;
          font-size: 15px;

          .date {
            display: flex;
            flex-flow: row nowrap;
            flex: 0 0 auto;
            overflow: hidden;
            border-radius: 4px;
            padding: 5px;

            & > span {
              padding: 5px 15px 5px 15px;
            }

            .number {
              background-color: transparentize($red1, 0.2);
              color: white;
              font-weight: bold;
              font-size: 17px;
              border-radius: 3px 0 0 3px;
            }

            .month {
              color: $g90;
              border: 1px solid $w230;
              background-color: white;
              border-left: none;
              border-radius: 0 4px 4px 0;
              font-size: 17px;
            }

            .hour {
              color: $g90;
              border: 1px solid $w230;
              background-color: white;
              margin-left: 10px;
              border-radius: 4px;
              font-size: 17px;
            }
          }

          .message {
            margin-top: 10px;
          }

          .info-cards {
            display: flex;
            flex-flow: row wrap;

            .info-card {
              display: flex;
              flex-flow: column nowrap;
              flex: 0 0 auto;
              height: 80px;
              width: 180px;
              border: 1px solid $w220;
              border-radius: 4px;
              margin: 5px;
              padding: 5px;

              .title {
                display: flex;
                flex-flow: row nowrap;
                height: 30px;
                align-items: center;
                justify-content: center;
                font-size: 17px;
                color: $w110;

                .icon {margin-right: 5px}
              }

              .value {
                display: flex;
                flex-flow: row nowrap;
                height: 30px;
                flex: 1 1 auto;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                font-weight: bold;
                color: $w110;
              }
            }
          }

        }
      }

      
    }
  }

  section.moving-actions {
    display: flex;
    flex-flow: column wrap;
    position: sticky;
    top: calc(#{$headerHeight} + 80px);
    width: 350px;
    height: auto;
    margin-left: 30px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);


    .header {
      display: flex;
      flex-flow: row nowrap;

      .user {
        padding: 10px 20px 10px 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0 0 auto;

        .picture {
          height: 70px;
          width: 70px;
          border-radius: 100%;
          @include bg-center;
          border: 3px solid $mainStyle;
        }
      }

      .infos {
        display: flex;
        align-items: center;
        font-size: 20px;
        font-weight: bold;
        text-transform: capitalize;
      }
    }

    .content {
      display: flex;
      flex-flow: column wrap;

      .moving-places {
        position: relative;
        display: flex;
        flex-flow: column nowrap;
        flex: 0 0 auto;
        margin: 10px;
        border-radius: 8px;
        overflow: hidden;
        background-color: $w250;
        box-shadow: 0 0 10px rgba(10,10,10,0.05);
        border: 1px solid $w230;

        .element {
          position: relative;
          display: flex;
          flex-flow: row nowrap;
          color: $g90;
          height: 42px;
          padding: 10px 0 10px 0;
          background-color:white;
          flex: 0 0 auto;
          font-size: 16px;
          font-weight: bold;

          &.arrivee {
            border-top: 1px solid $w230;
          }

          .value {
            display: flex;
            flex-flow: row nowrap;
            flex: 1 1 auto;
            margin-left: 5px;

            span.city {
              flex: 1 1 auto;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            span.zip {
              color: $w120;
              font-weight: normal;
              font-size: 13px;
              flex: 0 0 auto;
              padding: 0 10px 0 10px;
            }
          }

          .icon {
            display: flex;
            flex: 0 0 auto;
            justify-content: center;
            align-items: center;
            width: 40px;

            &::after {
              content:'';
              height: 8px;
              width: 8px;
              border-radius: 100%;
              background-color:$w180;
            }

            &.blue:after {
              background-color: $mainStyle;
            }
          }
        }

        .liaison {
          position: absolute;
          left: 18px;
          top: 18px;
          width: 4px;
          height: 45px;
          background: linear-gradient(to bottom, $w180, $mainStyle);
          z-index: 3;
        }
      }

      .info-wrap {
        display: flex;
        width: 100%;
        flex-flow: row wrap;
        position: relative;
        justify-content: center;
        padding: 5px;

        div.info {
          display: flex;
          flex-flow: column wrap;
          flex: 1 0 50%;
          height: 60px;
          padding: 5px;
          
          .info-content {
            display: flex;
            flex: 0 0 auto;
            flex-flow: row nowrap;
            border-radius: 8px;
            border: 1px solid $w230;
            height: 100%;
            align-items: center;
            align-content: center;
            color: $w120;
            font-size: 15px;

            strong {
              display: flex;
              justify-content: center;
              margin-right: 8px;
              font-size: 20px;
              color: $mainStyle;
              flex: 0 0 auto;
              min-width: 40px;
              padding: 0 5px 0 5px;
              border-right: 1px solid $w220;
            }

            span {
              flex: 1 1 auto;
            }
          }
        }
      }

      
    }

    .footer {
      display: flex;
      flex-flow: column wrap;
      padding: 10px;

      .participants {
        display: flex;
        flex-flow: column nowrap;
        height: 100%;
        padding: 5px 10px 5px 10px;
        font-size: 15px;
        font-weight: bold;

        .result {
          color: $w150;
          font-size: 13px;
          margin-top: 5px;
          font-weight: normal;
        }

        ul {
          display: flex;
          flex-flow: row wrap;
          flex: 1 1 auto;
          padding: 5px 10px 5px 0;

          li {
            flex: 0 0 auto;
            border-radius: 40px;
            height: 40px;
            width: 40px;
            border: 3px solid white;
            margin-right: -7px;
            cursor: pointer;
            @include bg-center;
          }
        }
      }

      .button-ask {
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
        height: 50px;
        text-align: center;
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

    @media screen and (max-width: 1070px) {
      width: 100%;
      height: auto;
      bottom: 20px;
      top: auto;
      margin-left: 0;
      flex-flow: row nowrap;
      box-shadow: 0 0 20px rgba(0,0,0,0.2);
      justify-content: center;

      .header {
        flex-flow: column wrap;
        align-items: center;
        flex: 0 0 auto;
      }

      .content {
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        flex: 1 1 auto;

        .moving-places {
          display: none;
        }

        .info-wrap {
          flex: 1 1 120px;
          flex-flow: row wrap;

          .info {
            flex: 1 1 auto;
          }
        }
      }

      .footer {
        flex-flow: row nowrap;
        justify-content: center;
        flex: 1 1 auto;
        align-items: center;

        .button-ask {
          flex: 1 1 auto;
        }
      }
    }

    @media screen and (max-width: 900px) {
      .footer .participants {
        display: none;
      }
    }

    @media screen and (max-width: 580px) {
      .content {
        display: none;
      }

      .footer .participants {
        display: flex;
      }
    }
  }
}
 
</style>

