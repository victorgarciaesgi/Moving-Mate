<template>
  <form @submit.prevent='submitForm()' novalidate method='post' action>
    <UIModal :show='show' @close='close' :width='450' :isPopup='isPopup'>
      <span slot='header'>Inscription</span>
      <div slot='content' style='padding: 0 20px 0px 20px'>
        <div class='moving-logo'>
          <img src="~@images/logo_truck_M.svg">
        </div>
        <SocialButton media='facebook'>Inscription avec Facebook</SocialButton>
        <SocialButton media='google'>Inscription avec Google</SocialButton>
        <FormSeparator>Ou inscrivez vous</FormSeparator>
        <FormText type='email' placeholder='Adresse mail'
            :debounce='500'
            :icon="images.email"  
            v-model="SignupForm.email" 
            :vl='$v.SignupForm.email'/>
        
        <FormText type='text' placeholder="Nom d'utilisateur"
            :icon="images.username"
            :debounce='500'
            v-model="SignupForm.username" 
            :vl='$v.SignupForm.username'/>

        <FormText type='password' placeholder='Mot de passe'
            :icon="images.plainPassword.first"  
            v-model="SignupForm.plainPassword.first" 
            :vl='$v.SignupForm.plainPassword.first'/>

        <FormText type="password" placeholder='Confirmez le mot de passe'
            :icon="images.plainPassword.second"  
            v-model="SignupForm.plainPassword.second" 
            :vl='$v.SignupForm.plainPassword.second'/>

        <div class='infoMessage' v-if='formError.infoMessage.length' :class='[formError.errorType]'>
          {{formError.infoMessage}}
        </div>

      </div>
      <template slot='footer'>
        <FormButton @click='close(true)' v-if='isPopup'>Annuler</FormButton>
        <FormButton type='submit' 
          :submitting='submitting' 
          :disabled='$v.SignupForm.$invalid' 
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
import { ActionsElements, AlertsElement } from '@classes';
import Api from '@api';
@Component({
  components: {
    UIModal, FormText, CheckBox, FormButton, FormSeparator, SocialButton
  },
  validations: {
    SignupForm: {
      email: {required, email, 
        async isMailUnique(value) {
          if (email(value) && value.length > 0) {
            return await Api.get('check_credentials', {email: value});
          }
          return true;
        }
      },
      username: {
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
  public $v: Vuelidate<any>;

  public images = {
    email: require('@icons/mail.svg'),
    username: require('@icons/surname.svg'),
    plainPassword: {
      first:require('@icons/password.svg'),
      second: require('@icons/password.svg')
    }
  }
  public SignupForm = {
    email: 'victor@free.fr',
    username: 'victor2',
    plainPassword: {
      first: 'aaaaa',
      second: 'aaaaa'
    },
    reset() {
      this.email = '';
      this.username = '';
      this.plainPassword = {
        first: '',
        second: ''
      }
    }
  };

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

  async submitForm() {
    this.submitting = true;
    const submitResponse = await this.signupRequest(this.SignupForm);
    
    if (!submitResponse.success){
      this.formError = {
        errorType: submitResponse.type,
        infoMessage: submitResponse.message
      }
    } else {
      this.close(true);
      new AlertsElement.SuccessAlert({
        title: "Inscription réussie",
        message: "Vous êtes bien inscrit. Un mail vous a été envoyé pour valider votre compte",
        actions: [
          new ActionsElements.LoginAction()
        ]
      })
    }
    this.submitting = false;
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

