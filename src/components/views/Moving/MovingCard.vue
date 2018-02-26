<template>
  <li class='moving-card'>
    <div class='header'>
      <div class='profil'>
        <div class='profil-bg' :style='profilePic'></div>
      </div>
      <div class='infos'>
        <div class='name'>Victor Garcia</div>
        <div class='age'>23 ans</div>
        <div class='note'>
          <StarRating :size='23' v-model='note'/>
        </div>
      </div>
    </div>
    <div class='content'>
      <div class='description'></div>
      <div class='parcours-infos'>
        <div class='movers'></div>
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
    {{note}}
  </li>
  
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop} from 'vue-property-decorator';
import {IMovingEvent} from '@types';
import { StarRating } from '@components';

@Component({
  components: {
    StarRating
  }
})
export default class MovingCard extends Vue {

  @Prop({required: true}) moving: IMovingEvent;

  public note = 3;

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




</style>


