<template>
  <div class='AdminUsers'>
    <MoverCard :mover='user' v-for='user of userList' :key='user.id' admin>
    </MoverCard>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import {UserStore, LoginStore, AdminStore} from '@store';
import axios from 'axios';
import {UITabs, BackgroundLoader, SvgIcon, StarRating, UISwitch} from '@components';
import { routesNames } from '@router';
import MoverCard from '../Movers/MoverCard.vue';
import {timeout} from '@methods'
import {Forms, AlertsElement, ActionsElements} from '@classes';

@Component({
  components: {UITabs, MoverCard}
})

export default class AdminUsers extends Vue {

  get userList() {return AdminStore.state.userList};
}
</script>


<style lang="scss" scoped>


.AdminUsers {
  display: flex;
  flex-flow: row wrap;
  min-height: 100%;
  width: 100%;
  padding: 20px;
  justify-content: center;
  align-items: flex-start;
}

</style>


