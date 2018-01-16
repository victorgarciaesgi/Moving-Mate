<template>
  <div class='header-wrapper'>
    <Popup ref='profile' v-if='loginState.isLoggedIn' :width='250'>
      <template>
        <div class="user">
            <div class="user-picture" :style='userProfileImage'></div>
            <div class="user-name">{{loginState.username | capitalize}}</div>
        </div>
        <ul class='user-option-list'>
            <a href="#"><li class='user-option'>Mon profil</li></a>
              <a href="#">
                <li id='aide' class='user-option'>
                  Administration
                </li>
              </a>
            <li class='user-option'>Aide</li>
            <li class='user-option' @click='disconnectRequest'>Deconnexion</li>
        </ul>
      </template>
    </Popup>

    <header>
      <nav>
        <router-link to='/' class='logo'>
          <img src="~@images/logo_banniere.svg" alt="">
        </router-link>
        <ul class='nav-list'>
          <router-link :to='item.link' v-for="item in nav" :key='item.name'>
            <li class='route' :class='{active: $store.state.route.path === item.link}' :size='26'>
              <SvgIcon class='tablet' :src='item.icon'></SvgIcon>
              <span class='not-tablet'>{{item.title}}</span>
            </li>
          </router-link>
        </ul>
        <ul class='login-list'>
          <li class="header-button color">
            <span>Devenir déménageur</span>
          </li>
          <template v-if='loginState.isLoggedIn' >
            <li class="header-button" @click.stop="togglePopup('profile', $event.target)" 
              :class='{active: refs.profile?refs.profile.show:false}'>
              <span>{{loginState.username | capitalize}}</span>
              <div class='profile-image' :style='userProfileImage'></div>
            </li>
          </template>
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
import { namespace, Getter, State, Action, Mutation } from "vuex-class";

import { ILoginState, ISignupState } from '@types';
import { timeout } from '@methods';
import { SvgIcon, Connexion, Inscription, Popup } from "@components";

const LoginGetter = namespace('LoginModule', Getter);
const LoginMutation = namespace('LoginModule', Mutation);
const LoginAction = namespace('LoginModule', Action);
const SignupMutation = namespace('SignupModule', Mutation);

@Component({
  components: { Connexion, Inscription, Popup, SvgIcon },
})
export default class HeaderComponent extends Vue {
  @State('LoginModule') loginState: ILoginState;
  @State('SignupModule') signupState: ILoginState;
  @LoginGetter fullName;
  @LoginMutation showLogin;
  @LoginAction disconnectRequest;
  @SignupMutation showSignup;

  public refs = {};

  mounted() {
    this.refs = this.$refs;
  }

  async updated() {
    this.refs = this.$refs;
  }

  get userProfileImage() {
    let image = this.loginState.profilePicture || require('@images/user.jpg')
    return {
      backgroundImage: `url(${image})`
    }
  }

  togglePopup(popupName: string, target: HTMLElement) {
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
}


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
  box-shadow: 0 0 5px transparentize($g20, 0.8);

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

        li.route {
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
          align-items: center;
          align-content: center;
          font-size: 14px;
          padding: 7px 5px 5px 5px;
          font-weight: bold;
          margin-right: 5px;
          border-bottom: 3px solid transparent;

          &:not(.active):hover {
            border-color: $mainStyle;
            color: $g40;

          }

          &.active {
            border-color: $mainStyle;
            color: $g40;

            /deep/ svg {
              fill: $mainStyle
            }
          }

          span {
            margin-left: 5px;
          }

          /deep/ div, svg {
            fill: $g90;
            height: 25px;
            width: 25px;
          }
        }
      }
    }

    ul.login-list {
      display: flex;
      flex-flow: row nowrap;
      flex: 1 0 auto;
      justify-content: flex-end;
      padding: 8px 15px 8px 15px;

      li.header-button {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        align-content: center;
        font-size: 14px;
        font-weight: bold;
        margin-left: 10px;
        border-radius: 40px;
        cursor: pointer;

        &:not(.color) {
          &:hover {
            background-color: $w240;
          }

          &.active {
            background-color: $w230;
          }
        }

        &.color {
          background-color: $mainStyle;
          color: white;

          &:hover {
            background-color: darken($mainStyle, 4%);
          }

          &:active {
            background-color: darken($mainStyle, 8%);
          }
        }

        span {
          padding: 7px 15px 8px 15px;
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

.user-option-list{
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  border-radius: 0 0 3px 3px;

  .user-option{
    position: relative;
    height: 35px;
    padding-left: 20px;
    line-height: 35px;
    font-size: 14px;
    cursor: pointer;
    font-weight: bold;

    &:hover{
      background-color: $w240;
    }

    &:active{
      background-color: $w220;
    }
  }
}

</style>

