<template>
  <div class='MovingInvite'>
    <Movers invite :Store='Store'/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop} from 'vue-property-decorator';
import { StarRating, SvgIcon, UISwitch, FormMessage } from '@components';
import moment from 'moment';
import {InviteMoverStore} from '@store';
import Movers from '@views/Movers/Movers.vue';

@Component({
  components: {
    FormMessage, SvgIcon, Movers
  },
})
export default class MovingDetail extends Vue {
  
  get Store() {return InviteMoverStore}
}
</script>



<style lang='scss' scoped>

.MovingInvite {
  display: flex;
  width: 100%;
}
 
</style>

