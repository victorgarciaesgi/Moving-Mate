<template>
  <UIModal :show='show' @close='modalClosed' :width='450' :isPopup='isPopup'>
    <span slot='header'>Connexion</span>
    
    <div slot='content' style='padding: 10px 30px 10px 30px'>
      <div class='moving-logo'>
        <img src="~@images/logo_banniere.svg">
        <span class='form-option'>
          Pas encore inscrit? 
          <span class='form-link' @click='handleSubmitLink()'>Inscrivez vous</span>
        </span>
      </div>
      <!-- <SocialButton media='facebook'>Connexion avec Facebook</SocialButton> -->
      <!-- <SocialButton media='google'>Connexion avec Google (Beta)</SocialButton> -->
      <FormSeparator>Ou connectez vous</FormSeparator>
      <FormText v-model="LoginForm._username" :vl='$v.LoginForm._username' :data='LoginForm.fieldsData._username'/>
      <FormText v-model="LoginForm._password" :vl='$v.LoginForm._password' :data='LoginForm.fieldsData._password'/>

      <div class='form-option'>
        <span class='form-link' @click='forgotPassword'>Mot de passe oublié?</span>
      </div>
      <!-- <CheckBox v-model='LoginForm._souvenir' label='Se souvenir de moi' name="_souvenir" />    -->
      <div class='infoMessage' v-if='infoMessage.length' :class='[errorType]'>
        {{infoMessage}}
      </div>
    </div>
    <template slot='footer'>
      <FormButton @click='modalClosed(true)'>Annuler</FormButton>
      <FormButton :submitting='loginState.requesting' 
        :disabled='$v.LoginForm.$invalid'
        @click='submitForm()'
        theme='blue'>
          Se connecter
      </FormButton>
    </template>
  </UIModal>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import { UIModal, FormText, CheckBox, FormButton, FormSeparator, SocialButton } from "@components";
import { timeout } from '@methods';
import { required, email } from 'vuelidate/lib/validators';
import { LoginStore, NotificationsStore, SignupStore } from '@modules';
import { Forms, AlertsElement } from '@classes'

@Component({
  components: {
    UIModal, FormText, CheckBox, FormButton, FormSeparator, SocialButton
  },
  validations: {
    LoginForm: {
      _username: {required},
      _password: {required}
    }
  }
})
export default class Connexion extends Vue {

  @Prop({required: false, default: true}) show: boolean;
  @Prop({default: true}) isPopup: boolean;
  @Prop({required: false}) redirect: string;

  get loginState() { return LoginStore.state;}
  private connexionRequest = LoginStore.actions.connexionRequest;
  private closeModal = LoginStore.mutations.closeModal;

  private addNotification = NotificationsStore.actions.addNotification;

  public infoMessage: string = '';
  public error: boolean = true;
  public errorType: string = '';

  public LoginForm = new Forms.Form({
    _username: new Forms.TextForm({
      error: false,
      placeholder: 'Adresse email',
      icon: require('@icons/mail.svg')
    }),
    _password: new Forms.TextForm({
      error: false,
      type: 'password',
      placeholder: 'Mot de passe',
      icon: require('@icons/password.svg')
    }),
  })

  modalClosed(empty: boolean) {
    this.infoMessage = '';
    if(empty) {
      this.LoginForm.reset()
    }
    this.closeModal();
  }

  async forgotPassword() {
    try {
      const response = await new AlertsElement.FormAlert({
        title: 'Demander un changement de mot de passe',
        message: 'Un mail vous sera envoyé avec un lien qui vous permettra de changer votre mot de passe',
        formElement: {
          form: new Forms.Form({
            email: new Forms.TextForm({
              type: 'email',
              placeholder: 'Votre adresse email'
            })
          }),
          validations: {
            email: {required, email}
          },
          submit: {
            trigger: LoginStore.actions.passwordResetRequest
          }
        }
      }).waitResponse();

      if (response) {
        NotificationsStore.actions.addNotification({
          type: 'success',
          message: 'Votre mail est envoyé'
        })
      }
    } catch {
      NotificationsStore.actions.addNotification({
        type: 'error',
        message: `Erreur lors de l'envoi`
      })
    }
  }

  handleSubmitLink() {
    this.closeModal();
    SignupStore.mutations.showSignup();
  }

  async submitForm(){
    this.infoMessage = '';
    try {
      await this.connexionRequest({
        loginData: this.LoginForm.getData(), 
        redirect: this.redirect
      });
    } catch(e) {
      console.log(e)
      this.errorType = e.type;
      this.infoMessage = e.message;
    }
  }
}
</script>



<style lang='scss' scoped>


  .moving-logo {
    padding: 5px 30px 20px 30px;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-flow: column nowrap;

    img {
      width: 200px;
      height: auto;
    }
  }

  .form-option {
    font-size: 14px;
    padding: 5px;
    font-weight: bold;
    color: $w120;
  }

  .form-link {
    color: darken($mainStyle, 10%);
    cursor: pointer;
    &:hover {text-decoration: underline}
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

