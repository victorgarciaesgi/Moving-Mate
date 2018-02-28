<template>
  <li class='moving-card'>
    <div class='header'>
      <div class='profil'>
        <div class='profil-bg' :style='profilePic'></div>
      </div>
      <div class='infos'>
        <div class='name'>{{chance.name()}}</div>
        <!-- <div class='inscrit'>Inscrit depuis 2 semaines</div>
        <div class='note'>
          <StarRating :editable='false' :size='23' :init='2.6'/>
        </div> -->
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
          <SvgIcon :src='require("@icons/moving/elevator.svg")' :size='20' :color='iconColor' />
          <span><SvgIcon :src='require("@icons/moving/yes.svg")' :size='20' :color='css.green1' /></span>
        </div>
        <div class='parking info'>
          <SvgIcon :src='require("@icons/moving/parking.svg")' :size='22' :color='iconColor' />
          <span><SvgIcon :src='require("@icons/moving/no.svg")' :size='20' :color='css.red1' /></span>
        </div>
      </div>
      <div class='moving-places'>
        <div class='depart element'>
          <div class='icon black'></div>
          <span>{{getDepart}}</span>
        </div>
        <!-- <div class='arrow'>→</div> -->
        <div class='arrivee element'>
          <div class='icon blue'></div>
          <span>{{getArrivee}}</span>
        </div>
      </div>
      <div class='description'>
        {{getDescription}}
      </div>

    </div>
    <div class='footer'>
      <div class='begin'>Mercredi 7 mars 2018</div>
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
    return this.chance.paragraph().slice(0,100) + '...';
  }
  
  get chance() {
    return new Chance();
  }

  get getDepart() {
    let [number,road,town,code] = this.moving.addressIn.split('|');
    return town;
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
    console.log(data);
    this.profilePic = {backgroundImage: `url("${data.results[0].picture.medium}")`};
  }

}
</script>


<style lang="scss" scoped>

.moving-card {
  display: flex;
  position: relative;
  flex-flow: column nowrap;
  width: 270px;
  height: 320px;
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
      div {
        display: flex;
        justify-content: flex-start;
        flex: 1 1 auto;
        width: 100%;

        &.name {
          font-weight: bold;
          align-items: center;
          justify-content: flex-start;
        }

        &.inscrit {
          font-size: 13px;
          align-items: center;
          color: lighten($mainColor, 30%);
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
      border-bottom: 1px solid $w230;

      div.info {
        display: flex;
        flex-flow: column nowrap;
        flex: 1 1 auto;
        justify-content: center;
        padding: 5px;
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
      display: flex;
      flex-flow: column nowrap;
      flex: 0 0 auto;
      margin: 10px;
      border-radius: 5px;
      overflow: hidden;
      background-color:$w250;
      box-shadow: 0 0 10px rgba(10,10,10,0.05);
      border: 1px solid $w230;

      .element {
        display: flex;
        flex-flow: row nowrap;
        color: $g90;
        padding: 5px 0 5px 0;
        background-color:white;
        flex: 0 0 auto;
        font-size: 14px;
        font-weight: bold;

        &:last-child {
          border-top: 1px solid $w230;
        }

        span {
          flex: 1 1 auto;
          text-align: center;
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
            background-color:$w130;
          }

          &.blue:after {
            background-color: $mainStyle;
          }
        }
      }

      .arrow {
        display: flex;
        flex: 1 1 auto;
        color: $mainStyle
      }
    }

    .description {
      flex: 1 1 auto;
      display:flex;
      overflow: hidden;
      font-size: 13px;
      margin: 0 10px 10px 10px;
      color: $g90;
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


