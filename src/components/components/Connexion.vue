<template>
  <form @submit.prevent='submitForm()' novalidate>
    <UIModal :show='show' @close='modalClosed' :width='400' :isPopup='isPopup'>
      <span slot='header'>Connexion</span>
      
      <div slot='content' style='padding: 0px 20px 0px 20px'>
        <div class='moving-logo'>
          <!-- <img src="~@images/logo_truck_M.svg"> -->
          <span class='form-option'>
            Pas encore inscrit? 
            <span class='form-link' @click='handleSubmitLink()'>Inscrivez vous</span>
          </span>
        </div>
        <SocialButton media='facebook'>Connexion avec Facebook</SocialButton>
        <SocialButton media='google'>Connexion avec Google</SocialButton>
        <FormSeparator>Ou connectez vous</FormSeparator>
        <FormText type='email' placeholder='Adresse mail' :error='false'
          :icon='images._username'  v-model='LoginForm._username' :vl='$v.LoginForm._username'/>
        <FormText type='password' placeholder='Mot de passe' :error='false'
          :icon='images._password' v-model='LoginForm._password' :vl='$v.LoginForm._password'/>
        <div class='form-option'>
          <span class='form-link'>Mot de passe oublié?</span>
        </div>
        <!-- <CheckBox v-model='LoginForm._souvenir' label='Se souvenir de moi' name="_souvenir" />    -->
        <div class='infoMessage' v-if='infoMessage.length' :class='[errorType]'>
          {{infoMessage}}
        </div>
      </div>
      <template slot='footer'>
        <FormButton @click='modalClosed(true)'>Annuler</FormButton>
        <FormButton type='submit' :submitting='loginState.requesting' :disabled='$v.LoginForm.$invalid' color='blue'>Se connecter</FormButton>
      </template>
    </UIModal>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import { UIModal, FormText, CheckBox, FormButton, FormSeparator, SocialButton } from "@components";
import { timeout } from '@methods';
import { required, email } from 'vuelidate/lib/validators';
import { LoginStore, NotificationsStore, SignupStore } from '@modules';

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

  private loginState = LoginStore.state;
  private connexionRequest = LoginStore.actions.connexionRequest;
  private closeModal = LoginStore.mutations.closeModal;

  private addNotification = NotificationsStore.actions.addNotification;

  public infoMessage: string = '';
  public error: boolean = true;
  public errorType: string = '';

  public images = {
    _username: require('@icons/mail.svg'),
    _password: require('@icons/password.svg')
  }
  public LoginForm = {
    _username: 'victor@free.fr',
    _password: 'aaaaa',
    _souvenir: false,
    reset() {
      this._username = '';
      this._password = '';
      this._souvenir = false;
    }
  };

  modalClosed(empty: boolean) {
    this.infoMessage = '';
    if(empty) {
      this.LoginForm.reset()
    }
    this.closeModal();
  }

  handleSubmitLink() {
    this.closeModal();
    SignupStore.mutations.showSignup();
  }

  async submitForm(){
    this.infoMessage = '';
    let loginResponse = await this.connexionRequest({loginData: this.LoginForm, redirect: this.redirect});
    if (!loginResponse.success) {
      this.errorType = loginResponse.type;
      this.infoMessage = loginResponse.message;
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
      width: 70px;
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

