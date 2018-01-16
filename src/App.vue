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
import Vue from 'vue';
import Component from 'vue-class-component';
import {EventBus, store} from '@store'
import router from './router';
import { Action, namespace } from "vuex-class";

import {HeaderComponent, Alerts} from '@components';
import $ from 'jquery'


const LoginActions = namespace('LoginModule', Action);

@Component({
  components: {
    HeaderComponent, Alerts
  },
  router,
  store,
})
export default class App extends Vue {

  @LoginActions checkUserSession;

  created() {
    this.checkUserSession();
    document.addEventListener("touchstart",() => {},<any>{passive: true});
    $(window).resize(() => {EventBus.$emit('closePopups')});
  }

  mounted() {
    console.log(this)
  }
  

  closePopups() {
    EventBus.$emit('closePopups');
  }
}


</script> 