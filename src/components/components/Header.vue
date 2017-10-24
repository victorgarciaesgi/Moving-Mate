<template>
  <div class='header-wrapper'>
    <header>
      <nav>
        <router-link to='/' class='logo'>
          <img src="~@images/logo_banniere.svg" alt="">
        </router-link>
        <ul class='nav-list'>
          <router-link :to='item.link' v-for="item in nav" :key='item.name'>
            <li class='route' :class='{active: $route.name == item.name}' :size='26'>
              <span>{{item.title}}</span>
            </li>
          </router-link>
        </ul>
        <ul class='login-list'>
          <li class="header-button color">
            Devenir déménageur
          </li>
          <template v-if='loginState.isLoggedIn'>

          </template>
          <template v-else>
            <li class="header-button" @click='showConnexion()'>
              Connexion
            </li>
            <li class="header-button">
              Inscription
            </li>
          </template>
        </ul>
      </nav>
    </header>
  
  <Connexion :show='ConnexionState' v-if='!loginState.isLoggedIn' @close='closeConnexion()'></Connexion>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { namespace, Getter, State, Action } from "vuex-class";

import { uppercase } from "@filters";
import { ILoginState } from '@types';
import { timeout } from '@methods';
import { SvgIcon, Connexion } from "@components";

const LoginGetter = namespace('LoginModule', Getter);
const NotifAction = namespace('NotificationsModule', Action);

@Component({
  name: "HeaderComponent",
  components: { Connexion },
  filters: {
    uppercase: uppercase
  }
})
export default class HeaderComponent extends Vue {
  @State('LoginModule') loginState: ILoginState;
  @LoginGetter fullName;
  @NotifAction addNotification;


  public ConnexionState: boolean = true;

  showConnexion() {
    this.ConnexionState = true;
  }

  closeConnexion() {
    this.ConnexionState = false;
  }

  // async mounted() {
  //   await timeout(1000);
  //   this.addNotification({type: "success", message: "Test de notification"});
  // }

  public nav = [
    { title: "Je déménage", name: "moving", link: "/moving" },
    { title: "Les déménageurs", name: "movers", link: "/movers" }
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

        li {
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
          }

          div,
          svg {
            fill: white;
            height: 22px;
            width: 22px;
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

      li {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        align-content: center;
        font-size: 14px;
        padding: 7px 15px 8px 15px;
        font-weight: bold;
        margin-right: 10px;
        border-radius: 40px;
        cursor: pointer;

        &:not(.color):hover {
          background-color: $w235;
        }

        &.color {
          background-color: $mainStyle;
          color: white;

          &:hover {
            background-color: darken($mainStyle, 2%);
          }
        }
      }
    }
  }
}
</style>

