<template>
  <li class='moving-card'>
    <div class='header'>
      <div class='profil'>
        <div class='profil-bg' :style='profilePic'></div>
      </div>
      <div class='infos'>
        <div class='name item'>{{chance.name()}}</div>
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
      <div class='moving-infos'>
        <div class='movers info'>
          <SvgIcon :src='require("@icons/moving/people.svg")' :size='22' :color='iconColor' />
          <span>2</span>
        </div>
        <div class='price info'>
          <SvgIcon :src='require("@icons/moving/euro.svg")' :size='22' :color='iconColor' />
          <span>10/pers</span>
        </div>
        <div class='elevator info'>
          <SvgIcon :src='require("@icons/moving/elevator.svg")' :size='19' :color='iconColor' />
          <span><SvgIcon :src='require("@icons/moving/yes.svg")' :size='22' :color='css.green1' /></span>
        </div>
        <div class='parking info'>
          <SvgIcon :src='require("@icons/moving/parking.svg")' :size='22' :color='iconColor' />
          <span><SvgIcon :src='require("@icons/moving/no.svg")' :size='22' :color='css.red1' /></span>
        </div>
      </div>
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
      <div class='description'>
        <p>
          {{getDescription}}
        </p>
      </div>

    </div>
  </li>
  
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop} from 'vue-property-decorator';
import {IMovingEvent} from '@types';
import { StarRating, SvgIcon } from '@components';
import * as Chance from 'chance';
import axios from 'axios';

@Component({
  components: {
    StarRating, SvgIcon
  }
})
export default class MovingCard extends Vue {

  @Prop({required: true}) moving: IMovingEvent;
  public css = require('@css');
  public note = 3;
  public iconColor = "#888";
  public profilePic = {backgroundImage: `url("${require('@images/user.jpg')}")`};


  get getDescription() {
    return this.chance.paragraph()
  }
  
  get chance() {
    return new Chance();
  }

  get getDepart() {
    let [number,road,town,code] = this.moving.addressIn.split('|');
    return town;
  }

  get getBegin() {
    return {hour: '15:00', number: '27', mounth:'Avril'};
  }

  get getArrivee() {
    let [number,road,town,code] = this.moving.addressOut.split('|');
    return town;
  }

  get formatedAddress() {
    return address => {
      return address.replace(/|/gi, ' ');
    }
  }

  async mounted () {
    let {data} = await axios.get('https://randomuser.me/api/?inc=picture');
    this.profilePic = {backgroundImage: `url("${data.results[0].picture.medium}")`};
  }
}
</script>


<style lang="scss" scoped>

.moving-card {
  display: flex;
  position: relative;
  flex-flow: column nowrap;
  width: 350px;
  height: 410px;
  border-radius: 5px;
  border: 1px solid $w240;
  box-shadow: 0 0 10px rgba(10,10,10,0.1);
  background-color: white;
  overflow: hidden;
  margin: 10px;

  .header {
    display: flex;
    position: relative;
    flex-flow: row nowrap;
    flex: 0 0 auto;
    height: 80px;
    border-bottom: 1px solid $w230;

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
        border: 2px solid $mainStyle;
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
              background-color: $red1;
              color: white;
              font-weight: bold;
            }

            .mounth {
              color: $g90;
              border: 1px solid $w220;
              border-left: none;
              border-radius: 0 4px 4px 0;
            }

            .hour {
              color: $g90;
              border: 1px solid $w220;
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
    flex-flow: column nowrap;
    flex: 1 1 auto;

    .moving-infos {
      display: flex;
      flex-flow: row nowrap;
      flex: 0 0 auto;
      // border-bottom: 1px solid $w230;

      div.info {
        display: flex;
        flex-flow: column nowrap;
        flex: 1 1 auto;
        justify-content: center;
        padding: 10px 5px 5px 5px;
        align-items: center;
        align-content: center;
        text-align: center;

        span {
          margin-top: 2px;
          font-size: 15px;
          font-weight: bold;
        }
      }
    }

    .moving-places {
      position: relative;
      display: flex;
      flex-flow: column nowrap;
      flex: 0 0 auto;
      margin: 10px;
      border-radius: 5px;
      overflow: hidden;
      background-color: $w250;
      box-shadow: 0 0 10px rgba(10,10,10,0.05);
      border: 1px solid $w230;

      .element {
        position: relative;
        display: flex;
        flex-flow: row nowrap;
        color: $g90;
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


