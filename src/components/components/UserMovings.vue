<template>
  <div class='Movings'>
    <div class='section' v-if="announcements">
      <div class='title'>Annonces créees</div>
      <div class='list'>
        <MovingCard v-for="moving of announcements" :key='moving.uuid' :moving='moving' embed popup/>
      </div>
    </div>
    <div class='section' v-if='participations'>
      <div class='title'>Participations validées</div>
      <div class='list'>
        <MovingCard v-for="moving of participations" :key='moving.uuid' :moving='moving' embed popup/>
      </div>
    </div>
  </div>
</template>



<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { merge } from 'lodash'

import { EventBus, LoginStore } from '@store';
import { calculatePopupRelativePosition } from '@methods';
import { Prop } from "vue-property-decorator";
import { relative, isAbsolute } from "path";
import MovingCard from '@views/Moving/MovingCard.vue';

@Component({
  components: {MovingCard}
})
export default class UserMovings extends Vue {

  get myMovings() {
    return LoginStore.state.myMovings;
  }

  get announcements() {
    return this.myMovings.Announcements;
  }
  get participations() {
    return this.myMovings.Participations;
  }

}
</script>



<style lang='scss' scoped>

.Movings {
  display: flex;
  flex-flow: column nowrap;
  overflow-y: auto;
  border-radius: 5px;
  position: relative;

  .section {
    display: flex;
    flex-flow: column nowrap;
    height: auto;
    flex: 0 0 auto;
    overflow: hidden;
    
    .title {
      height: 35px;
      line-height: 35px;
      background-color: white;
      font-size: 14px;
      font-weight: bold;
      padding-left: 10px;
      flex: 0 0 auto;
      background-color: white;
      color: $mainStyle;
    }

    .list {
      display: flex;
      flex-flow: column nowrap;
      padding: 10px 10px 0 10px;
      background-color: $w230;
      flex: 1 1 auto;
    }
  }
}


</style>

