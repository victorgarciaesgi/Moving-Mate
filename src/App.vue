<template>
  <div id='app' @click='closePopups()'>
    <template>
      <HeaderComponent/>
      <ProgressBarComponent/>
      <Notifications/>
      <Alerts/>
      <div class='view'>
        <transition name='fade' mode='out-in'>
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
import { EventBus, RootState, storeBuilder, DebugMode } from "@store";
import router from "./router";
import { HeaderComponent, Notifications, ProgressBarComponent, Alerts } from "@components";
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
    Alerts
  },
  router
})
export default class App extends Vue {

  public transitionName;

  get sessionChecked() { return LoginStore.state.sessionChecked};

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