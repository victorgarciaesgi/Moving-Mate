<template lang='html'>
  <Modal :show='show' @close='closeModal(stateName)' :width='400'>
    <span slot='header'>Connexion</span>
    <div slot='content' style='padding: 10px 30px 0px 30px'>
      <FormText type='email' placeholder='Adresse mail' :error='false'
          :icon='images.username'  v-model='LoginForm.username' :$v='$v.LoginForm.username'/>
      <FormText type='password' placeholder='Mot de passe' :error='false'
          :icon='images.password' v-model='LoginForm.password' :$v='$v.LoginForm.password'/>
      <CheckBox v-model='LoginForm.souvenir' label='Se souvenir de moi' name="souvenir" />
      
      <div class='infoMessage' v-if='infoMessage.length' :class='[errorType]'>
        {{infoMessage}}
      </div>
      <pre>{{LoginForm}}</pre>
    </div>
    <template slot='footer'>
      <FormButton @click='closeModal(stateName)'>Annuler</FormButton>
      <FormButton @click='submitForm()' :submitting='submitting' :disabled='$v.LoginForm.$invalid' color='blue'>Valider</FormButton>
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
import { required, email } from 'vuelidate/lib/validators';

const LoginActions = namespace('LoginModule', Action);
const LoginMutation = namespace('LoginModule', Mutation);
const NotifAction = namespace('NotificationsModule', Action);

@Component({
  components: {
    Modal, FormText, CheckBox, FormButton
  },
  validations: {
    LoginForm: {
      username: {required},
      password: {required}
    }
  }
})
export default class Connexion extends Vue {

  @LoginActions connexionRequest;
  @LoginMutation showModal;
  @LoginMutation closeModal;

  @NotifAction addNotification;

  @Prop({required: true}) show: boolean;
  @Prop({default: false}) window: boolean;

  public stateName: string = 'showConnexion'
  public infoMessage: string = '';
  public submitting: boolean = false;
  public error: boolean = true;
  public errorType: string = '';

  public images = {
    username: require('@icons/mail.svg'),
    password: require('@icons/password.svg')
  }
  public LoginForm = {
    username: '',
    password:'',
    souvenir: false
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

