<template>
  <div id='app' @click='closePopups()'>
    <HeaderComponent/>
    <ProgressBarComponent/>
    <Notifications/>
    <div class='view'>
      <transition name='fade' mode='out-in'>
        <router-view/>
      </transition>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { Store } from "vuex";
import { sync } from 'vuex-router-sync'
import { Component } from "vue-property-decorator";
import { EventBus, RootState, storeBuilder, DebugMode } from "@store";
import router from "./router";
import { HeaderComponent, Notifications, ProgressBarComponent } from "@components";
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
    ProgressBarComponent
  },
  router
})
export default class App extends Vue {
  created() {
    document.addEventListener("touchstart", () => {}, <any>{ passive: true });
    $(window).resize(() => {
      EventBus.$emit("closePopups");
    });
  }

  closePopups() {
    EventBus.$emit("closePopups");
  }
}
</script> 