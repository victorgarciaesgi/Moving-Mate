<template>
  <form @submit.prevent='submitForm()' novalidate>
    <UIModal :show='show' @close='modalClosed' :width='400' :isPopup='isPopup'>
        <span slot='header'>Connexion</span>
        <div slot='content' style='padding: 10px 20px 0px 20px'>
          <div class='infoMessage' v-if='infoMessage.length' :class='[errorType]'>
            {{infoMessage}}
          </div>
          <FormText type='email' placeholder='Adresse mail' :error='false'
            :icon='images._username'  v-model='LoginForm._username' :vl='$v.LoginForm._username'/>
          <FormText type='password' placeholder='Mot de passe' :error='false'
            :icon='images._password' v-model='LoginForm._password' :vl='$v.LoginForm._password'/>
          <CheckBox v-model='LoginForm._souvenir' label='Se souvenir de moi' name="_souvenir" />    
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

import { UIModal, FormText, CheckBox, FormButton } from "@components";
import { timeout } from '@methods';
import { required, email } from 'vuelidate/lib/validators';
import { LoginStore, NotificationsStore } from '@modules';

@Component({
  components: {
    UIModal, FormText, CheckBox, FormButton
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
  .infoMessage {
    border: 1px solid $w210;
    border-radius: 40px;
    font-size: 14px;
    font-weight: bold;
    margin: 5px;
    padding: 10px 10px 10px 10px;
    text-align: center;
    color: white;
    border: none;
    box-shadow: 0 0 8px transparentize($g0, $amount: 0.85);
    
    &.error {
      color: $red1;
    }

    &.warning {
      color: $yellow2;
    }
  }
</style>

