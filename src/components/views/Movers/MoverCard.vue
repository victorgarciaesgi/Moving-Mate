<template>
  <li class='Mover-card' @click.prevent='redirectToDetail'>
    <div class="header">
      <div class='userPicture' v-if='profilePic'>
        <BackgroundLoader :src='profilePic.large' :smallSrc='profilePic.thumbnail'/>
      </div>
      <div class='userName'>
        <span class='value'></span>
      </div>
      <div class='userDisponibility'>
        <div class='iconState'></div>
        <div class='stateValue'></div>
      </div>
    </div>
    <div class='content'></div>
  </li>

</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop} from 'vue-property-decorator';
import {IMover} from '@types';
import { StarRating, SvgIcon, UISwitch, BackgroundLoader } from '@components';
import * as Chance from 'chance';
import axios from 'axios';
import Router, {routesNames} from '@router';
import {DateMoving} from '@classes';

@Component({
  components: {
    StarRating, SvgIcon, UISwitch, BackgroundLoader
  }
})
export default class MoverCard extends Vue {

  @Prop({required: true}) mover: IMover;
  public css = require('@css');
  public profilePic = null;


  redirectToDetail() {
    // A changer vers id
    // Router.push({name: routesNames.moverInfos, params: {moverId: this.mover.id.toString()}});
  }

  async fetchImage() {
    let {data} = await axios.get(`https://randomuser.me/api/?inc=picture`);
    this.profilePic = data.results[0].picture;
  }

  mounted () {
    this.fetchImage();
  }
}
</script>


<style lang="scss" scoped>

$radius: 8px;

.Mover-card {
  display: flex;
  position: relative;
  flex-flow: column nowrap;
  flex: 0 0 auto;
  width: 300px;
  height: 400px;
  border-radius: 5px;
  box-shadow: 0 0 25px rgba(30,30,30,0.16);
  background-color: white;
  overflow: hidden;
  margin: 10px;
  font-size: 16px;
  font-weight: normal;
  color: $g90;
  font-family: 'Open Sans', sans-serif;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }

  &:active {
    transform: scale(0.95);
  }

  .header {
    display: flex;
    position: relative;
    flex-flow: row nowrap;
    flex: 0 0 auto;
    height: auto;
    border-radius: 5px 5px 0 0;

    .userPicture {
      flex: 1 1 auto;
      height: 200px;
    }
  }

}

</style>


