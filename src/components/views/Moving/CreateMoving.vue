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
              <Radio v-model='CreateMovingForm[1].type' :vl='$v.CreateMovingForm[1].type' :data='CreateMovingForm[1].fieldsData.type' />

              <template v-if='typeDepart || typeBoth'>
                <FormSeparator>Informations du départ</FormSeparator>
                <FormPlaceSearch v-model="CreateMovingForm[1].addressIn.address"  key='depart'
                  :vl='$v.CreateMovingForm[1].addressIn.address' :data='CreateMovingForm[1].fieldsData.addressIn.address'/>
                <FormText v-model="CreateMovingForm[1].addressIn.volume"
                  :vl='$v.CreateMovingForm[1].addressIn.volume' :data='CreateMovingForm[1].fieldsData.addressIn.volume'/>
                <Radio row v-model='CreateMovingForm[1].addressIn.type' :vl='$v.CreateMovingForm[1].addressIn.type' :data='CreateMovingForm[1].fieldsData.addressIn.type' />
                <div class='form-split two' v-if='!addressInMaison'>
                  <FormSelect v-model="CreateMovingForm[1].addressIn.floor" :vl='$v.CreateMovingForm[1].addressIn.floor' :data='CreateMovingForm[1].fieldsData.addressIn.floor'/>
                  <Radio row v-model="CreateMovingForm[1].addressIn.elevator" :vl='$v.CreateMovingForm[1].addressIn.elevator' :data='CreateMovingForm[1].fieldsData.addressIn.elevator'/>
                </div>
              </template>

              <template v-if='typeArrivee || typeBoth'>
                <FormSeparator>Informations de l'arrivée</FormSeparator>
                <FormText v-model="CreateMovingForm[1].addressOut.address"  key='arrivee'
                  :vl='$v.CreateMovingForm[1].addressOut.address' :data='CreateMovingForm[1].fieldsData.addressOut.address'/>
                <FormText v-model="CreateMovingForm[1].addressOut.volume"
                  :vl='$v.CreateMovingForm[1].addressOut.volume' :data='CreateMovingForm[1].fieldsData.addressOut.volume'/>
                <Radio row v-model='CreateMovingForm[1].addressOut.type' :vl='$v.CreateMovingForm[1].addressOut.type' :data='CreateMovingForm[1].fieldsData.addressOut.type' />
                <div class='form-split two' v-if='!addressOutMaison'>
                  <FormSelect v-model="CreateMovingForm[1].addressOut.floor" :vl='$v.CreateMovingForm[1].addressOut.floor' :data='CreateMovingForm[1].fieldsData.addressOut.floor'/>
                  <Radio row v-model="CreateMovingForm[1].addressOut.elevator" :vl='$v.CreateMovingForm[1].addressOut.elevator' :data='CreateMovingForm[1].fieldsData.addressOut.elevator'/>
                </div>
              </template>
            </li>
            <li v-if='countStep == 2' class='create-view' key='confirm'>
              <FormSeparator>Autres informations</FormSeparator>
              <FormCalendar v-model="CreateMovingForm[2].dealDate" :vl='$v.CreateMovingForm[2].dealDate' :data='CreateMovingForm[2].fieldsData.dealDate'/>

              <div class='form-split two'>
                <FormSelect v-model="CreateMovingForm[2].estimatedTime" :vl='$v.CreateMovingForm[2].estimatedTime' :data='CreateMovingForm[2].fieldsData.estimatedTime'/>
                <FormSelect v-model="CreateMovingForm[2].menRequired" :vl='$v.CreateMovingForm[2].menRequired' :data='CreateMovingForm[2].fieldsData.menRequired'/>
              </div>
              <FormField v-model="CreateMovingForm[2].description" :vl='$v.CreateMovingForm[2].description' :data='CreateMovingForm[2].fieldsData.description'/>
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
          :submitting='false'
          :disabled='$v.CreateMovingForm[countStep].$invalid' 
          @click='crementCount(1)'
          @disabledClick='touchForm()'>
            {{getButtonTitle}}
        </FormButton>
      </template>
    </UIModal>²
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { UIModal, FormButton, FormText, UISteps, FormPlaceSearch,
  FormMessage, Radio, FormSelect, FormSeparator,FormField, CheckBox, FormCalendar } from "@components";
import { timeout } from '@methods';
import { required, email, numeric, maxLength } from 'vuelidate/lib/validators';
import {} from ''
import Router, {routesNames} from '@router';
import { GlobalStore, LoginStore } from '@store';
import { Forms } from '@classes';


@Component({
  components: {
    UIModal, FormButton, FormText, UISteps, FormField, FormPlaceSearch,
    FormMessage, Radio, FormSelect, FormSeparator, CheckBox, FormCalendar
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
            addressIn: {
              address: {required},
              type: {required},
              floor: {required, numeric},
              elevator: {required},
              volume: {required, numeric}
            },
            addressOut: {
              address: {required},
              type: {required},
              floor: {required, numeric},
              elevator: {required},
              volume: {required, numeric}
            },
          }
          if (_this.currentFormType == 0) {
            const {addressOut, addressIn, ...rest} = baseValidations;
            if (_this.addressInMaison) {
              const {floor,elevator, ...rest2} = addressIn;
              baseValidations = {...rest, addressIn: rest2};
            } else {
              baseValidations = {...rest, addressIn}
            }
          } else if (_this.currentFormType == 1) {
            const {addressOut, addressIn, ...rest} = baseValidations;
            if (_this.addressOutMaison) {
              const {floor,elevator, ...rest2} = addressOut;
              baseValidations = {...rest, addressOut: rest2};
            } else {
              baseValidations = {...rest, addressOut}
            }
          }
          return baseValidations;
        },
        "2": {
          dealDate: {required},
          estimatedTime: {required},
          menRequired: {required, numeric},
          description: {required, maxLength: maxLength(1000)}
        }
      }
    }
  }
})
export default class CreateMoving extends Vue {

  public show = true;
  public countStep = 1;
  public $v;

  get currentFormType() {return this.CreateMovingForm[1].type;}
  get typeDepart() {return this.CreateMovingForm[1].type == 0;}
  get typeArrivee() {return this.CreateMovingForm[1].type == 1;}
  get typeBoth() {return this.CreateMovingForm[1].type == 2;}

  get addressInMaison() {return this.CreateMovingForm[1].addressIn.type == 'Maison'}
  get addressOutMaison() {return this.CreateMovingForm[1].addressOut.type == 'Maison'}

  get getButtonTitle() {
    if (this.countStep < 2) {
      return 'Étape suivante'
    } else {
      return `Créer l'annonce`;
    }
  }


  public CreateMovingForm: any = {
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
      addressIn: {
        address: new Forms.TextForm({
          icon: require('@icons/moving/arrow_up.svg'),
          placeholder: 'Votre adresse de départ'
        }),
        type:  new Forms.Radio({
          placeholder: `Type d'habitation`,
          value: 'Maison',
          options: [
            {value: 'Maison', text: 'Maison'},
            {value: 'Appartement', text: `Appartement`},
          ]
        }),
        floor: new Forms.Select({
          placeholder: `Nombre d'étages`,
          options: Array.from(Array(7)).map((val, index) => {
            return {value: index + 1, text: index + 1 + ' étages'}
          })
        }),
        elevator: new Forms.Radio({
          placeholder: 'Ascenseur?',
          options: [
            {value: 1, text: 'Oui'},
            {value: 0, text: 'Non'}
          ]
        }),
        volume: new Forms.TextForm({
          placeholder: 'Volume estimé au départ (en m³)',
          icon: require('@icons/moving/volume.svg')
        })
        
      },
      addressOut: {
        address: new Forms.TextForm({
          icon: require('@icons/moving/arrow_down.svg'),
          placeholder: `Votre adresse d'arrivée`
        }),
        type:  new Forms.Radio({
          placeholder: `Type d'habitation`,
          value: 'Maison',
          options: [
            {value: 'Maison', text: 'Maison'},
            {value: 'Appartement', text: `Appartement`},
          ]
        }),
        floor: new Forms.Select({
          placeholder: `Nombre d'étages`,
          options: Array.from(Array(7)).map((val, index) => {
            return {value: index + 1, text: index + 1 + ' étages'}
          })
        }),
        elevator: new Forms.Radio({
          placeholder: 'Ascenseur?',
          options: [
            {value: 1, text: 'Oui'},
            {value: 0, text: 'Non'}
          ]
        }),
        volume: new Forms.TextForm({
          placeholder: `Volume estimé à l'arrivée (en m³)`,
          icon: require('@icons/moving/volume.svg')
        })
      },
    }),
    "2": new Forms.Form({
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
        placeholder: 'Nombre de personnes requises',
        options: Array.from(Array(15)).map((val, index) => {
          return {value: index + 1, text: index + 1 + ' personnes'}
        })
      }),
      description: new Forms.TextForm({
        placeholder: 'Description du déménagement',

      })
    })
  }

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

