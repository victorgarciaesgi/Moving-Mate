<template>
  <form @submit.prevent='submitForm()' novalidate>
    <UIModal :show='show' @close='modalClosed' :width='550' footerShadow>    
      <template slot='content'>
        <div class='content-root'>
          <div class='steps-display'>
            <UISteps :step='countStep' @click='updateStep'/>
          </div>
          <ul class='create-views-list'>
            <li v-if='countStep == 0' class='create-view' key='userInfos'>
              <FormMessage>
                <template slot='title'>Pourquoi vérifier mes informations ?</template>
                Indiquer une adresse email et un numéro de téléphone permet de recevoir les coordonnées de mes déménageurs une fois la réservation effectuée.
              </FormMessage>
              <FormText v-model="CreateMovingForm[0].email" :vl='$v.CreateMovingForm[0].email' :data='CreateMovingForm[0].fieldsData.email'/>
              <FormText v-model="CreateMovingForm[0].phone" :vl='$v.CreateMovingForm[0].phone' :data='CreateMovingForm[0].fieldsData.phone'/>
            </li>
            <li v-if='countStep == 1' class='create-view' key='movingInfos'>
              <Radio v-model='CreateMovingForm[1].type' :data='CreateMovingForm[1].fieldsData.type' />
              <FormText v-if='typeDepart || typeBoth' v-model="CreateMovingForm[1].addressIn"  key='depart'
                :vl='$v.CreateMovingForm[1].addressIn' :data='CreateMovingForm[1].fieldsData.addressIn'/>
              <FormText v-if='typeArrivee || typeBoth' v-model="CreateMovingForm[1].addressOut"  key='arrivee'
                :vl='$v.CreateMovingForm[1].addressOut' :data='CreateMovingForm[1].fieldsData.addressOut'/>
              <FormText v-model="CreateMovingForm[1].dealDate" :vl='$v.CreateMovingForm[1].dealDate' :data='CreateMovingForm[1].fieldsData.dealDate'/>

              <div class='form-split two'>
                <FormSelect v-model="CreateMovingForm[1].estimatedTime" :vl='$v.CreateMovingForm[1].estimatedTime' :data='CreateMovingForm[1].fieldsData.estimatedTime'/>
                <FormSelect v-model="CreateMovingForm[1].menRequired" :vl='$v.CreateMovingForm[1].menRequired' :data='CreateMovingForm[1].fieldsData.menRequired'/>
              </div>
            </li>
            <li v-if='countStep == 2' class='create-view' key='confirm'>
              <span>lol</span>
            </li>
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
        <FormButton theme='blue' 
        :disabled='$v.CreateMovingForm[countStep].$invalid' 
        @click='crementCount(1)'
        @disabledClick='touchForm()'>
          Étape suivante
        </FormButton>
      </template>
    </UIModal>²
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { UIModal, FormButton, FormText, UISteps, FormMessage, Radio, FormSelect } from "@components";
import { timeout } from '@methods';
import { required, email, numeric } from 'vuelidate/lib/validators';
import {} from ''
import Router, {routesNames} from '@router';
import { GlobalStore, LoginStore } from '@store';
import { Forms } from '@classes';


@Component({
  components: {
    UIModal, FormButton, FormText, UISteps, FormMessage, Radio, FormSelect
  },
  validations() {
    const _this = this;
    return {
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
        },
        get "1"() {
          let baseValidations: any = {
            type: {required},
            addressIn: {required},
            addressOut: {required},
            dealDate: {required},
            estimatedTime: {required},
            menRequired: {required, numeric}
          }
          if (_this.currentFormType == 0) {
            const {addressOut, ...rest} = baseValidations;
            baseValidations = rest;
          } else if (_this.currentFormType == 1) {
            const {addressIn, ...rest} = baseValidations;
            baseValidations = rest;
          }
          return baseValidations;
        },
        "2": false
      }
    }
  }
})
export default class CreateMoving extends Vue {

  public show = true;
  public countStep = 1;
  public $v;


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
    }),
    "1": new Forms.Form({
      type: new Forms.Radio({
        placeholder: `J'ai besoin d'aide:`,
        value: 0,
        options: [
          {value: 0, text: 'Au départ'},
          {value: 1, text: `A l'arrivée`},
          {value: 2, text: 'Les deux'}
        ]
      }),
      addressIn: new Forms.TextForm({
        icon: require('@icons/moving/arrow_up.svg'),
        placeholder: 'Votre adresse de départ'
      }),
      addressOut: new Forms.TextForm({
        icon: require('@icons/moving/arrow_down.svg'),
        placeholder: `Votre adresse d'arrivée`
      }),
      dealDate: new Forms.TextForm({
        icon: require('@icons/date.svg'),
        placeholder: 'Date et heure de votre déménagement',
      }),
      estimatedTime: new Forms.Select({
        placeholder: 'Durée du déménagement',
        options: Array.from(Array(10)).map((val, index) => {
          return {value: index + 1, text: index + 1 + 'h'}
        })
      }),
      menRequired: new Forms.Select({
        placeholder: 'Nombre de persones requises',
        options: Array.from(Array(15)).map((val, index) => {
          return {value: index + 1, text: index + 1 + ' personnes'}
        })
      }),
    })
  }

  get currentFormType() {return this.CreateMovingForm[1]['type'];}
  get typeDepart() {return this.CreateMovingForm[1]['type'] == 0;}
  get typeArrivee() {return this.CreateMovingForm[1]['type'] == 1;}
  get typeBoth() {return this.CreateMovingForm[1]['type'] == 2;}

  touchForm() {
    this.$v.CreateMovingForm[this.countStep].$touch();
  }

  updateStep(index: number) {
    this.countStep = index;
  }

  crementCount(value: number) {
    if (this.countStep + value < 3 && this.countStep + value >= 0) {
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
    flex-flow: row nowrap;
    overflow: auto;
    padding: 10px 30px 10px 30px;

    li.create-view {
      display: flex;
      position: relative;
      width: 100%;
      flex: 0 0 auto;
      flex-flow: column wrap;
      justify-content: center;
      align-items: center;
    }
  }
}

 
</style>

