<template>
  <form @submit.prevent='submitForm()' novalidate method='post' action>
    <UIModal :show='show' @close='close' :width='450' :isPopup='isPopup'>
      <span slot='header'>Inscription</span>
      <div slot='content' style='padding: 0 20px 0px 20px'>
        <div class='moving-logo'>
          <img src="~@images/logo_truck_M.svg">
        </div>
        <!-- <SocialButton media='facebook'>Inscription avec Facebook</SocialButton> -->
        <SocialButton media='google'>Inscription avec Google</SocialButton>
        <FormSeparator>Ou inscrivez vous</FormSeparator>
        <FormText v-model="SignupForm.email" :vl='$v.SignupForm.email' :data='SignupForm.fieldsData.email'/>
        <FormText v-model="SignupForm.username" :vl='$v.SignupForm.username' :data='SignupForm.fieldsData.username'/>
        <FormText v-model="SignupForm.plainPassword.first" :vl='$v.SignupForm.plainPassword.first' :data='SignupForm.fieldsData.plainPassword.first'/>
        <FormText v-model="SignupForm.plainPassword.second" :vl='$v.SignupForm.plainPassword.second' :data='SignupForm.fieldsData.plainPassword.second'/>

        <div class='infoMessage' v-if='formError.infoMessage.length' :class='[formError.errorType]'>
          {{formError.infoMessage}}
        </div>

      </div>
      <template slot='footer'>
        <FormButton @click='close(true)' v-if='isPopup'>Annuler</FormButton>
        <FormButton type='submit' 
          :submitting='submitting' 
          :disabled='$v.SignupForm.$invalid'
          @disabledClick='touchForm()' 
          theme='blue'>
          S'inscrire
        </FormButton>
      </template>
    </UIModal>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { UIModal, FormText, CheckBox, FormButton,FormSeparator, SocialButton } from "@components";
import { timeout } from '@methods';
import { required, email, minLength, maxLength, sameAs } from 'vuelidate/lib/validators';
import { SignupStore, LoginStore, NotificationsStore, AlertsStore } from '@store';
import { Vuelidate } from 'vuelidate';
import { ActionsElements, AlertsElement, Forms } from '@classes';
import Api from '@api';

@Component({
  components: {
    UIModal, FormText, CheckBox, FormButton, FormSeparator, SocialButton
  },
  validations: {
    SignupForm: {
      email:{required, email,
        async isMailUnique(value) {
          if (email(value) && value.length > 0) {
            return await Api.get('check_credentials', {email: value});
          }
          return true;
        }
      },
      username:{
        required,
        async isNameUnique(value) {
          if (value.length > 0) {
            return await Api.get('check_credentials', {username: value});
          }
          return true;
        },
      },
      plainPassword: {
        first: {required},
        second: {required, sameAs: sameAs('first')},
      }
    }
  }
})
export default class Inscription extends Vue {

  private signupRequest = SignupStore.actions.signupRequest;
  private showSignup = SignupStore.mutations.showSignup;
  private closeModal = SignupStore.mutations.closeModal;

  @Prop({default: true}) isPopup: boolean;
  @Prop({required: false, default: true}) show: boolean;

  public submitting: boolean = false;
  public formError = {
    infoMessage: '',
    errorType: ''
  }
  public $v;

  public SignupForm = new Forms.Form({
    email: new Forms.TextForm({
      type: 'email',
      placeholder: 'Adresse email',
      icon: require('@icons/mail.svg'),
      debounce: 300
    }),
    username: new Forms.TextForm({
      placeholder: `Nom d'utilisateur`,
      icon: require('@icons/surname.svg'),
      debounce: 300
    }),
    plainPassword:{
      first:  new Forms.TextForm({
        type: 'password',
        placeholder: 'Mot de passe',
        icon: require('@icons/password.svg')
      }),
      second: new Forms.TextForm({
        type: 'password',
        icon: require('@icons/password.svg'),
        placeholder: 'Confirmation du mot de passe'
      })
    }
  })

  close(reset?: boolean) {
    if (this.isPopup) {
      this.closeModal();
      if (reset) {
        this.SignupForm.reset();
        this.$v.$reset();
        this.formError = {
          errorType: '',
          infoMessage: ''
        }
      }
    }
    this.submitting = false;
  }

  touchForm() {
    this.$v.SignupForm.$touch();
  }

  async submitForm() {
    if (!this.$v.SignupForm.$invalid) {
      this.submitting = true;
      try {
        await this.signupRequest(this.SignupForm.getData());
        this.close(true);
        new AlertsElement.SuccessAlert({
          title: "Inscription réussie",
          message: "Vous êtes bien inscrit. Un mail vous a été envoyé pour valider votre compte",
          actions: [
            new ActionsElements.LoginAction()
          ]
        })
      } catch(e) {
        this.formError = {
          errorType: e.type,
          infoMessage: e.message
        }
      } finally {
        this.submitting = false;
      }
    }
  }


  async mounted() {
  }
}
</script>



<style lang='scss'>
  .moving-logo {
    padding: 5px 30px 10px 30px;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-flow: column nowrap;

    img {
      width: 70px;
      height: auto;
    }
  }

  .infoMessage {
    border: 1px solid $w210;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    margin: 5px;
    padding: 10px 10px 10px 10px;
    text-align: center;
    border: 1px solid $w230;
    
    &.error {
      color: $red1;
    }

    &.warning {
      color: $yellow2;
    }
  }
</style>

