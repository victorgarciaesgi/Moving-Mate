<template>
  <form @submit.prevent='submitForm()' novalidate>
    <UIModal :show='show' @close='modalClosed' :width='600' footerShadow>    
      <template slot='content'>
        <div class='content-root'>
          <div class='steps-display'>
            <UISteps :step='countStep' @click='updateStep'/>
          </div>
          <ul class='create-views-list'>
            <li v-if='countStep === 0' class='create-view'>
              
            </li>
            <li v-else-if='countStep === 1' class='create-view'>

            </li>
            <li v-else-if='countStep === 2' class='create-view'>

            </li>
            
          </ul>
        </div>
      </template>

      <template slot='footer'>
        <FormButton @click='modalClosed()'>
          Annuler
        </FormButton>
        <FormButton theme='blue' >
          Étape suivante
        </FormButton>
      </template>
    </UIModal>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { UIModal, FormButton, FormText, UISteps } from "@components";
import { timeout } from '@methods';
import { required, email } from 'vuelidate/lib/validators';
import Router, {routesNames} from '@router';
import { GlobalStore, LoginStore } from '@store';
@Component({
  components: {
    UIModal, FormButton, FormText, UISteps
  },
})
export default class CreateMoving extends Vue {

  public show = true;
  public countStep = 0;

  updateStep(index: number) {
    this.countStep = index;
  }

  modalClosed(empty: boolean) {
    this.show = false;
    if (GlobalStore.state.previousModalRoute) {
      Router.push(GlobalStore.state.previousModalRoute)
    } else {
      Router.push(GlobalStore.state.previousModalRoute || {name: routesNames.moving});
    }
    GlobalStore.mutations.setPreviousModalRoute(null);
  }

}
</script>



<style lang='scss' scoped>


.content-root {
  display: flex;
  position: relative;
  flex: 1 1 auto;
  flex-flow: column wrap;
  width: 100%;

  .steps-display {

  }

  ul.create-views-list {
    display: flex;
  }
}

 
</style>

