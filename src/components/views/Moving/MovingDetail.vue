<template>
  <UIModal :show='show' @close='modalClosed' :width='600' onlyContent >    
    <div>
      Content
    </div>
  </UIModal>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import { UIModal } from "@components";
import { timeout } from '@methods';
import { required, email } from 'vuelidate/lib/validators';
import Router, {routesNames} from '@router';

@Component({
  components: {
    UIModal
  },
})
export default class MovingDetail extends Vue {

  public show = true;
  @Prop({required: true}) movingId: number;



  modalClosed(empty: boolean) {
    this.show = false;
    Router.push({name: routesNames.moving});
  }
}
</script>



<style lang='scss' scoped>


 
</style>

