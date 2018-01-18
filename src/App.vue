<template>
  <div id='app' @click='closePopups()'>
    <HeaderComponent/>
    <Alerts/>
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
import {sync} from 'vuex-router-sync'
import {Component} from "vue-property-decorator";
import { EventBus, RootState, storeBuilder, DebugMode } from "@store";
import router from "./router";
import { HeaderComponent, Alerts } from "@components";
import { LoginStore } from "@modules";
import $ from "jquery";

const store: Store<RootState> = storeBuilder.vuexStore({strict: DebugMode});
sync(store, router);

@Component({
  components: {
    HeaderComponent,
    Alerts
  },
  router,
  store: store,
})
export default class App extends Vue {
  created() {
    LoginStore.actions.checkUserSession();
    document.addEventListener("touchstart", () => {}, <any>{ passive: true });
    $(window).resize(() => {
      EventBus.$emit("closePopups");
    });
  }

  mounted() {}

  closePopups() {
    EventBus.$emit("closePopups");
  }
}
</script> 