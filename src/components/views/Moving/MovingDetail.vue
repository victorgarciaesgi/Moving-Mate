<template>
  <div class='MovingDetail' v-if='movingEvent'>
    <div class='sections'>
      <section class='moving-infos'>
        <div class='header'>
          <h1 class='title'>{{movingEvent.label}}</h1>
          <div class='state'>
            <span>Annonce normale</span>
          </div>
        </div>
        <div class='content'>
          <div class='date'>
            <div class='section-title'>Date et heure du déménagement</div>
            <span class='section-content'>{{formatedDate}}</span>
          </div>
        </div>
        <div class='footer'></div>
      </section>
      <section class='moving-actions'>

      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { timeout } from '@methods';
import { MovingStore } from '@store';
import moment from 'moment';
import 'moment/locale/fr';

@Component({
  components: {},
})
export default class MovingDetail extends Vue {

  public show = true;
  public previousRouteName
  @Prop({required: true}) movingId: string;

  public formatedDate = null;
  public dateFrom = null;

  get movingEvent() {return MovingStore.state.oneAnnouncement}

  mounted() {
    this.formatedDate = moment.unix(this.movingEvent.dealDate).format('dddd Do MMMM YYYY, hh:mm');
  }

}
</script>



<style lang='scss' scoped>

.MovingDetail {
  display: flex;
  position: relative;
  width: 100%;
  min-height: 100%;
  height: auto;
  justify-content: center;
  align-content: center;
  align-items: center;
  background-color: white;

  .sections {
    display: flex;
    flex-flow: row wrap;
    padding: 20px;

    .section-title {
      color: $g90;
      font-weight: bold;
      font-size: 18px;
      margin-top: 10px;
    }

    .section-content {
      display: flex;
      margin-top: 15px;
      font-size: 15px;
    }

    section.moving-infos {
      display: flex;
      width: 600px;
      height: auto;
      flex-flow: column wrap;
      min-height: 1300px;

      .header {
        display: flex;
        flex-flow: column nowrap;

        h1.title {
          font-size: 25px;
          margin-bottom: 5px;
        }

        .state {
          span {
            border-radius: 40px;
            padding: 2px 10px 2px 10px;
            background-color: $w120;
            color: white;
            font-size: 12px;
          }
        }
      }
    }

    section.moving-actions {
      display: flex;
      position: sticky;
      top: calc(#{$headerHeight} + 20px);
      width: 300px;
      height: 500px;
      margin-left: 20px;
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
  }
}
 
</style>

