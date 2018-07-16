<template>
  <div class='header-wrapper'>
    <header :class='{shadow: headerBox}'>
      <nav class='desktop'>
        <router-link to='/' class='logo'>
          <img src="~@images/logo_banniere.svg" alt="">
        </router-link>
        <ul class='nav-list'>
          <router-link tag='li' class='route header-link' :to='item.link' v-for="item in nav" :key='item.name'>
            <span>{{item.title}}</span>
          </router-link>
        </ul>
        <ul class='login-list'>
          <router-link tag='li' to='/bemover'  class="header-button color header-link" v-if='!(loginState.isLoggedIn && userInfos.isMover)'>
            <span>Devenir déménageur</span>
          </router-link>

          <!-- If user logged in -->

          <template v-if='loginState.isLoggedIn'>
            <li class='header-button popup header-link'>
              <Popup v-if='loginState.isLoggedIn' @open='fetchMyMoving' key='moving'>
                <template slot='popup'>
                  <div class='centerContent' v-if='searchingMyMoving'><img src='~@images/loading.svg'></div>
                  <div v-else-if="myMovings" style='display: flex'>
                    <UserMovings/>
                  </div>
                  <div v-else class='centerContent' >Aucun déménagement trouvé</div>
                </template>
                <div slot='button' class='bouton-data' >
                  <span>
                    Mes déménagements
                    <!-- <div class='count'>{{userInfos.participations.length}}</div> -->
                  </span>
                </div>
              </Popup>
            </li>
            <li class='header-button popup header-link'>
              <Popup v-if='loginState.isLoggedIn' :width='450'  key='notifs' @close='readAllNotifs'>
                <template slot='popup'>
                  <UserNotifs/>
                </template>
                <div slot='button' class='bouton-data image' >
                  <SvgIcon :src="require('@icons/notifs/notification_empty.svg')" :size='24'></SvgIcon>
                  <div class='badge' v-if='nonReadNotifs > 0'>{{nonReadNotifs}}</div>
                </div>
              </Popup>
            </li>

            <li class="header-button popup header-link">
              <Popup :width='250' key='user'>
                <template slot='popup'>
                 <div class='user-options-popup'>
                    <div class="user">
                      <div class="user-picture" :style='getProfileImage'></div>
                      <div class="user-name">{{fullName || userInfos.username}}</div>
                    </div>
                    <ul class='user-option-list'>
                      <router-link tag='li' :to='userProfilePath' class='user-option'>Mon profil</router-link>
                      <router-link tag='li' :to='userEditPath' class='user-option'>Modifier mes informations</router-link>
                      <router-link v-if='userInfos.isMover' tag='li' :to='userParticipationsPath' class='user-option'>Historique des participations</router-link>
                      <router-link tag='li' to='/admin' class='user-option' v-if='isAdmin'>Administration</router-link>
                      <router-link to='/cgu' class='user-option'>Conditions d'utilisation</router-link>
                      <li class='user-option red' @click='disconnectRequest'>Deconnexion</li>
                    </ul>
                 </div>
                </template>
                <div slot='button' class='bouton-data'>
                  <span>{{fullName || userInfos.username}}</span>
                  <div class='profile-image' :style='getProfileImage'></div>
                </div>
              </Popup>
            </li>
          </template>

          <!-- Else -->

          <template v-else>
            <li class="header-button header-link" @click='showLogin'>
              <span>Connexion</span>
            </li>
            <li class="header-button header-link"  @click='showSignup'>
              <span>Inscription</span>
            </li>
          </template>
        </ul>
      </nav>
      <div class='mobile-header'>
        <div class='mobile-nav-button' @click='mobilePanel = true'>
          <SvgIcon :src='require("@icons/menu.svg")' :size='35' />
        </div>
        <router-link to='/' class='logo'>
          <img src="~@images/logo_banniere.svg" alt="">
        </router-link>
      </div>

      <transition name='coulisse'>
        <nav class='mobile-panel' v-if='mobilePanel' @click='mobilePanel = false'>
          <div class='window' @click.stop>
            <div class='user-panel' v-if='loginState.isLoggedIn'>
              <div class='user-infos'>
                <div class="picture" :style='getProfileImage'></div>
                <div class="name">{{fullName || userInfos.username}}</div>
              </div>
              <div class='user-links'>
                <router-link @click.native='mobilePanel = false' class='link' v-if='("condition" in link && !!link.condition) || !("condition" in link) ' v-for='link of userLinks' :key='link.path' :to='link.path' :class='{color: link.color}'>
                  {{link.title}}
                </router-link>
                <li class='link' @click='disconnectRequest'>Deconnexion</li>
              </div>
            </div>
            <div class='link-panel'>
              <router-link @click.native='mobilePanel = false' class='link' v-if='("condition" in link && !!link.condition) || !("condition" in link) ' v-for='link of mobileLinks' :key='link.path' :to='link.path' :class='{color: link.color}'>
                {{link.title}}
              </router-link>
            </div>
          </div>
        </nav>
      </transition>
    </header>
  
    <Connexion :show='loginState.showModal' v-if='!loginState.isLoggedIn' ></Connexion>  
    <Inscription :show='signupState.showModal' v-if='!loginState.isLoggedIn'></Inscription>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Store} from 'vuex';
import {RootState} from '@store';

import { ILoginState, ISignupState, INotif } from '@types';
import { timeout } from '@methods';
import { SvgIcon, Connexion, Inscription, Popup } from "@components";
import MovingCard from '@views/Moving/MovingCard.vue';
import { LoginStore, SignupStore, GlobalStore, MovingStore, UserStore } from '@modules'
import { StringifyOptions } from "querystring";
import {routesNames} from '@router';
import UserNotifs from './UserNotifs/UserNotifications.vue';
import UserMovings from './UserMovings.vue';


@Component({
  components: { Connexion, Inscription, Popup, SvgIcon, MovingCard, UserNotifs, UserMovings },
})
export default class HeaderComponent extends Vue {

  get loginState() {return LoginStore.state}
  get userInfos() {return LoginStore.state.userInfos};
  get fullName() {return LoginStore.getters.fullName};
  get userPicture(){return LoginStore.getters.userPicture};
  get isAdmin() {return LoginStore.getters.isAdmin};
  get headerBox() {return GlobalStore.state.headerBoxShadow};
  get userProfilePath() {return {name: routesNames.user, params: {userId: this.userInfos.id}}}
  get userEditPath() {return {name: routesNames.userEdit, params: {userId: this.userInfos.id}}}
  get userParticipationsPath() {return {name: routesNames.userParticipations, params: {userId: this.userInfos.id}}}

  private showLogin = LoginStore.mutations.showLogin;
  private disconnectRequest = LoginStore.actions.disconnectRequest;

  get signupState() {return SignupStore.state}
  private showSignup = SignupStore.mutations.showSignup;
  

  public $store: Store<RootState>;
  public mobilePanel = false;
  public popups = [];

  get mobileLinks() {
    return [
      {title: 'Connexion', condition: !this.loginState.isLoggedIn, path: '/connexion'},
      {title: 'Inscription', condition: !this.loginState.isLoggedIn, path: '/inscription'},
      {title: 'Devenir déménageur', condition: !this.loginState.isLoggedIn || (this.loginState.isLoggedIn && !this.loginState.userInfos.isMover), path: '/bemover', color: true},
      {title: 'Déménagements', path: '/moving'},
      {title: 'Déménageurs', path: '/movers'}
    ]
  }

  get userLinks() {
    return [
      {title: 'Mon profil', path: `/user/${this.loginState.userInfos.id}`},
      {title: 'Mon historique', path: `/user/${this.loginState.userInfos.id}/participations`},
    ]
  }

  get getProfileImage() {
    return {
      backgroundImage: `url(${this.userPicture})`
    }
  }

  get myMovings() {
    return (LoginStore.state.myMovings.Announcements || LoginStore.state.myMovings.Participations)
  }
  public searchingMyMoving = false;

  async fetchMyMoving() {
    try {
      this.searchingMyMoving = true;
      const moving = await LoginStore.actions.getMyAnnouncements();
    } finally {
      this.searchingMyMoving = false;
    }
  }

  get notifications() : INotif[]{
    return UserStore.state.notifications;
  }

  get nonReadNotifs() {
    return this.notifications.reduce((acc, curr, index) => {
      if (!curr.read) return acc + 1;
      return acc;
    }, 0)
  }

  readAllNotifs(test) {
    UserStore.actions.readNotifications()
  }


  togglePopup(popupName: string, target?: HTMLElement) {
    this.$refs[popupName].togglePopup(target);
  }

  public nav = [
    { title: "Les déménagements", name: "moving", link: "/moving", icon: require('@icons/truck.svg')},
    { title: "Les déménageurs", name: "movers", link: "/movers", icon: require('@icons/people.svg')}
  ];

}
</script>



<style lang='scss' scoped>

div.header-wrapper{
  position: absolute;
  height: 100%;
  width: 100vw;
  top: 0;
  left: 0;


  header {
    position: fixed;
    top: 0px;
    left: 0px;
    height: $headerHeight;
    width: 100%;
    display: flex;
    background-color: white;
    color: $mainColor;
    z-index: 9000;
    flex-flow: row nowrap;
    justify-content: flex-start;
    border-bottom: 1px solid transparent;

    &.shadow {
      box-shadow: 0 0 5px transparentize($g20, 0.8);
    }

    &:not(.shadow) {
      border-bottom: 1px solid $w230;
    }

    .logo {
      display: flex;
      flex: 0 0 auto;
      padding: 5px;
      align-items: center;

      img {
        height: 30px;
        width: auto;
        max-width: 100%;
      }
    }

    nav.desktop {
      display: flex;
      flex-flow: row nowrap;
      flex: 1 1 auto;


      ul.nav-list {
        display: flex;
        flex-flow: row wrap;
        flex: 1 0 auto;
        padding: 0px 15px 0px 15px;

        li.route {
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
          align-items: center;
          margin-right: 5px;
          color: $mainStyle;
          align-content: center;
          font-size: 15px;
          font-weight: bold;
          padding: 7px 5px 5px 5px;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
          cursor: pointer;

          span{ 
            padding: 8px 10px 8px 10px;
            border-radius: 5px;
          }

          /deep/ div, svg {
            fill: $g90;
            height: 25px;
            width: 25px;
          }
          &:not(.router-link-active):hover {
            span{background-color: $w240;}
            }
          &.router-link-active {
            span {
              background-color: $w245;
              color: $g90;
            }
            /deep/ svg { fill: $mainStyle }
          }
        }
        
      }

      ul.login-list {
        display: flex;
        flex-flow: row nowrap;
        flex: 1 0 auto;
        justify-content: flex-end;
        align-items: center;
        padding: 11px 15px 11px 15px;

        %header-button {
          display: flex;
          position: relative;
          flex-flow: row nowrap;
          justify-content: center;
          align-items: center;
          align-content: center;
          font-size: 15px;
          font-weight: bold;
          border-radius: 35px;
          transition: background-color 0.3s;
          cursor: pointer;
          &.color {
            background-color: $mainStyle;
            color: white;
          }

          &:hover {
            &.color {
              background-color: darken($mainStyle, 5%);
            }
            &:not(.color) {
              background-color: $w245;
            }
          }
          &:active {
            &.color {
              background-color: darken($mainStyle, 10%);
            }
            &:not(.color) {
              background-color: $w230;
            }
          }

          span {
            padding: 7px 15px 8px 15px;
            display: flex;
            .count {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 20px;
              min-width: 20px;
              font-weight: bold;
              color: white;
              font-size: 12px;
              background-color: $mainStyle;
              border-radius: 30px;
              margin-left: 5px;
            }
         }

          .profile-image {
            @include bg-center;
            height: 28px;
            width: 28px;
            margin-left: -5px;
            margin-right: 15px;
            border-radius: 40px;
            border: 2px solid $mainStyle;
          }
        }

        li.header-button {
          &:not(.popup) {
            margin-left: 10px;
            @extend %header-button;
          }

          &.popup {
            position: relative;
            margin-left: 10px;
            white-space: nowrap;

            .bouton-data {
              @extend %header-button;

              &.image {
                padding: 5px;
              }

              .badge {
                position: absolute;
                right: 5px;
                top: 0;
                transform: translateX(50%);
                background-color: $red1;
                color: white;
                border-radius: 40px;
                font-size: 11px;
                height: 18px;
                padding: 0 6px 0 6px;
                line-height: 18px;
              }

              
            }

            .popup-box.active ~ .bouton-popup .bouton-data{
              background-color: $w220;
            }

          }
        }  
      }
    }

    nav.mobile-panel, .mobile-header {
      display: none;
    }

    .mobile-header {
      flex-flow: row nowrap;
      align-items: center;
      width: 100%;

      .mobile-nav-button {
        flex: 1 1 auto;
        padding: 10px;
        
        .svg-container {
          border-radius: 5px;
          padding: 3px;
          :active { background-color: $w235;}
        }
      }

      .logo {
        flex: 0 0 auto;
      }
    }

    nav.mobile-panel {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: rgba(0,0,0,0.4);

      .window {
        display: flex;
        flex-flow: column wrap;
        overflow-y: auto;
        overflow-x: hidden;
        position: absolute;
        top: 0;
        height: 100%;
        width: 250px;
        background-color: white;


        .user-panel {
          display: flex;
          flex-flow: column wrap;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);

          .user-infos {
            display: flex;
            flex-flow: row nowrap;
            height: 80px;
            padding: 10px;
            align-items: center;

            .picture {
              height: 50px;
              flex: 0 0 auto;
              width: 50px;
              border-radius: 100%;
              border: 3px solid $mainStyle;
              @include bg-center;
            }

            .name {
              padding-left: 10px;
              font-weight: bold;
            }
          }

          .user-links {
            display: flex;
            flex-flow: column wrap;

            .link {
              display: flex;
              height: 50px;
              border-top: 1px solid $w240;
              justify-content: center;
              align-items: center;
              font-weight: bold;
            }
          }
        }

        .link-panel {
          display: flex;
          flex-flow: column wrap;

          .link {
            display: flex;
            height: 50px;
            border-bottom: 1px solid $w240;
            justify-content: center;
            align-items: center;

            &.color {
              background-color: $mainStyle;
              color: white;
            }
          }
        }
      }

    }

    @media screen and (max-width: 700px) {
      nav.desktop {
        display: none;
      }

      nav.mobile-panel, .mobile-header {
        display: flex;
      }
        
    }
  }
}

.user{
  position: relative;
  display: flex;
  height: auto;
  flex-flow: column nowrap;
  border-bottom: 1px solid $w240;
  align-items: center;

  .user-picture{
    position: relative;
    height: 100px;
    width: 100px;
    border-radius: 100%;
    margin-top: 10px;
    border: 2px solid $mainStyle;
    @include bg-center;
  }

  .user-name{
    position: relative;
    height: 40px;
    font-size: 17px;
    line-height: 40px;
    text-align: center;
    text-transform: capitalize;
    font-weight: bold;
  }
}

.user-options-popup {
  width: 100%;

  .user-option-list{
    position: relative;
    display: flex;
    flex-flow: column nowrap;
    overflow: hidden;
    border-radius: 0 0 3px 3px;

    .user-option{
      position: relative;
      height: 40px;
      padding-left: 20px;
      line-height: 40px;
      font-size: 14px;
      cursor: pointer;
      font-weight: bold;

      &.red {
        color: $red1;
      }

      &:hover{
        background-color: $w245;
      }

      &:active{
        background-color: $w220;
      }
      
    }
  }
}

.coulisse-enter-active {
  transition: opacity 0.3s;
  .window {
    transition: transform 0.3s;
    transform: translateX(-270px);
  }
}
.coulisse-leave-active {
  transition: opacity 0.3s;
  .window {
    transition: transform 0.3s;
    transform: translateX(-270px);
  }
}

.coulisse-enter, .coulisse-leave-to {
  opacity: 0;
}




</style>

