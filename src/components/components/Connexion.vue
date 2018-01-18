<template lang='html'>
  <form @submit.prevent='submitForm()' novalidate>
    <Modal :show='show' @close='closeModal' :width='400' :window='window'>
        <span slot='header'>Connexion</span>
        <div slot='content' style='padding: 10px 30px 0px 30px'>
          <FormText type='email' placeholder='Adresse mail' :error='false'
              :icon='images._username'  v-model='LoginForm._username' :vl='$v.LoginForm._username'/>
          <FormText type='password' placeholder='Mot de passe' :error='false'
              :icon='images._password' v-model='LoginForm._password' :vl='$v.LoginForm._password'/>
          <CheckBox v-model='LoginForm.souvenir' label='Se souvenir de moi' name="souvenir" />
          
          <div class='infoMessage' v-if='infoMessage.length' :class='[errorType]'>
            {{infoMessage}}
          </div>
          <!-- <pre>{{LoginForm}}</pre> -->
        </div>
        <template slot='footer'>
          <FormButton @click='closeModal'>Annuler</FormButton>
          <FormButton type='submit' :submitting='loginState.requesting' :disabled='$v.LoginForm.$invalid' color='blue'>Valider</FormButton>
        </template>
    </Modal>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Mutation, Action, namespace } from "vuex-class";

import { Modal, FormText, CheckBox, FormButton } from "@components";
import { timeout } from '@methods';
import { required, email } from 'vuelidate/lib/validators';
import { LoginStore, NotificationsStore } from '@modules'

@Component({
  components: {
    Modal, FormText, CheckBox, FormButton
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
  @Prop({default: true}) window: boolean;

  loginState = LoginStore.state;
  connexionRequest = LoginStore.actions.connexionRequest;
  closeModal = LoginStore.mutations.closeModal;

  addNotification = NotificationsStore.actions.addNotification;


  public stateName: string = 'showConnexion'
  public infoMessage: string = '';
  public error: boolean = true;
  public errorType: string = '';

  public images = {
    _username: require('@icons/mail.svg'),
    _password: require('@icons/password.svg')
  }
  public LoginForm = {
    _username: '',
    _password:'',
  };

  async submitForm(){
    let loginResponse = await this.connexionRequest(this.LoginForm);
    if (!loginResponse.success){
      this.errorType = loginResponse.type;
      this.infoMessage = loginResponse.message;
    }
    
  }
}
</script>



<style lang='scss'>

</style>

