<template lang='html'>
  <Modal :show='show' @close='closeModal(stateName)' :width='400'>
    <span slot='header'>Inscription</span>
    <div slot='content' style='padding: 10px 30px 0px 30px'>
      <FormText type='email' placeholder='Nom' description='Votre nom de famille'
            v-model='LoginForm.name' :$v='$v.LoginForm.name'/>
      <FormText type='password' placeholder='Prénom' description='Votre nom de famille'
          v-model='LoginForm.surname' :$v='$v.LoginForm.surname'/>
          
      <div class='infoMessage' v-if='infoMessage.length' :class='[errorType]'>
        {{infoMessage}}
      </div>
    </div>
    <template slot='footer'>
      <FormButton @click='closeModal(stateName)'>Annuler</FormButton>
      <FormButton @click='submitForm()' :submitting='submitting' :disabled='$v.LoginForm.$invalid' color='blue'>S'inscrire</FormButton>
    </template>
  </Modal>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Mutation, Action, namespace } from "vuex-class";

import { Modal, FormText, CheckBox, FormButton } from "@components";
import { timeout } from '@methods';
import { required, email, minLength, maxLength, sameAs } from 'vuelidate/lib/validators';

const LoginActions = namespace('LoginModule', Action);
const LoginMutation = namespace('LoginModule', Mutation);
const NotifAction = namespace('NotificationsModule', Action);

@Component({
  components: {
    Modal, FormText, CheckBox, FormButton
  },
  validations: {
    LoginForm: {
      name: {required, minLength: minLength(4), maxLength: maxLength(20)},
      surname: {required, minLength: minLength(4), maxLength: maxLength(20)},
      email: {required, email},
      password: {required},
      confirmPassword: {required, sameAs: sameAs('password')}
    }
  }
})
export default class Inscription extends Vue {

  @LoginActions connexionRequest;
  @LoginMutation showModal;
  @LoginMutation closeModal;

  @NotifAction addNotification;

  @Prop({required: true}) show: boolean;
  @Prop({default: false}) window: boolean;

  public stateName: string = 'showInscription'
  public infoMessage: string = '';
  public submitting: boolean = false;
  public error: boolean = true;
  public errorType: string = '';

  public images = {
    login: require('@icons/mail.svg'),
    password: require('@icons/password.svg')
  }
  public LoginForm = {
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  async submitForm(){
    this.submitting = true;
    let loginResponse = await this.connexionRequest(this.LoginForm);
    this.submitting = false;
    if (!loginResponse.success){
      this.errorType = loginResponse.type;
      this.infoMessage = loginResponse.message;
    }
    
  }
}
</script>



<style lang='scss'>

</style>

