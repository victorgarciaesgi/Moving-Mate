<template>
  <div id='app' @click='closePopups()'>
    <template v-if='sessionChecked'>
      <HeaderComponent/>
      <ProgressBarComponent/>
      <Notifications/>
      <Alerts v-if='alertState.alertShow'/>
      <div class='view'>
        <transition name='slide' mode='out-in'>
          <router-view/>
        </transition>
      </div>
    </template>
    <template v-else>
      <div class='loader-login'>
        <SvgIcon :src="require('@images/loading.svg')" :size='60'/>
        <span>Connexion...</span>
      </div>
    </template>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { Store } from "vuex";
import { sync } from 'vuex-router-sync'
import { Component, Watch } from "vue-property-decorator";
import { EventBus, RootState, storeBuilder, DebugMode, AlertsStore } from "@store";
import router from "./router";
import { HeaderComponent, Notifications, ProgressBarComponent, Alerts, SvgIcon } from "@components";
import { LoginStore, UserStore } from "@modules";
import $ from "jquery";
import { API_URL, APP_BASE } from "@api";
import { setInterval } from "timers";

const store: Store<RootState> = storeBuilder.vuexStore({
  strict: DebugMode
});
sync(store, router);
declare var cookieconsent;


@Component({
  store: store,
  components: {
    HeaderComponent,
    Notifications,
    ProgressBarComponent,
    Alerts,
    SvgIcon
  },
  router
})
export default class App extends Vue {

  public transitionName;

  get sessionChecked() { return LoginStore.state.sessionChecked};
  get alertState() { return AlertsStore.state}


  created() {
    document.addEventListener("touchstart", () => {}, <any>{ passive: true });

    $(window).resize(() => {
      EventBus.$emit("closePopups");
    });

    window.addEventListener("load", function(){
    cookieconsent.initialise({
      "palette": {
        "popup": {
          "background": "#000"
        },
        "button": {
          "background": "#f1d600"
        }
      },
      "position": "bottom-right",
      "content": {
        "message": "En poursuivant votre navigation sur ce site, vous acceptez l'utilisation de Cookies de MovingMate et de tiers permettant la réalisation de statistiques de visites et de mesure d'audience et pour vous proposer des services et offres adaptés",
        "dismiss": "J'accepte",
        "href":  APP_BASE + 'cgu'
      }
    })});

    const interval = setInterval(() => {
      UserStore.actions.getUserNotifications();
    }, 10000)
  }

  closePopups() {
    EventBus.$emit("closePopups");
  }

  // @Watch('$route') routeChanged(to, from) {
  //   const toDepth = to.path.split('/').length
  //   const fromDepth = from.path.split('/').length
  //   this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  // }
}
</script>


<style lang='scss' scoped>

#app {
  height: 100%;
  width: 100%;
  .loader-login {
    display: flex;
    height: 100%;
    width: 100%;
    color: $g60;
    font-weight: bold;
    font-size: 20px;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
    align-content: center;

    img {
      margin-bottom: 20px;
    }
  }
}

</style>