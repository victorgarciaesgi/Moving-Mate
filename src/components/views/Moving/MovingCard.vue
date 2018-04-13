<template>
  <li class='moving-card' :class='{onMap}' @click.prevent='redirectToDetail'>
    <div class='header'>
      <div class='profil'>
        <div class='profil-bg' :style='profilePic'></div>
      </div>
      <div class='infos'>
        <div class='name item'>{{userName | capitalize}}</div>
        <div class='begin item'>
          <!-- <span class='day'>{{getBegin.day}}</span> -->
          <div class='date'>
            <span class='number'>{{getBegin.number}}</span>
            <span class='mounth'>{{getBegin.mounth}}</span>
            <span class='hour'>{{getBegin.hour}}</span>     
          </div>       
        </div>
      </div>
    </div>
    <div class='content'>
      <div class='moving-places'>
        <div class='depart element'>
          <div class='icon black'></div>
          <span>{{getDepart}}</span>
        </div>
        <div class='arrivee element'>
          <div class='icon blue'></div>
          <span>{{getArrivee}}</span>
        </div>
        <div class='liaison'></div>
      </div>
      <div class='moving-infos'>
        <div class='movers info'>
          <div class='info-content'>
            <strong>2</strong>
            <span>déménageurs</span>
          </div>
        </div>
        <div class='price info'>
          <div class='info-content'>
            <strong>{{moving.pricePerHourPerUser}}€</strong>
            <span>par pers.</span>
          </div>
        </div>
        <div class='elevator info'>
          <div class='info-content'>
            <strong><SvgIcon :src='require("@icons/moving/present.svg")' :color='css.mainStyle'/></strong>
            <span>Ascenseur</span>
          </div>
        </div>
        <div class='parking info'>
          <div class='info-content'>
            <strong><SvgIcon :src='require("@icons/moving/not_present.svg")' :color='css.red1'/></strong>
            <span>Parking</span>
          </div>
        </div>
      </div>
    </div>
    <div class='triangle' v-if='onMap'></div>
  </li>

</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop} from 'vue-property-decorator';
import {IMovingEvent} from '@types';
import { StarRating, SvgIcon } from '@components';
import * as Chance from 'chance';
import axios from 'axios';
import Router from '@router';

@Component({
  components: {
    StarRating, SvgIcon
  }
})
export default class MovingCard extends Vue {

  @Prop({required: true}) moving: IMovingEvent;
  @Prop({required: false}) onMap: boolean;
  public css = require('@css');
  public note = 3;
  public iconColor = "#888";
  public profilePic = {backgroundImage: `url("${require('@images/user.jpg')}")`};


  // get profilePic() {
  //   return {backgroundImage: `url("${require('@images/user.jpg')}")`}
  // };
  get getDescription() { return this.chance.paragraph(); }
  get chance() { return new Chance(); }
  get userName() { return this.moving.username; }
  get getDepart() { return this.moving.addressIn; }
  get getArrivee() { return this.moving.addressOut;}
  get getBegin() { return {hour: '15:00', number: '27', mounth:'Avril'}; }

  get getMovingUri() {
    return '/moving';
  }

  redirectToDetail() {
    Router.push('/');
  }

  async mounted () {
    // console.log(new Date(this.moving.dealDays))
    // let {data} = await axios.get(`https://randomuser.me/api/?inc=picture&seed=${this.moving.username}`);
    let {data} = await axios.get(`https://randomuser.me/api/?inc=picture`);

    this.profilePic = {backgroundImage: `url("${data.results[0].picture.medium}")`};
  }
}
</script>


<style lang="scss" scoped>

$radius: 8px;

.moving-card {
  display: flex;
  position: relative;
  flex-flow: column nowrap;
  flex: 0 0 auto;
  width: 350px;
  height: auto;
  border-radius: 5px;
  box-shadow: 0 0 25px rgba(30,30,30,0.18);
  background-color: white;
  overflow: hidden;
  margin: 10px;
  font-size: 16px;
  font-weight: normal;
  font-family: 'Open Sans', sans-serif;
  cursor: pointer;


  &.onMap {
    position: absolute;
    margin: 0;
    left: 50%;
    bottom: 55px;
    transform: translateX(-50%);
    height: auto;
    overflow: initial;

    $triangleSize: 13px;

    .triangle{
      position: absolute;
      z-index: 10009;
      width: 0;
      height: 0;
      border-left: $triangleSize solid transparent;
      border-right: $triangleSize solid transparent;
      border-top: $triangleSize solid white;
      filter: drop-shadow(0px 6px 4px rgba(50,50,50, 0.1));
      left: 50%;
      @include translateX(-50%);
      top: 100%;
    }
  }

  .header {
    display: flex;
    position: relative;
    flex-flow: row nowrap;
    flex: 0 0 auto;
    height: 80px;
    color: $w240;
    // border-bottom: 1px solid $w230;
    background-color: $mainStyle;
    border-radius: 5px 5px 0 0;

    .profil {
      display: flex;
      position: relative;
      width: 80px;
      justify-content: center;
      align-items: center;
      padding: 5px;

      .profil-bg {
        @include bg-center;
        border-radius: 100%;
        width: 60px;
        height: 60px;
        border: 2px solid white;
      }
    }

    .infos {
      display: flex;
      position: relative;
      flex-flow: column nowrap;
      align-items: center;
      flex: 1 1 auto;

      div.item {
        display: flex;
        justify-content: flex-start;
        flex: 1 1 auto;
        width: 100%;
        padding: 3px 0 3px 0;

        &.name {
          font-weight: bold;
          align-items: flex-end;
          margin-bottom: 3px;
          justify-content: flex-start;
        }

        &.begin {
          display: flex;
          flex-flow: column nowrap;
          font-size: 13px;
          color: lighten($mainColor, 30%);

          .date {
            display: flex;
            flex-flow: row nowrap;
            flex: 0 0 auto;
            overflow: hidden;
            border-radius: 4px;

            & > span {
              padding: 3px 10px 3px 10px;
            }

            .number {
              background-color: transparentize($red1, 0.2);
              color: white;
              font-weight: bold;
            }

            .mounth {
              color: $g90;
              border: 1px solid white;
              background-color: white;
              border-left: none;
              border-radius: 0 4px 4px 0;
            }

            .hour {
              color: $g90;
              border: 1px solid white;
              background-color: white;
              margin-left: 10px;
              border-radius: 4px;
              
            }
          }
        }

        &.note {
          /deep/ .star-container {
            align-self: flex-start !important;

          }
        }
      }
    }
  }

  .content {
    display: flex;
    position: relative;
    flex-flow: column nowrap;
    flex: 1 1 auto;

    .moving-infos {
      display: flex;
      width: 100%;
      flex-flow: row wrap;
      position: relative;
      padding: 0 5px 5px 5px;

      div.info {
        display: flex;
        flex-flow: column wrap;
        flex: 1 0 50%;
        height: 60px;
        padding: 5px;
        

        .info-content {
          display: flex;
          flex: 0 0 auto;
          flex-flow: row nowrap;
          border-radius: 8px;
          border: 1px solid $w230;
          height: 100%;
          align-items: center;
          align-content: center;
          color: $w120;
          font-size: 15px;

          strong {
            display: flex;
            justify-content: center;
            margin-right: 8px;
            font-size: 20px;
            color: $mainStyle;
            flex: 0 0 auto;
            width: 45px;
            border-right: 1px solid $w220;
          }
        }
      }
    }

    .moving-places {
      position: relative;
      display: flex;
      flex-flow: column nowrap;
      flex: 0 0 auto;
      margin: 10px;
      border-radius: 8px;
      overflow: hidden;
      background-color: $w250;
      box-shadow: 0 0 10px rgba(10,10,10,0.05);
      border: 1px solid $w230;

      .element {
        position: relative;
        display: flex;
        flex-flow: row nowrap;
        color: $g90;
        height: 42px;
        padding: 10px 0 10px 0;
        background-color:white;
        flex: 0 0 auto;
        font-size: 16px;
        font-weight: bold;

        &.arrivee {
          border-top: 1px solid $w230;
        }

        span {
          flex: 1 1 auto;
          margin-left: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .icon {
          display: flex;
          flex: 0 0 auto;
          justify-content: center;
          align-items: center;
          width: 40px;

          &::after {
            content:'';
            height: 8px;
            width: 8px;
            border-radius: 100%;
            background-color:$w180;
          }

          &.blue:after {
            background-color: $mainStyle;
          }
        }
      }

      .liaison {
        position: absolute;
        left: 18px;
        top: 18px;
        width: 4px;
        height: 45px;
        background: linear-gradient(to bottom, $w180, $mainStyle);
        z-index: 3;
      }
    }

    .description {
      position: relative;
      text-align: left;
      flex: 1 1 auto;
      text-align: justify;
      display: flex;
      overflow: hidden;
      font-size: 13px;
      padding: 0 15px 0 15px;
      margin-bottom: 12px;
      color: $w110;

      &:before {
        content: ' ';
        position: absolute;
        right: 15px;
        bottom: 0px;
        height: 1.5em;
        width: 30px;
        text-align: right;
        background: linear-gradient(to right, rgba(255, 255, 255, 0.342), #FFF);
      }
      &:after {
        content: '';
        position: absolute;
        right: 0;
        width: 10px;
        height: 10px;
        margin-top: 2px;
        background: white;
      }
    }
  }

  .footer {
    display: flex;
    height: 40px;
    flex: 0 0 auto;
    justify-content: center;
    align-items: center;
    color: $mainStyle;
    border-top: 1px solid $w230;
  }
}

</style>


