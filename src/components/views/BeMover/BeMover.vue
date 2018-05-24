<template lang='html'>
  <div class='BeMover'>
    <div class='sections'>
      <section class='bemover-form'>
        <h1>Devenir déménageur</h1>
        <div class='content'>
          <FormText v-model='becomeMoverForm.firstname' :vl='$v.becomeMoverForm.firstname' :data='becomeMoverForm.fieldsData.firstname' />
          <FormText v-model='becomeMoverForm.lastname' :vl='$v.becomeMoverForm.lastname' :data='becomeMoverForm.fieldsData.lastname' />
          <FormPlaceSearch v-model='becomeMoverForm.address' :vl='$v.becomeMoverForm.address' :data='becomeMoverForm.fieldsData.address' />
          <FormText v-model='becomeMoverForm.price' :vl='$v.becomeMoverForm.price' :data='becomeMoverForm.fieldsData.price' />
          <FormField v-model='becomeMoverForm.description' :vl='$v.becomeMoverForm.description' :data='becomeMoverForm.fieldsData.description' />
          <CheckBox v-model='becomeMoverForm.cgu' :vl='$v.becomeMoverForm.cgu' :data='becomeMoverForm.fieldsData.cgu'/>
          <div class='footer'>
            <FormButton 
              :submitting='submitting'
              :disabled='$v.becomeMoverForm.$invalid'
              @disabledClick='touchForm()'
              :colorTheme='css.mainStyle'>
                Devenir déménageur
            </FormButton>
          </div>
        </div>
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
  validations: {
    becomeMoverForm: {
      cgu: {isCguChecked(value) {return value}},
      firstname: {required},
      lastname: {required},
      address: {required},
      price:{required, numeric},
      description: {required}
    }
  }
})
export default class BeMover extends Vue {

  public $v;
  public css = require('@css');
  public submitting = false;

  public becomeMoverForm = new Forms.Form({
    cgu: new Forms.CheckBox({
      placeholder: `J'accepte les conditions générale d'utilisation du site`
    }),
    firstname: new Forms.TextForm({
      placeholder: 'Votre prénom'
    }),
    lastname: new Forms.TextForm({
      placeholder: 'Votre nom'
    }),
    address: new Forms.TextForm({
      placeholder: 'Votre adresse de départ'
    }),
    price: new Forms.TextForm({
      placeholder: 'Votre prix par heure',
    }),
    description: new Forms.TextForm({
      placeholder: 'Décrivez vous en quelques mots'
    })
  })

  touchForm() {
    console.log('lol')
    this.$v.becomeMoverForm.$touch();
  }


}
</script>


<style lang="scss" scoped>

.BeMover {
  display: flex;
  justify-content: center;
  align-items: center;
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
    box-shadow: 0 0 10px rgba(0,0,0,0.15);
    border-radius: 5px;
    background-color: white;

    section.bemover-form {
      display: flex;
      width: 650px;
      height: auto;
      flex-flow: column wrap;
      padding: 10px;
      padding-top: 0;

      h1 {
        text-align: center;
        padding: 10px;
      }

      .content {
        padding: 20px;
        display: flex;
        flex-flow: column wrap;

        .footer {
          display: flex;
          flex-flow: row wrao
        }
      }
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


