<template>
  <div id='app' @click='closePopups()'>
    <template>
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
    <!-- <template>
      <div class='loader-login'>
        <img src="~@images/loading_white.svg" height="60" width="60">
        <span>Chargement</span>
      </div>
    </template> -->
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
import { LoginStore } from "@modules";
import $ from "jquery";

const store: Store<RootState> = storeBuilder.vuexStore({
  strict: DebugMode
});
sync(store, router);

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
    background-color: $mainStyle;
    color: white;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
    align-content: center;

    img {
      margin-bottom: 10px;
    }
  }
}

</style>