<template>
  <div class='MovingInvite'>
    
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop} from 'vue-property-decorator';
import { StarRating, SvgIcon, UISwitch, FormMessage } from '@components';
import moment from 'moment';
import Movers from '@views/Movers/Movers.vue';

@Component({
  components: {
    FormMessage, SvgIcon, Movers
  },
})
export default class MovingDetail extends Vue {
  

}
</script>



<style lang='scss' scoped>

 
</style>

