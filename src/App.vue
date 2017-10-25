<template>
  <div id='app'>
    <HeaderComponent/>
    <Alerts/>
    <transition name='fade' mode='out-in'>
      <router-view/>
    </transition>
  </div>
</template>


<script lang="ts"> 
import Vue from 'vue';
import Component from 'vue-class-component';
import { Action, namespace } from "vuex-class";

import router from './router';
import { store } from '@store';
import * as Components from '@components';

const LoginActions = namespace('LoginModule', Action);

@Component({
  components: {
    "HeaderComponent": Components.HeaderComponent,
    "Alerts": Components.Alerts
  },
  router,
  store
})
export default class App extends Vue {

  @LoginActions checkUserSession;

  created() {
    this.checkUserSession();
  }
}


</script> 