<template>
  <div class='header-wrapper'>
    <header :class='{shadow: headerBox}'>
      <nav>
        <router-link to='/' class='logo'>
          <img src="~@images/logo_banniere.svg" alt="">
        </router-link>
        <ul class='nav-list'>
          <router-link :to='item.link' v-for="item in nav" :key='item.name'>
            <li class='route' :size='26'>
              <!-- <SvgIcon class='tablet' :src='item.icon'></SvgIcon> -->
              <span>{{item.title}}</span>
            </li>
          </router-link>
        </ul>
        <ul class='login-list'>
          <li class="header-button color" v-if='!(loginState.isLoggedIn && userInfos.isMover)'>
            <router-link to='/bemover'>
              <span>Devenir déménageur</span>
            </router-link>
          </li>

          <!-- If user logged in -->

          <template v-if='loginState.isLoggedIn'>
            <li class='header-button popup'>
              <Popup v-if='loginState.isLoggedIn' @open='fetchMyMoving'>
                <template slot='popup'>
                  <div class='center' v-if='searchingMyMoving'><img src='~@images/loading.svg'></div>
                  <div v-else-if="myMoving">
                    <MovingCard :moving='myMoving' embed />
                  </div>
                  <div v-else class='center' >Aucun déménagement trouvé</div>
                </template>
                <div slot='button' class='bouton-data' >
                  <span>Mon déménagement</span>
                </div>
              </Popup>
            </li>
            <li class='header-button popup'>
              <Popup v-if='loginState.isLoggedIn' :width='300'>
                <template slot='popup'>
                  <div class='center'>
                    <SvgIcon :src='require("@icons/notifs/notification_none.svg")'/>
                    <span>Aucune notification</span>
                  </div>
                </template>
                <div slot='button' class='bouton-data image' >
                  <SvgIcon :src="require('@icons/notifs/notification_empty.svg')" :size='24'></SvgIcon>
                </div>
              </Popup>
            </li>

            <li class="header-button popup">
              <Popup :width='250'>
                <template slot='popup'>
                 <div class='user-options-popup'>
                    <div class="user">
                      <div class="user-picture" :style='getProfileImage'></div>
                      <div class="user-name">{{userInfos.username | capitalize}}</div>
                    </div>
                    <ul class='user-option-list'>
                      <router-link tag='li' :to='userProfilePath' class='user-option'>Mon profil</router-link>
                      <li class='user-option'>Historique de déménagements</li>
                      <li class='user-option' v-if='isAdmin'>Administration</li>
                      <li class='user-option'>Aide</li>
                      <li class='user-option' @click='disconnectRequest'>Deconnexion</li>
                    </ul>
                 </div>
                </template>
                <div slot='button' class='bouton-data'>
                  <span>{{userInfos.username | capitalize}}</span>
                  <div class='profile-image' :style='getProfileImage'></div>
                </div>
              </Popup>
            </li>
          </template>

          <!-- Else -->

          <template v-else>
            <li class="header-button" @click='showLogin'>
              <span>Connexion</span>
            </li>
            <li class="header-button"  @click='showSignup'>
              <span>Inscription</span>
            </li>
          </template>
        </ul>
      </nav>
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

import { ILoginState, ISignupState } from '@types';
import { timeout } from '@methods';
import { SvgIcon, Connexion, Inscription, Popup } from "@components";
import MovingCard from '@views/Moving/MovingCard.vue';
import { LoginStore, SignupStore, GlobalStore, MovingStore } from '@modules'
import { StringifyOptions } from "querystring";
import {routesNames} from '@router';

@Component({
  components: { Connexion, Inscription, Popup, SvgIcon, MovingCard },
})
export default class HeaderComponent extends Vue {

  get loginState() {return LoginStore.state}
  get userInfos() {return LoginStore.state.userInfos};
  get fullName() {return LoginStore.getters.fullName};
  get userPicture(){return LoginStore.getters.userPicture};
  get isAdmin() {return LoginStore.getters.isAdmin};
  get headerBox() {return GlobalStore.state.headerBoxShadow};
  get userProfilePath() {return {name: routesNames.user}}

  private showLogin = LoginStore.mutations.showLogin;
  private disconnectRequest = LoginStore.actions.disconnectRequest;

  get signupState() {return SignupStore.state}
  private showSignup = SignupStore.mutations.showSignup;
  

  public $store: Store<RootState>;
  public popups = [];

  get getProfileImage() {
    return {
      backgroundImage: `url(${this.userPicture})`
    }
  }

  public myMoving = null;
  public searchingMyMoving = false;

  async fetchMyMoving() {
    if (this.myMoving) return;
    try {
      this.searchingMyMoving = true;
      const moving = await MovingStore.actions.getOneAnnouncement('1');
      this.myMoving = moving;
    } finally {
      this.searchingMyMoving = false;
    }
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
  width: 100%;
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
    z-index: 10000;
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

    nav {
      display: flex;
      flex-flow: row nowrap;
      flex: 1 1 auto;

      ul.nav-list {
        display: flex;
        flex-flow: row wrap;
        flex: 1 0 auto;
        padding: 0px 15px 0px 15px;

        a {
          display: flex;
          margin-right: 5px;
          color: $mainStyle;

          li.route {
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
            align-content: center;
            font-size: 15px;
            font-weight: bold;
            padding: 7px 5px 5px 5px;
            border-bottom: 3px solid transparent;
            transition: all 0.3s;
            span{ 
              padding: 8px 10px 8px 10px;
              border-radius: 5px;
            }

            /deep/ div, svg {
              fill: $g90;
              height: 25px;
              width: 25px;
            }
          }

          &:not(.router-link-active):hover li.route {
            span{background-color: $w240;}
          }
          &.router-link-active li.route {
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

          span {padding: 7px 15px 8px 15px;}

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
            }

            .popup-box.active ~ .bouton-popup .bouton-data{
              background-color: $w220;
            }

          }
        }  
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

      &:hover{
        background-color: $w245;
      }

      &:active{
        background-color: $w220;
      }
    }
  }
}


</style>

