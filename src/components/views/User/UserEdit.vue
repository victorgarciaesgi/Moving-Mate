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
              <FormButton @click='resetForm()'>
                  Annuler
              </FormButton>
              <FormButton 
                :submitting='submitting'
                :disabled='canSubmit'
                @click='submitEdit'
                theme='blue'>
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
import {LoginStore, UserStore, NotificationsStore} from '@store';

@Component({
  components: {
    FormButton, FormText, UISteps, FormField, FormPlaceSearch, FormUpload,
    FormMessage, Radio, FormSelect, FormSeparator, CheckBox, FormCalendar
  },
  validations: {
    editUserForm: {
      firstname: {required},
      lastname: {required},
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
      description: {required}
    }
  }
})

export default class UserEdit extends Vue {

  public $v;
  public $forceUpdate;

  public editUserForm: Forms.Form = null;
  public css = require('@css');
  public submitting = false;

  get userInfos() {
    return UserStore.state.oneUser
  }

  get canSubmit() {
    const fieldsModified = Object.keys(this.editUserForm.getData())
      .filter(key => this.$v.editUserForm[key].$dirty)
      .filter(key => !this.$v.editUserForm[key].$invalid);
    return (fieldsModified.length <= 0);
  }

  resetForm() {
    this.$v.$reset();
    this.editUserForm.reset();
  }

  fillForm() {
    this.editUserForm = new Forms.Form({
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
      avatar: new Forms.UploadForm({
        placeholder: 'Votre photo de profil',
        value: this.userInfos.avatar,
        editMode: true
      }),
      address: new Forms.PlaceSearchForm({
        icon: require('@icons/localisation.svg'),
        placeholder: 'Votre adresse',
        value: {title: this.userInfos.fullAddress?this.userInfos.fullAddress: null},
        editMode: true
      }),
      phone: new Forms.TextForm({
        icon: require('@icons/phone.svg'),
        type: 'tel',
        placeholder: 'Votre numéro de téléphone',
        value: this.userInfos.phone,
        editMode: true
      }),
      price: new Forms.TextForm({
        icon: require('@icons/euro.svg'),
        placeholder: 'Votre prix par heure',
        value: this.userInfos.pricePerHour,
        editMode: true
      }),
      description: new Forms.FieldForm({
        placeholder: 'Votre description',
        value: this.userInfos.description,
        editMode: true
      })
    })
  }

  created() {
    this.fillForm();
  }

  async submitEdit() {
    this.submitting = true;
    const form = this.editUserForm.getData()
    const filteredForm = Object.keys(form)
      .filter(key => this.$v.editUserForm[key].$dirty)
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: form[key]
        };
      }, {});
    let formData = new FormData();
    for (let key in filteredForm) {
      formData.append(key, form[key]);
    }
    console.log(filteredForm);
    try {
      const result = await UserStore.actions.sendUserEdit(formData);
      UserStore.actions.getOneUser({userId: this.userInfos.id, force: true});
      LoginStore.actions.refreshUserInfos();
      NotificationsStore.actions.addNotification({
        type: 'success',
        message: 'Votre profil a bien été mis à jour',
      })
    } catch(e) {
      NotificationsStore.actions.addNotification({
        type: 'error',
        message: 'Erreur lors du changement de vos informations'
      })
    } finally {
      this.submitting = false;
    }

  }
}
</script>


<style lang="scss" scoped>

.EditUser {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  // background-color: white;
  // padding: 10px;
  // box-shadow: 0 0 10px rgba(0,0,0,0.1);

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


