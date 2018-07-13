<template>
  <div class='Admin'>
    <UITabs :tabs='tabs'/>
    <section class='admin-views'>
      <transition name='fade' mode='out-in'>
        <router-view />
      </transition>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import {UserStore, LoginStore} from '@store';
import axios from 'axios';
import {UITabs, BackgroundLoader, SvgIcon, StarRating, UISwitch} from '@components';
import { routesNames } from '@router';
import {ITab} from '@types';
import {timeout} from '@methods'
import {Forms, AlertsElement, ActionsElements} from '@classes';

@Component({
  components: {UITabs, BackgroundLoader, SvgIcon, StarRating, UISwitch}
})

export default class Admin extends Vue {

  get tabs(): ITab[]  {
    return [
      {title: 'Utilisateurs', icon: require('@icons/movers/user.svg'), to: {name: routesNames.adminUsers}},
      {title: 'Déménagements', icon: require('@icons/truck.svg'), to: {name: routesNames.adminMovings}},
    ]
  }
}
</script>


<style lang="scss" scoped>


.Admin {
  display: flex;
  flex-flow: column wrap;
  min-height: 100%;
  width: 100%;
  
  .admin-views {
    display: flex;
    flex-flow: row nowrap;
    padding: 20px;
    width: 100%;
    justify-content: center;
    align-items: flex-start;
    min-width: 0;
    
  }

}

</style>


