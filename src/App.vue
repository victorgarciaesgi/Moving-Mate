<template>
  <div id='app' @click='closePopups()'>
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
import { store, EventBus } from '@store';
import * as Components from '@components';
import $ from 'jquery'

import {Api} from '@store';

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
    document.addEventListener("touchstart",() => {},<any>{passive: true});
    $(window).resize(() => {EventBus.$emit('closePopups')})
  }

  mounted() {
    
  }
  

  closePopups() {
    EventBus.$emit('closePopups');
  }
}


</script> 