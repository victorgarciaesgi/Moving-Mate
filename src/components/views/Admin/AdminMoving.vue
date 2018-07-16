<template>
  <div class='AdminMovings'>
    <MovingCard :moving='moving' v-for='moving of movingList' :key='moving.id' admin>
    </MovingCard>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import {UserStore, LoginStore, AdminStore} from '@store';
import axios from 'axios';
import {UITabs, BackgroundLoader, SvgIcon, StarRating, UISwitch} from '@components';
import { routesNames } from '@router';
import MovingCard from '../Moving/MovingCard.vue';
import {timeout} from '@methods'
import {Forms, AlertsElement, ActionsElements} from '@classes';

@Component({
  components: {UITabs, MovingCard}
})

export default class AdminUsers extends Vue {

  get movingList() {return AdminStore.state.movingList};
}
</script>


<style lang="scss" scoped>


.AdminMovings {
  display: flex;
  flex-flow: row wrap;
  min-height: 100%;
  width: 100%;
  padding: 20px;
  justify-content: center;
  align-items: flex-start;
}

</style>


