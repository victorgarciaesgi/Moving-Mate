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
      <div class='parcours-infos'>
        <div class='movers'>
          <SvgIcon :src='require("@icons/moving/muscle.svg")' />
        </div>
        <div class='price'></div>
        <div class='elevator'></div>
        <div class='parking'></div>
      </div>
      <div class='parcours'>
        <div class='depart'></div>
        <!-- arrow -->
        <div class='arrivee'></div>
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
  public iconColor = this.css.mainColor;tr

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
}


</style>


