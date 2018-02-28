<template>
  <li class='moving-card'>
    <div class='header'>
      <div class='profil'>
        <div class='profil-bg' :style='profilePic'></div>
      </div>
      <div class='infos'>
        <div class='name'>Victor Garcia</div>
        <!-- <div class='inscrit'>Inscrit depuis 2 semaines</div>
        <div class='note'>
          <StarRating :editable='false' :size='23' :init='2.6'/>
        </div> -->
      </div>
    </div>
    <div class='content'>
      <div class='description'></div>
      <div class='moving-infos'>
        <div class='movers info'>
          <SvgIcon :src='require("@icons/moving/people.svg")' :size='22' :color='iconColor' />
          <span>2</span>
        </div>
        <div class='price info'>
          <SvgIcon :src='require("@icons/moving/euro.svg")' :size='22' :color='iconColor' />
          <span>10</span>
        </div>
        <div class='elevator info'>
          <SvgIcon :src='require("@icons/moving/elevator.svg")' :size='22' :color='iconColor' />
          <span><SvgIcon :src='require("@icons/moving/yes.svg")' :size='18' :color='css.green1' /></span>
        </div>
        <div class='parking info'>
          <SvgIcon :src='require("@icons/moving/parking.svg")' :size='22' :color='iconColor' />
          <span><SvgIcon :src='require("@icons/moving/no.svg")' :size='18' :color='css.red1' /></span>
        </div>
      </div>
      <div class='moving-places'>
        <div class='depart element'>
          <span>{{getDepart}}</span>
        </div>
        <div class='arrow'></div>
        <div class='arrivee element'>
          <span>{{getArrivee}}</span>
        </div>
      </div>
    </div>
    <div class='footer'>
      <div class='begin'></div>
    </div>
  </li>
  
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop} from 'vue-property-decorator';
import {IMovingEvent} from '@types';
import { StarRating, SvgIcon } from '@components';

@Component({
  components: {
    StarRating, SvgIcon
  }
})
export default class MovingCard extends Vue {

  @Prop({required: true}) moving: IMovingEvent;
  public css = require('@css');
  public note = 3;
  public iconColor = "#555";


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

  get profilePic() {
    return {backgroundImage: `url("${require('@images/user.jpg')}")`};
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
      flex: 1 1 auto;
      padding: 10px;

      .element {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        color: $g60;
        flex: 0 0 auto;
        font-size: 14px;

        span {
          padding: 3px 10px 3px 10px;
          border-radius: 3px;
          background-color: $mainStyle;
          color: white;
        }
      }

      .arrow {
        display: flex;
        flex: 1 1 auto;
      }
    }
  }

  .footer {
    display: flex;
    height: 30px;
    flex: 0 0 auto;
  }
}


</style>


