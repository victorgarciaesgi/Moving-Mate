<template>
  <div class='User' v-if="user">
    <div class='user-cover' >
      <BackgroundLoader v-if='coverPicture' :src='coverPicture' :blur='true' :user='true'/>
      <section class='user-card'>
        <div class="header">
          <div class='userPicture' >
            <BackgroundLoader :src='profilePic' />
          </div>
          <div class='userName' :class='{premium: user.isPremium}'>
            <span class='premium' v-if='user.isPremium'>
              Premium 
              <SvgIcon class='icon' :src='require("@icons/movers/verified.svg")' :size='16' color='white'/>
            </span>
            <span class='value'>
              <span>{{fullName || userName}}</span> 
            </span>
            <span class='place'>
              <span class='city'>{{user.city || 'Paris'}}</span>
              <span class='zip'>{{user.zipcode || '75001'}}</span>
            </span>
          </div>
        </div>
        <div class='content' v-if='user.isMover'>
          <ul class='first-infos' >
            <li>
              <strong>{{userPrice}}€</strong>
              <span>par heure</span>
            </li>
            <li>
              <strong>{{getMovingCount}}</strong>
              <span>{{getMovingCount | pluralize('déménagement')}}</span>
            </li>
          </ul>
          <ul class='other-infos'>
            <li class='disponibility' :class='{activated: user.isAvailable}'>
              <span class='dot'></span>
              <span class='text'>{{user.isAvailable?'Disponible':'Indisponible'}}</span>
              <UISwitch :value='user.isAvailable' v-if='isMyProfile' @switch='toggleDispo' :loading='availableLoading'/>
            </li>
            <li class='note' >
              <StarRating v-if='user.rating' :value='starDetail.value' :data='starDetail' />
              <div v-else>Pas encore de note</div>
            </li>
          </ul>

          <div class='boutonInvite' v-if='isMyProfile && !user.isPremium && user.isMover'>
            <div class='button-prenium' @click.stop='showPrenium = true'>Devenir Prenium</div>
          </div>
        </div>
        
      </section>
    </div>
    <UITabs class='desktop-tabs' :tabs='tabs'/>
    <div class='sections'>
      
      <UITabs class='mobile-tabs' :tabs='tabs'/>
      <section class='user-views'>
        <transition name='fade' mode='out-in'>
          <router-view />
        </transition>
      </section>
    </div>
    <UIModal :show='showPrenium' @close='showPrenium = false' :width='500'>
      <!-- <span slot='header'>Devenir Prenium</span> -->
      <div slot='content' style='padding: 20px 20px 0px 20px'>
        <div class='bePremium'>
          <div class='infos'>
            <strong>Avantages Prenium</strong>
            En activant votre compte en tant que Prenium, vous apparaîterez dans les premiers résultats de recherche.
            Vous aurez donc beaucoup plus de chance d'être recruté par quelqu'un
          </div>
          <div class='price-options'>
            <div class='options' v-for='option of priceOptions' :key='option.id'>
              <label :for='`option${option.id}`' :class='{selected: priceOptionSelected == option.price}'>
                <span class='price'>{{option.price}}€</span>
                <span class='text'>{{option.text}}</span>
              </label>
              <input :id='`option${option.id}`' :value='option.price' v-model='priceOptionSelected' type='radio' style='display: none'>
            </div>
          </div>

          <PaypalButton v-if='isMyProfile' :price='priceOptionSelected' @payed='preniumPayed' @canceled='preniumCanceled' ref='paypal' style='dispay: none'/>

        </div>
        
      </div>
      <template slot='footer'>
        <FormButton @click='showPrenium = false'>Fermer</FormButton>
      </template>
    </UIModal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import {UserStore, LoginStore, NotificationsStore, geoLocate, EventBus} from '@store';
import axios from 'axios';
import Api from '@api';
import { required, email, numeric, maxLength } from 'vuelidate/lib/validators';
import {UITabs, BackgroundLoader, SvgIcon, StarRating, UISwitch, PaypalButton, UIModal, FormMessage, FormButton} from '@components';
import { routesNames } from '@router';
import {ITab} from '@types';
import {timeout} from '@methods'
import {Forms, AlertsElement, ActionsElements} from '@classes';

@Component({
  components: {UITabs, BackgroundLoader, SvgIcon, StarRating, UISwitch, PaypalButton, UIModal, FormMessage, FormButton}
})

export default class User extends Vue {

  
  public availableLoading = false;
  public showPrenium = false;
  public submittingPrenium = false;
  public css = require('@css');

  public priceOptions = [
    {id: 0, price: 5, text: '1 mois'},
    {id: 1, price: 12, text: '3 mois'},
    {id: 2, price: 20, text: '6 mois'},
  ]
  public priceOptionSelected = 5;


  get user() {return UserStore.state.oneUser}
  get UserId() {return this.user.id}
  get userName() {return this.user.username};
  get fullName() {
    if (this.user.firstname) return this.user.firstname + ' ' + this.user.lastname;
    return null;
  }
  get userPrice() {return this.user.pricePerHour || 15};
  get userCity() {return this.user.city || 'Paris'}
  get getMovingCount() {return Number(this.user.countAnnouncements?this.user.countAnnouncements:0) + Number(this.user.countParticipations?this.user.countParticipations:0)}

  get profilePic() {
    return this.user.avatar || require('@images/user.jpg');
  }
  get coverPicture() {
    return this.user.avatar;
  }


  get tabs(): ITab[]  {
    return [
      {title: 'Profil',icon: require('@icons/movers/user.svg'), to: {name: routesNames.user, params: {userId: this.UserId}}},
      {title: 'Editer mon profil',icon: require('@icons/edit.svg'), condition: this.isMyProfile, to: {name: routesNames.userEdit, params: {userId: this.UserId}}},
      {title: 'Participations',icon: require('@icons/movers/grid.svg'),badge: this.user.countParticipations,childs: true, to: {name: routesNames.userParticipations, params: {userId: this.UserId}}},
      {title: 'Déménagements',icon: require('@icons/truck.svg'),badge: this.user.countAnnouncements, to: {name: routesNames.userMovings, params: {userId: this.UserId}}},
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

  get starDetail() {
    return new Forms.StarRating({
      editable: false,
      value: this.user.rating,
      size: 24,
      displayNote: true
    })
  }

  triggerPrenium() {
    this.submittingPrenium = true;
    EventBus.$emit('paypal-create');
  }

  async preniumPayed() {
    NotificationsStore.actions.addNotification({
      type: 'success',
      message: 'Votre compte est maintenant Prenium!'
    })
    await UserStore.actions.getOneUser({userId: this.user.id, force: true});
    this.showPrenium = false;
  }

  preniumCanceled() {
    this.submittingPrenium = false;
  }

  async toggleDispo() {
    this.availableLoading = true;
    try {
      const {data} = await Api.put('/profile/available');
      this.user.isAvailable = data.isAvailable;
      NotificationsStore.actions.addNotification({
        type: 'success',
        message: `Vous avez maintenant le statut ${data.isAvailable?"Disponible": "Indisponible"}`
      })
    } finally {
      this.availableLoading = false;
      
    }
  }

  beforeDestroy() {
    UserStore.mutations.updateOneUser(null);
  }

  async proposeHelp() {
    try {
      const response = await new AlertsElement.FormAlert({
        title: `Demande de l'aide à ${this.userName}`,
        message: `En confirmant, ${this.userName} recevra une demande d'aide de votre part`,
        strict: true,
        formElement: {
          form: new Forms.Form({
            message: new Forms.FieldForm({
              placeholder: `Message pour ${this.userName} (optionnel)`
            })
          }),
          validations: {
            message: {maxLength: maxLength(300)}
          },
          submit: {
            params: {
              id: this.UserId
            },
            trigger:  () => timeout(1000)
          }
        }
      }).waitResponse();

      if (response) {
        new AlertsElement.SuccessAlert({
          title: `Demande envoyée`,
          message: `Votre demande a bien été envoyée à ${this.userName}`,
        })
      }
    } catch(e) {
      new AlertsElement.ErrorAlert({
        title: `La demande a échoué`,
        message: `Une erreur s'est produite lors de l'envoi de la demande`,
      })
    }
  }

  async mounted () {
    
  }
}
</script>


<style lang="scss" scoped>


.User {
  display: flex;
  flex-flow: column wrap;
  position: relative;
  min-height: 100%;
  width: 100%;
  background-color: white;

  .user-cover {
    position: relative;
    height: auto;
    display: flex;
    min-height: 500px;
    align-items: center;
    justify-content: center;
    background-color: $mainStyle;

    .user-card {
      display: flex;
      position: relative;
      // position: sticky;
      flex-flow: column nowrap;
      flex: 0 0 auto;
      margin: 30px;
      width: 300px;
      // top: calc(#{$headerHeight} + 70px);
      background-color: white;
      font-size: 16px;
      font-weight: normal;
      border-radius: 3px;
      overflow: hidden;
      z-index: 1000;
      color: $g90;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);

      .header {
        display: flex;
        position: relative;
        flex-flow: row nowrap;
        flex: 0 0 auto;
        height: auto;
        height: 250px;
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
          z-index: 1001;
          background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.7));
          color: white;
          height: 90px;
          width: 100%;
          padding: 0 0 0 15px;

          &.premium {
            padding-top: 0px;
          }

          .premium {
            display: flex;
            background-color: $brown1;
            color: white;
            font-size: 12px;
            font-weight: bold;
            padding: 2px 10px 2px 10px;
            border-radius: 30px;
            margin-left: -5px;

            .icon {
              margin-left: 5px;
            }
          }

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
        background-color: white;

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
                background-color: $red1;
                border-radius: 100%;
                margin-right: 10px;
              }

              &.activated .dot{
                background-color: $green1;
              }
            }
          }
        }

        .boutonInvite {
          padding: 10px 10px 0 10px;

          .button-prenium {
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
  
  .sections {
    display: flex;
    flex-flow: row nowrap;
    padding: 0 20px 20px 20px;
    width: 100%;
    justify-content: center;
    align-items: flex-start;
    min-width: 0;
    
    

    .user-views {
      display: flex;
      position: relative;
      flex-flow: row nowrap;
      margin-left: 30px;
      flex: 0 1 auto;
      min-width: 0;
      width: 100%;
      justify-content: center;
      align-items: flex-start;
      align-content: flex-start;

      & > * {
        max-width: 800px;
        width: 100%;
        flex: 0 1 auto;
        margin-top: 20px;
      }
    }

    .mobile-tabs {
      display: none;
      width: 100vw;
    }
  }

  

  @media screen and (max-width: 1000px) {
    .desktop-tabs {
      display: none;
    }

    

    .sections {
      flex-flow: column wrap;
      align-items: center;
      justify-content: flex-start;

      .mobile-tabs {
        display: flex;
      }

      .user-card {
        position: relative;
        top: 0;
        margin-bottom: 20px;
      }

      .user-views {
        margin-left: 0;
        margin-top: 20px;
      }
    }
  }

}

.bePremium {


  .infos {
    display: flex;
    flex-flow: column wrap;
    padding: 10px;
    font-size: 15px;
    text-align: center;

    strong {
      text-align: center;
      font-size: 17px;
    }
  }

  .price-options {
    display: flex;
    flex-flow: row nowrap;
    margin-top: 10px;
    margin-bottom: 10px;

    .options {
      flex: 1 1 auto;
      display: flex;
      height: 60px;
      margin: 0px 10px 0 10px;  

      label {
        border: 2px solid $w230;
        border-radius: 5px;
        display: flex;
        flex-flow: column nowrap;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &.selected {
          border: 2px solid $mainStyle;

          .price{color: $mainStyle}
        }

        .price {font-weight: bold;}


      }
    }
  }
}

</style>


