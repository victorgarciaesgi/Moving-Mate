<template>
  <div v-if='false'></div>
  <div v-else class='no-result flexy'>
    <SvgIcon :src='require("@icons/divers/face_bad.svg")' 
      :size='50' color='#5a5a5a'/>
    Aucune demande
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
export default class MovingDemandes extends Vue {
  

}
</script>



<style lang='scss' scoped>
 
</style>

