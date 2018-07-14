<template>
  <div class="moving-list-root">
    <template v-if='participations.length'>
      <ul  class='moving-list' >
      <MovingCard v-for='moving in participations'
                  :key='moving.uuid'
                  :moving='moving'
                  user>
      </MovingCard>
    </ul>
    </template>
    <div v-else class='no-result flexy'>
      <SvgIcon :src='require("@icons/divers/face_bad.svg")' 
        :size='50' color='#5a5a5a'/>
      Aucune participation
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import {UserStore} from '@store';
import {SvgIcon} from '@components';

import MovingCard from '../Moving/MovingCard.vue';

@Component({
  components:{MovingCard, SvgIcon}
})
export default class UserParticipations extends Vue {
  

  get participations() {
    let parts = UserStore.state.oneUser.participations;
    return parts;
  }
}
</script>


<style lang="scss" scoped>

.moving-list-root {
  display: flex;
  position: relative;
  flex-flow: column wrap;
  min-height: 100%;
  height: auto;
  width: 800px;

  div.list-filter-container {
    display: flex;
    flex: 0 0 auto;
    height: 50px;
  }


  ul.moving-list {
    display: flex;
    position: relative;
    flex-flow: row wrap;
    justify-content: center;
    align-items: flex-start;
    align-content: flex-start;
    width: 100%;
    flex: 1 1 auto;
    padding: 10px;
    
  }

  .no-result {
    font-weight: bold;
  }

  .loader {
    display: flex;
    flex: 1 1 auto;
    justify-content: center;
    align-items: center;

    img {
      width: 50px;
      height: 50px;
    }
  }
}

</style>


