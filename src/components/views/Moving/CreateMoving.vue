<template>
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
              Indiquer un prénom, nom et un numéro de téléphone permet de recevoir les coordonnées de mes déménageurs une fois la mise en relation effectuée.
            </FormMessage>
            <FormText v-model='CreateMovingForm.part0.firstname' 
              :vl='$v.CreateMovingForm.part0.firstname' 
              :data='CreateMovingForm.part0.fieldsData.firstname'/>
            <FormText v-model='CreateMovingForm.part0.lastname' 
              :vl='$v.CreateMovingForm.part0.lastname' 
              :data='CreateMovingForm.part0.fieldsData.lastname'/>
            <FormText v-model='CreateMovingForm.part0.phone' 
              :vl='$v.CreateMovingForm.part0.phone' 
              :data='CreateMovingForm.part0.fieldsData.phone'/>
          </li>
          <li v-if='countStep == 1' class='create-view' key='movingInfos'>
            <Radio v-model='CreateMovingForm.part1.helpType' 
              :vl='$v.CreateMovingForm.part1.helpType' 
              :data='CreateMovingForm.part1.fieldsData.helpType' />
            <FormText v-model='CreateMovingForm.part1.volume'
              :vl='$v.CreateMovingForm.part1.volume' 
              :data='CreateMovingForm.part1.fieldsData.volume'/>
            <template v-if='typeDepart || typeBoth'>
              <FormSeparator>Informations du départ</FormSeparator>
              <FormPlaceSearch v-model='CreateMovingForm.part1.addressIn.address'  key='departAddress'
                :vl='$v.CreateMovingForm.part1.addressIn.address' 
                :data='CreateMovingForm.part1.fieldsData.addressIn.address'/>
              <Radio row v-model='CreateMovingForm.part1.addressIn.addressType' 
                :vl='$v.CreateMovingForm.part1.addressIn.addressType' 
                :data='CreateMovingForm.part1.fieldsData.addressIn.addressType' />
              <div class='form-split two' v-if='!addressInMaison'>
                <FormSelect v-model='CreateMovingForm.part1.addressIn.floor' 
                  :vl='$v.CreateMovingForm.part1.addressIn.floor' 
                  :data='CreateMovingForm.part1.fieldsData.addressIn.floor'/>
                <Radio row v-model='CreateMovingForm.part1.addressIn.elevator' 
                  :vl='$v.CreateMovingForm.part1.addressIn.elevator' 
                  :data='CreateMovingForm.part1.fieldsData.addressIn.elevator'/>
              </div>
            </template>

            <template v-if='typeArrivee || typeBoth'>
              <FormSeparator>Informations de l'arrivée</FormSeparator>
              <FormPlaceSearch v-model='CreateMovingForm.part1.addressOut.address'  key='arriveeAddress'
                :vl='$v.CreateMovingForm.part1.addressOut.address' 
                :data='CreateMovingForm.part1.fieldsData.addressOut.address'/>
              <Radio row v-model='CreateMovingForm.part1.addressOut.addressType' 
                :vl='$v.CreateMovingForm.part1.addressOut.addressType' 
                :data='CreateMovingForm.part1.fieldsData.addressOut.addressType' />
              <div class='form-split two' v-if='!addressOutMaison'>
                <FormSelect v-model='CreateMovingForm.part1.addressOut.floor' 
                  :vl='$v.CreateMovingForm.part1.addressOut.floor' 
                  :data='CreateMovingForm.part1.fieldsData.addressOut.floor'/>
                <Radio row v-model='CreateMovingForm.part1.addressOut.elevator' 
                  :vl='$v.CreateMovingForm.part1.addressOut.elevator' 
                  :data='CreateMovingForm.part1.fieldsData.addressOut.elevator'/>
              </div>
            </template>
          </li>
          <li v-if='countStep == 2' class='create-view' key='confirm'>
            <FormSeparator>Autres informations</FormSeparator>
            
            <FormText v-model='CreateMovingForm.part2.label' 
              :vl='$v.CreateMovingForm.part2.label'
              :data='CreateMovingForm.part2.fieldsData.label'/>
            <FormCalendar v-model='CreateMovingForm.part2.dealDate' 
              :vl='$v.CreateMovingForm.part2.dealDate' 
              :data='CreateMovingForm.part2.fieldsData.dealDate'
              isMoving/>

            <div class='form-split two'>
              <FormSelect v-model='CreateMovingForm.part2.estimatedTime' 
                :vl='$v.CreateMovingForm.part2.estimatedTime' 
                :data='CreateMovingForm.part2.fieldsData.estimatedTime'/>
              <FormSelect v-model='CreateMovingForm.part2.menRequired' 
                :vl='$v.CreateMovingForm.part2.menRequired' 
                :data='CreateMovingForm.part2.fieldsData.menRequired'/>
            </div>
            <FormText v-model='CreateMovingForm.part2.pricePerHourPerUser' 
              :vl='$v.CreateMovingForm.part2.pricePerHourPerUser' 
              :data='CreateMovingForm.part2.fieldsData.pricePerHourPerUser'/>
            <FormMessage>
              <template slot='title'>Le prix est indicatif</template>
              Ce nombre indiquera le montant qui vous semble raisonable. <br>
              Quand vous accepterez un déménageur, c'est son prix par heure qui sera pris en compte dans le calcul et non pas le votre <br>
              Libre à vous d'accepter ou pas un déménageur avec un prix plus élevé.
            </FormMessage>
            <FormField v-model='CreateMovingForm.part2.description'
              :vl='$v.CreateMovingForm.part2.description' 
              :data='CreateMovingForm.part2.fieldsData.description'/>
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
        :submitting='submitting'
        :disabled='$v.CreateMovingForm["part"+countStep].$invalid' 
        @click='formClick()'
        @disabledClick='touchForm()'>
          {{getButtonTitle}}
      </FormButton>
    </template>
  </UIModal>

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
    UIModal, FormButton, FormText, UISteps, FormField, FormPlaceSearch,
    FormMessage, Radio, FormSelect, FormSeparator, CheckBox, FormCalendar
  },
  validations() {
    const _this = this;
    return {
      CreateMovingForm: {
        part0: {
          firstname: {required},
          lastname: {required},
          phone: {required, phone(value) {
            if (required(value)) {
              const regex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
              return regex.test(value);
            }
            return true;
          }}
        },
        get part1() {
          let baseValidations: any = {
            helpType: {required},
            volume: {required, numeric},
            addressIn: {
              address: {required},
              addressType: {required},
              floor: {required, numeric},
              elevator: {required},
            },
            addressOut: {
              address: {required},
              addressType: {required},
              floor: {required, numeric},
              elevator: {required},
            },
          }

          if (_this.addressInMaison) {
            const {addressIn, ...rest} = baseValidations;
            const {floor,elevator, ...rest2} = addressIn;
            baseValidations = {...rest, addressIn: rest2};
          } 

          if (_this.addressOutMaison) {
            const {addressOut, ...rest} = baseValidations;
            const {floor,elevator, ...rest2} = addressOut;
            baseValidations = {...rest, addressOut: rest2};
          } 
          
          if (_this.typeDepart) {
            delete baseValidations.addressOut;
          } 
          else if (_this.typeArrivee) {
            delete baseValidations.addressIn;
          }
          return baseValidations;
        },
        part2: {
          label: {required, maxLenght: maxLength(100)},
          dealDate: {required},
          estimatedTime: {required},
          pricePerHourPerUser: {required, numeric},
          menRequired: {required, numeric},
          description: {required, maxLength: maxLength(1000)}
        }
      }
    }
  }
})
export default class CreateMoving extends Vue {

  public show = true;
  public countStep = 0;
  public submitting = false;
  public userInfosVerified = false;
  public $v;

  get currentFormType() {return this.CreateMovingForm.part1.helpType;}
  get typeDepart() {return this.CreateMovingForm.part1.helpType == 0;}
  get typeArrivee() {return this.CreateMovingForm.part1.helpType == 1;}
  get typeBoth() {return this.CreateMovingForm.part1.helpType == 2;}

  get addressInMaison() {return this.CreateMovingForm.part1.addressIn.addressType == 'Maison'}
  get addressOutMaison() {return this.CreateMovingForm.part1.addressOut.addressType == 'Maison'}

  get getButtonTitle() {
    if (this.countStep < 2) {
      return 'Étape suivante'
    } else {
      return `Créer l'annonce`;
    }
  }

  get userInfos() {return LoginStore.state.userInfos}

  formClick() {
    if (this.countStep == 0) {
      this.sendUserInfos();
    }
    else if (this.countStep == 1) {
      this.crementCount(1);
    } else {
      this.submitForm();
    }
  }

  public CreateMovingForm: any = {
    part0: new Forms.Form({
      firstname: new Forms.TextForm({
        icon: require('@icons/surname.svg'),
        value: this.userInfos.firstname || 'Phillibert',
        placeholder: 'Votre prénom',
        noEdit: !(!!this.userInfos.firstname)
      }),
      lastname: new Forms.TextForm({
        icon: require('@icons/surname.svg'),
        value: this.userInfos.lastname || 'Cojaque',
        placeholder: 'Votre nom de famille',
        noEdit: !(!!this.userInfos.lastname)
      }),
      phone: new Forms.TextForm({
        icon: require('@icons/phone.svg'),
        value: '0637096255',
        type: 'tel',
        placeholder: 'Votre numéro de téléphone',
        noEdit: !(!!this.userInfos.phone)
      })
    }),
    part1: new Forms.Form({
      helpType: new Forms.Radio({
        placeholder: `J'ai besoin d'aide:`,
        value: 2,
        options: [
          {value: 0, text: 'Au départ'},
          {value: 1, text: `A l'arrivée`},
          {value: 2, text: 'Les deux'}
        ]
      }),
      volume: new Forms.TextForm({
        placeholder: `Volume estimé total (en m³)`,
        value: 50,
        icon: require('@icons/moving/volume.svg')
      }),
      addressIn: {
        address: new Forms.TextForm({
          icon: require('@icons/moving/arrow_up.svg'),
          value: "ChIJ6Wdw6uFv5kcRFiniHxoAJ-o",
          placeholder: 'Votre adresse de départ'
        }),
        addressType:  new Forms.Radio({
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
      },
      addressOut: {
        address: new Forms.TextForm({
          icon: require('@icons/moving/arrow_down.svg'),
          value: 'ChIJcVon7gevthIReAMdXVT163k',
          placeholder: `Votre adresse d'arrivée`
        }),
        addressType:  new Forms.Radio({
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
      },
    }),
    part2: new Forms.Form({
      label: new Forms.TextForm({
        placeholder: 'Titre de votre déménagement (court)',
        value: 'tesstttt'
      }),
      dealDate: new Forms.TextForm({
        icon: require('@icons/date.svg'),
        value: 1531468857,
        placeholder: 'Date et heure de votre déménagement',
      }),
      estimatedTime: new Forms.Select({
        placeholder: 'Durée du déménagement',
        value: 2,
        options: Array.from(Array(10)).map((val, index) => {
          return {value: index + 1, text: index + 1 + 'h'}
        })
      }),
      menRequired: new Forms.Select({
        placeholder: 'Nombre de personnes requises',
        value: 3,
        options: Array.from(Array(15)).map((val, index) => {
          return {value: index + 1, text: index + 1 + ' personnes'}
        })
      }),
      pricePerHourPerUser: new Forms.TextForm({
        icon: require('@icons/euro.svg'),
        placeholder: 'Prix par heure et par déménageur conseillé (en €)',
        value: 15
      }),
      description: new Forms.TextForm({
        placeholder: 'Description du déménagement',
        value: 'akljlkjdlandlzdlzaldajl'
      })
    })
  }

  async sendUserInfos() {
    if (this.userInfosVerified) {
      this.crementCount(1);
    } else {
      let {part0} = Object.assign({}, this.CreateMovingForm);
      part0 = part0.getData();
      try {
        this.submitting = true;
        const result = await MovingStore.actions.sendUserInfos(part0);
        this.userInfosVerified = true;
        this.crementCount(1);
        
      } catch(e) {
        new AlertsElement.ErrorAlert({
          title: 'Erreur lors du stockage de vos infos',
          message: `Une erreur s'est produite lors de la sauvegarde de vos infos. Veuillez nous excuser`,
        })
      } finally {
        this.submitting = false;
      }
    }

  }

  async submitForm() {
    let {part0, part1, part2} = Object.assign({}, this.CreateMovingForm);
    part1 = part1.getData();
    part2 = part2.getData();

    if (this.addressInMaison) {
      const {addressIn, ...rest} = part1;
      const {floor,elevator, ...rest2} = addressIn;
      part1 = {...rest, addressIn: rest2};
    } 

    if (this.addressOutMaison) {
      const {addressOut, ...rest} = part1;
      const {floor,elevator, ...rest2} = addressOut;
      part1 = {...rest, addressOut: rest2};
    }

    part1.addressIn.placeId = part1.addressIn.address;
    part1.addressOut.placeId = part1.addressOut.address;
    delete part1.addressIn.address;
    delete part1.addressOut.address;
    
    if (this.typeDepart) {
      // delete part1.addressOut;
    } 
    else if (this.typeArrivee) {
      // delete part1.addressIn;
    }
    const finalValues = {...part1, ...part2};
    console.log(JSON.parse(JSON.stringify(finalValues)));
    try {
      this.submitting = true;
      const result: any = await MovingStore.actions.createAnnouncement(finalValues);
      Router.push({name: routesNames.moving})
      new AlertsElement.SuccessAlert({
        title: "Publication réussie!",
        message: "Votre annonce a bien été publiée. Recrutez des déménageurs depuis la page de votre annonce ou attendez que des déménégeurs proposent leur aide",
        actions: [
          new ActionsElements.Action({
            type: 'action',
            text: 'Voir mon annonce',
            triggers: [
              () => Router.push({name: routesNames.movingInfos, params: {movingId: result.data}}),
            ]
          }),
          new ActionsElements.ConfirmAction({
            triggers: [() => Router.go(0)]
          })
        ]
      })
    } catch(e) {
      new AlertsElement.ErrorAlert({
        title: 'Erreur lors de la création',
        message: `Une erreur s'est produite lors de la création de l'annonce. Veuillez nous excuser`,
      })
    } finally {
      this.submitting = false;
    }
  }

  touchForm() {
    this.$v.CreateMovingForm["part"+this.countStep].$touch();
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
    if (GlobalStore.state.previousModalRoute && Router.currentRoute.matched.some(m => m.path == GlobalStore.state.previousModalRoute)) {
      Router.push(GlobalStore.state.previousModalRoute)
    } else {
      Router.push({name: routesNames.moving});
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
    padding: 0 30px 10px 30px;

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

