<template>
  <div class='User' v-if="user">
    <!-- <div class='user-cover'><BackgroundLoader :src='coverPicture' /></div> -->
    <UITabs :tabs='tabs'/>
    <div class='sections'>
      <section class='user-card'>
        <div class="header">
          <div class='userPicture' >
            <BackgroundLoader :src='profilePic' />
          </div>
          <div class='userName'>
            <span class='value'>
              <span>{{userName}}</span> 
              <SvgIcon :src='require("@icons/movers/verified.svg")' :size='18' color='white'/>
            </span>
            <span class='place'>
              <span class='city'>{{user.city || 'Paris'}}</span>
              <span class='zip'>{{user.zipcode || '75001'}}</span>
            </span>
          </div>
        </div>
        <div class='content'>
          <ul class='first-infos'>
            <li>
              <strong>{{userPrice}}€</strong>
              <span>par heure</span>
            </li>
            <li>
              <strong>5</strong>
              <span>{{5 | pluralize('déménagement')}}</span>
            </li>
          </ul>
          <ul class='other-infos'>
            <li class='disponibility'>
              <span class='dot'></span>
              <span class='text'>Disponible</span>
          </li>
            <li class='note'>
              <StarRating :value='starDetail.value' :data='starDetail' />
            </li>
          </ul>

          <div class='boutonInvite' v-if='!isMyProfile'>
            <div class='button-ask' @click.stop='proposeHelp'>Demander de l'aide</div>
          </div>
        </div>
      </section>
      <section class='user-views'>
        <transition name='fade' mode='out-in'>
          <router-view />
        </transition>
      </section>
      <section class=''></section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import {UserStore, LoginStore} from '@store';
import axios from 'axios';
import {UITabs, BackgroundLoader, SvgIcon, StarRating} from '@components';
import { routesNames } from '@router';
import {ITab} from '@types';
import {Forms, AlertsElement, ActionsElements} from '@classes';

@Component({
  components: {UITabs, BackgroundLoader, SvgIcon, StarRating}
})

export default class User extends Vue {

  public profilePic = null;

  get user() {return UserStore.state.oneUser}
  get UserId() {return this.user.id}
  get userName() {return this.user.username};
  get userPrice() {return this.user.pricePerHour || 15};
  get userCity() {return this.user.city || 'Paris'}

  get tabs(): ITab[]  {
    return [
      {title: 'Profil',icon: require('@icons/movers/user.svg'), to: {name: routesNames.user, params: {userId: this.UserId}}},
      {title: 'Editer mon profil',icon: require('@icons/movers/user.svg'), condition: this.isMyProfile, to: {name: routesNames.userEdit, params: {userId: this.UserId}}},
      {title: 'Participations',icon: require('@icons/movers/grid.svg'),childs: true, to: {name: routesNames.userParticipations, params: {userId: this.UserId}}},
      {title: 'Déménagements',icon: require('@icons/truck.svg'), to: {name: routesNames.userMovings, params: {userId: this.UserId}}},
    ]
  }

  get isMyProfile() {
    if (!LoginStore.state.isLoggedIn) {
      return false;
    } else if (LoginStore.state.userInfos.id == this.UserId) {
      return true;
    } else {
      return false;
    }
  }

  public starDetail = new Forms.StarRating({
    editable: false,
    value: 4,
    size: 24,
    displayNote: true
  })

  beforeDestroy() {
    console.log('destroyed')
    UserStore.mutations.updateOneUser(null);
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


.User {
  display: flex;
  flex-flow: column wrap;
  min-height: 100%;
  width: 100%;
  
  .sections {
    display: flex;
    flex-flow: row wrap;
    padding: 20px;
    justify-content: center;
    align-items: flex-start;
    
    .user-card {
      display: flex;
      position: sticky;
      flex-flow: column nowrap;
      flex: 0 0 auto;
      width: 300px;
      top:calc(#{$headerHeight} + 70px);
      background-color: white;
      font-size: 16px;
      font-weight: normal;
      color: $g90;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);

      .header {
        display: flex;
        position: relative;
        flex-flow: row nowrap;
        flex: 0 0 auto;
        height: auto;
        border-radius: 5px 5px 0 0;

        .userPicture {
          flex: 1 1 auto;
          height: 200px;
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
            .city {
              color: $w245;
            }

            .zip {
              font-size: 14px;
              color: $w230;
            }
          }
        }
      }


      .content {
        display: flex;
        flex-flow: column wrap;
        padding-bottom: 10px;

        ul.first-infos {
          display: flex;
          flex-flow: row nowrap;
          border-bottom: 1px solid $w230;

          li {
            display: flex;
            flex-flow: column wrap;
            flex: 0 0 50%;
            justify-content: center;
            align-items: center;
            padding: 10px;

            &:last-child {
              border-left: 1px solid $w230;
            }

            strong {
              font-size: 20px;
            } 
            span {
              font-size: 14px;
              color: $w130;
            }
          }
        }

        ul.other-infos {
          display: flex;
          flex-flow: column wrap;

          li {
            display: flex;
            padding: 10px;
            justify-content: center;
            align-items: center;

            &.disponibility{
              font-weight: bold;
              .dot {
                height: 10px;
                width: 10px;
                background-color: $green1;
                border-radius: 100%;
                margin-right: 10px;
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
  }

  .user-views {
    display: flex;
    width: 600px;

    margin-left: 30px;
  }

}

</style>


