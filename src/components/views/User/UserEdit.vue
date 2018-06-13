<template lang='html'>
  <div class='EditUser'>
    <div class='sections'>
      <section class='edit-form'>
        <h1>Modifier mes informations</h1>
        <div class='content'>
          <component :is='value.component' 
            v-for='(value, key) in editUserForm.fieldsData' 
            :key='key'
            v-model='editUserForm[key]'
            :vl='$v.editUserForm[key]'
            :data='value'></component>
            <div class='footer'>
              <FormButton 
                :submitting='submitting'
                @disabledClick='touchForm()'
                :colorTheme='css.mainStyle'>
                  Éditer mon profil
              </FormButton>
            </div>
        </div>
      </section>
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
import {Forms} from '@classes';
import {LoginStore} from '@store';

@Component({
  components: {
    FormButton, FormText, UISteps, FormField, FormPlaceSearch, FormUpload,
    FormMessage, Radio, FormSelect, FormSeparator, CheckBox, FormCalendar
  },
  validations: {
    editUserForm: {
      username: {required},
      firstname: {required},
      lastname: {required},
      address: {required},
      picture: {required},
      phone: {required, phone(value) {
        if (required(value)) {
          const regex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
          return regex.test(value);
        }
        return true;
      }},
      price:{required, numeric},
      description: {required}
    }
  }
})

export default class UserEdit extends Vue {

  public $v;

  public editUserForm = null;
  public css = require('@css');
  public submitting = false;

  get userInfos() {
    return LoginStore.state.userInfos
  }


  created() {
    this.editUserForm = new Forms.Form({
      username: new Forms.TextForm({
        icon: require('@icons/surname.svg'),
        placeholder: 'Votre pseudo',
        value: this.userInfos.username,
        editMode: true
      }),
      firstname: new Forms.TextForm({
        icon: require('@icons/surname.svg'),
        placeholder: 'Votre prénom',
        value: this.userInfos.firstname,
        editMode: true
      }),
      lastname: new Forms.TextForm({
        icon: require('@icons/surname.svg'),
        placeholder: 'Votre nom',
        value: this.userInfos.lastname,
        editMode: true
      }),
      picture: new Forms.UploadForm({
        placeholder: 'Votre photo de profil',
        value: this.userInfos.avatar || require('@images/home_image/home_image.jpg'),
        editMode: true
      }),
      address: new Forms.PlaceSearchForm({
        icon: require('@icons/localisation.svg'),
        placeholder: 'Votre adresse',
        value: {title: this.userInfos.address?this.userInfos.address.value: null},
        editMode: true
      }),
      phone: new Forms.TextForm({
        icon: require('@icons/phone.svg'),
        type: 'tel',
        placeholder: 'Votre numéro de téléphone',
        editMode: true
      }),
      price: new Forms.TextForm({
        icon: require('@icons/euro.svg'),
        placeholder: 'Votre prix par heure',
        editMode: true
      }),
      description: new Forms.FieldForm({
        placeholder: 'Votre description',
        editMode: true
      })
    })
  }
}
</script>


<style lang="scss" scoped>

.EditUser {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: white;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);

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

    section.edit-form {
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


