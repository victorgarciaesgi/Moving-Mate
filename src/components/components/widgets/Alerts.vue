<template>
  <transition name='hide'>
    <ul id="alertes-container" v-show='notificationList.length'>
      <transition-group name='alert'>
        <li v-for='alert in notificationList' :key='alert.id' :type='alert.type'>
          <span>{{alert.message}}</span>
          <img src="~@icons/form-valid.svg" v-if='alert.type == "success"'>
          <img src="~@icons/form-invalid.svg" v-else-if='alert.type == "error"'>
          <img src="~@icons/warning.svg" v-else-if='alert.type == "warning"'>
          <img src="~@icons/infos.svg" v-else-if='alert.type == "alert"'>
        </li>
      </transition-group>
    </ul>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import {State, namespace } from "vuex-class";


const NotifState = namespace('NotificationsModule', State);


@Component({
  name: 'Alerts',
})
export default class Alerts extends Vue {

  @NotifState notificationList;
  @NotifState notificationCount;

  updateValue(value){
    this.$emit('input', value);
  }
}
</script>



<style lang='scss' scoped>

ul#alertes-container{
  position: fixed;
  top: calc(#{$headerHeight} + 10px);
  left: 0;
  padding: 10px;
  width: 350px;
  height: auto;
  z-index: 10005;
  display: flex;
  flex-direction: column;

  li{
    position: relative;
    height: auto;
    width: 100%;
    margin-top: 5px;
    padding: 15px 10px 15px 50px;
    box-shadow: 0 0 10px rgba(20,20,20,0.2);
    font-size: 14px;
    color: $g90;
    text-align: center;
    align-content: center;
    font-weight: bold;
    border-radius: 3px;
    background-color: white;
    line-height: 17px;

    img{
      position: absolute;
      top: 50%;
      @include translateY(-50%);
      left: 10px;
    }
  }
}

.hide-leave-active{
  transition: all 0.6s;
}

.alert-enter-active, .alert-leave-active {
  transition: all 0.5s;
}
.alert-enter, .alert-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-30px);
}

</style>

