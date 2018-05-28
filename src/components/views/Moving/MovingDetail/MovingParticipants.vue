<template>
<h1>Participants</h1>
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
export default class MovingParticipants extends Vue {
  

}
</script>



<style lang='scss' scoped>

 
</style>

