<template>
  <form @submit.prevent='submitForm()' novalidate>
    <UIModal :show='show' @close='modalClosed' :width='550' footerShadow>    
      <template slot='content'>
        <div class='content-root'>
          <div class='steps-display'>
            <UISteps :step='countStep' @click='updateStep'/>
          </div>
          <ul class='create-views-list'>
           <transition name='slide'>
              <li v-if='countStep === 0' class='create-view'>
                <FormMessage>
                  <template slot='title'>Pourquoi vérifier mes informations ?</template>
                  Indiquer une adresse email et un numéro de téléphone permet de recevoir les coordonnées de mes déménageurs une fois la réservation effectuée.
                </FormMessage>
                <FormText v-model="CreateMovingForm[0].email" :vl='$v.CreateMovingForm[0].email' :data='CreateMovingForm[0].fieldsData.email'/>
                <FormText v-model="CreateMovingForm[0].phone" :vl='$v.CreateMovingForm[0].phone' :data='CreateMovingForm[0].fieldsData.phone'/>
              </li>
              <li v-if='countStep === 1' class='create-view'>
                <FormText v-model="CreateMovingForm[0].email" :vl='$v.CreateMovingForm[0].email' :data='CreateMovingForm[0].fieldsData.email'/>
                <!-- <FormText v-model="CreateMovingForm[0].phone" :vl='$v.CreateMovingForm[0].phone' :data='CreateMovingForm[0].fieldsData.phone'/> -->
              </li>
              <li v-if='countStep === 2' class='create-view'>
                <!-- <FormText v-model="CreateMovingForm[0].email" :vl='$v.CreateMovingForm[0].email' :data='CreateMovingForm[0].fieldsData.email'/> -->
                <FormText v-model="CreateMovingForm[0].phone" :vl='$v.CreateMovingForm[0].phone' :data='CreateMovingForm[0].fieldsData.phone'/>
              </li>
           </transition>
          </ul>
        </div>
      </template>

      <template slot='footer'>
        <FormButton @click='modalClosed()'>
          Annuler
        </FormButton>
        <FormButton v-if='countStep > 0' @click='crementCount(-1)'>
          étape précédente
        </FormButton>
        <!-- :disabled='$v.CreateMovingForm[countStep].$invalid' -->
        <FormButton theme='blue' @click='crementCount(1)'>
          Étape suivante
        </FormButton>
      </template>
    </UIModal>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { UIModal, FormButton, FormText, UISteps, FormMessage } from "@components";
import { timeout } from '@methods';
import { required, email, } from 'vuelidate/lib/validators';
import Router, {routesNames} from '@router';
import { GlobalStore, LoginStore } from '@store';
import { Forms } from '@classes';


@Component({
  components: {
    UIModal, FormButton, FormText, UISteps, FormMessage
  },
  validations: {
    CreateMovingForm: {
      "0": {
        email: {email, required},
        phone: {required, phone(value) {
          if (required(value)) {
            const regex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
            return regex.test(value);
          }
          return true;
        }}
      }
    }
  }
})
export default class CreateMoving extends Vue {

  public show = true;
  public countStep = 0;


  public CreateMovingForm = {
    "0": new Forms.Form({
      email: new Forms.TextForm({
        value: 'victor@gmail.com',
        type: 'email',
        placeholder: 'Votre adresse email'
      }),
      phone: new Forms.TextForm({
        value: '0637096255',
        type: 'tel',
        placeholder: 'Votre numéro de téléphone'
      })
    })
  }



  updateStep(index: number) {
    this.countStep = index;
  }

  crementCount(value: number) {
    if (this.countStep + value < 3 && this.countStep + value >= 0) {
      console.log(this.countStep + value)
      this.countStep += value;
    }
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

.slide-leave-active, .slide-enter-active {
  transition: transform 0.5s;
}
.slide-enter {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateY(-100%);
}


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
    position: relative;
    flex-flow: row wrap;
    justify-content: center;
    padding: 10px 30px 10px 30px;

    li.create-view {
      display: flex;
      position: relative;
      width: 100%;
      flex-flow: column wrap;
      justify-content: center;
      align-items: center;
    }
  }
}

 
</style>

