<template lang='html'>
  <div class='BeMover'>
    <div class='sections'>
      <section class='bemover-form'>
        <h1>Devenir déménageur</h1>
        <div class='content'>
          <FormMessage>
            <template slot='title'>Confidentialité et sécurité</template>
            Nous voulons rendre votre visibilité plus grande envers les utilisateurs voulant déménager. Il faut donc être précis sur vos informations
            <br/>Seule votre ville sera affichée dans les recherches
          </FormMessage>
          <FormText v-model='becomeMoverForm.firstname' :vl='$v.becomeMoverForm.firstname' :data='becomeMoverForm.fieldsData.firstname' />
          <FormText v-model='becomeMoverForm.lastname' :vl='$v.becomeMoverForm.lastname' :data='becomeMoverForm.fieldsData.lastname' />
          <FormUpload v-model='becomeMoverForm.avatar' :vl='$v.becomeMoverForm.avatar' :data='becomeMoverForm.fieldsData.avatar' />
          <FormPlaceSearch v-model='becomeMoverForm.address' :vl='$v.becomeMoverForm.address' :data='becomeMoverForm.fieldsData.address' />
          <FormText v-model='becomeMoverForm.phone' :vl='$v.becomeMoverForm.phone' :data='becomeMoverForm.fieldsData.phone' />
          <FormText v-model='becomeMoverForm.price' :vl='$v.becomeMoverForm.price' :data='becomeMoverForm.fieldsData.price' />
          <FormMessage>
            <template slot='title'>Information  sur le prix</template>
            Si vous êtes accepté par un déménageur pour l'aider, c'est votre prix qui sera pris en compte dans le calcul
          </FormMessage>
          <FormField v-model='becomeMoverForm.description' :vl='$v.becomeMoverForm.description' :data='becomeMoverForm.fieldsData.description' />
          <CheckBox v-model='becomeMoverForm.cgu' :vl='$v.becomeMoverForm.cgu' :data='becomeMoverForm.fieldsData.cgu'/>
          <div class='footer'>
            <FormButton 
              :submitting='submitting'
              :disabled='$v.becomeMoverForm.$invalid'
              @disabledClick='touchForm()'
              @click='submitForm()'
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
  FormMessage, Radio, FormSelect, FormSeparator,FormField, CheckBox, FormCalendar, FormUpload } from "@components";
import { timeout } from '@methods';
import { required, email, numeric, maxLength } from 'vuelidate/lib/validators';
import Router, {routesNames} from '@router';
import { GlobalStore, LoginStore, MoverStore } from '@store';
import { Forms, AlertsElement, ActionsElements } from '@classes';

@Component({
  components: {
    FormButton, FormText, UISteps, FormField, FormPlaceSearch, FormUpload,
    FormMessage, Radio, FormSelect, FormSeparator, CheckBox, FormCalendar
  },
  validations: {
    becomeMoverForm: {
      cgu: {isCguChecked(value) {return value}},
      firstname: {required, maxLength: maxLength(30)},
      lastname: {required, maxLength: maxLength(30)},
      address: {required},
      avatar: {required},
      phone: {required, phone(value) {
        if (required(value)) {
          const regex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
          return regex.test(value);
        }
        return true;
      }},
      price:{required, numeric},
      description: {required, maxLength: maxLength(1000)}
    }
  }
})
export default class BeMover extends Vue {

  public $v;
  public css = require('@css');
  public submitting = false;

  get userInfos() {
    return LoginStore.state.userInfos
  }

  public becomeMoverForm = new Forms.Form({
    cgu: new Forms.CheckBox({
      placeholder: `J'accepte les conditions générale d'utilisation du site`,
      value: true,
    }),
    firstname: new Forms.TextForm({
      icon: require('@icons/surname.svg'),
      placeholder: 'Votre prénom',
      value: this.userInfos.firstname
    }),
    lastname: new Forms.TextForm({
      icon: require('@icons/surname.svg'),
      placeholder: 'Votre nom',
      value: this.userInfos.lastname
    }),
    avatar: new Forms.UploadForm({
      placeholder: 'Votre photo de profil'
    }),
    address: new Forms.TextForm({
      icon: require('@icons/localisation.svg'),
      placeholder: 'Votre adresse',
    }),
    phone: new Forms.TextForm({
      icon: require('@icons/phone.svg'),
      type: 'tel',
      placeholder: 'Votre numéro de téléphone',
    }),
    price: new Forms.TextForm({
      icon: require('@icons/euro.svg'),
      placeholder: 'Votre prix par heure',
    }),
    description: new Forms.TextForm({
      placeholder: 'Décrivez vous en quelques mots',
    })
  })


  async submitForm() {
    try {
      this.submitting = true;
      const form = this.becomeMoverForm.getData();
      form.phone = form.phone.split(' ').join('');
      let formData = new FormData();
      for (let key in form) {
        formData.append(key, form[key]);
      }
      const result = await MoverStore.actions.becomeMover(formData);
      new AlertsElement.SuccessAlert({
        title: "Opération réussie!",
        message: "Vous êtes bien enregistré en temps que déménageur, vous apparaitrez maintenant dans les recherches",
        onClose: [
          () => Router.push({name: routesNames.user, params: {userId: this.userInfos.id}}),
        ]
      })
    } catch(e) {
      new AlertsElement.ErrorAlert({
        title: 'Erreur lors de votre activation',
        message: `Une erreur s'est produite lors de votre activation. Veuillez nous excuser`,
      })
    } finally {
      this.submitting = false;
    }
  }

  touchForm() {
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
  background-color: white;
  padding: 10px;

  .sections {
    display: flex;
    position: relative;
    flex-flow: row nowrap;
    padding: 10px;
    padding-top: 10px;
    flex: 0 1 auto;
    width: 600px;
    justify-content: center;
    align-items: flex-start;
    align-content: flex-start;

    section.bemover-form {
      display: flex;
      height: auto;
      width: 100%;
      flex-flow: column wrap;
      padding-top: 0;

      h1 {
        text-align: center;
        padding: 10px;
      }

      .content {
        padding: 10px;;
        display: flex;
        flex-flow: column wrap;
        position: relative;

        .footer {
          display: flex;
          flex-flow: row wrap;
          justify-content: flex-end;
          padding-top: 10px;
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


