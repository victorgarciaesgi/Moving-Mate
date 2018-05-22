<template lang='html'>
  <div class='BeMover'>
    <div class='sections'>
      <section class='bemover-form'>
        <h1>Devenir déménageur</h1>
        <CheckBox v-model='becomeMoverForm.cgu' :data='becomeMoverForm.fieldsData.cgu'/>
      </section>
      <!-- <section class='bemover-previsu'></section> -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { UIModal, FormButton, FormText, UISteps, FormPlaceSearch,
  FormMessage, Radio, FormSelect, FormSeparator,FormField, CheckBox, FormCalendar } from "@components";
import { timeout } from '@methods';
import { required, email, numeric, maxLength } from 'vuelidate/lib/validators';
import Router, {routesNames} from '@router';
import { GlobalStore, LoginStore, MovingStore } from '@store';
import { Forms, AlertsElement, ActionsElements } from '@classes';

@Component({
  components: {
    FormButton, FormText, UISteps, FormField, FormPlaceSearch,
    FormMessage, Radio, FormSelect, FormSeparator, CheckBox, FormCalendar
  },
})
export default class BeMover extends Vue {



  public becomeMoverForm = new Forms.Form({
    cgu: new Forms.CheckBox({
      placeholder: `J'accepte les conditions générale d'utilisation du site`
    })
  })


}
</script>


<style lang="scss" scoped>

.BeMover {
  display: flex;
  justify-content: center;
  width: 100%;
  .sections {
    display: flex;
    position: relative;
    flex-flow: row wrap;
    padding: 20px;
    padding-top: 30px;
    justify-content: center;
    align-items: flex-start;
    align-content: flex-start;

    section.bemover-form {
      display: flex;
      width: 650px;
      height: auto;
      flex-flow: column wrap;
      padding: 10px;
      padding-top: 0;
    }

    section.bemover-previsu {
      display: flex;
      flex-flow: column wrap;
      position: sticky;
      top: calc(#{$headerHeight} + 80px);
    }
  }
}


</style>


