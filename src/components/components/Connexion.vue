<template lang='html'>
  <div>
    <Modal :show='show' @close='closeModal()' :width='400'>
      <span slot='header'>Connexion</span>
      <div slot='content' style='padding: 10px 30px 0px 30px'>
        <FormText :required='true' type='email' :inline='true' :icon='images.login' :error='true' placeholder='Adresse mail'
                  v-model='LoginForm.login' :$v='$v.LoginForm.login' @input='$v.LoginForm.login.$touch()'/>
        <FormText :required='true' type='password' :inline='true' :icon='images.password' :error='false' placeholder='Mot de passe'
                  v-model='LoginForm.password' :$v='$v.LoginForm.password' @input='$v.LoginForm.password.$touch()'/>
        <CheckBox v-model='LoginForm.souvenir' label='Se souvenir de moi' name="souvenir" />
        
        <!-- <pre>{{$v.form}}</pre> -->
      </div>
      <template slot='footer'>
        <FormButton @click='closeModal()'>Annuler</FormButton>
        <FormButton @click='submitForm()' :submitting='submitting' color='blue'>Valider</FormButton>
      </template>
    </Modal>
  </div>
  
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
const NotifAction = namespace('NotificationsModule', Action);

@Component({
  components: {
    Modal, FormText, CheckBox, FormButton
  },
  validations: {
    LoginForm: {
      login: {required, email},
      password: {required}
    }
  }
})
export default class Connexion extends Vue {

  @LoginActions connexionRequest;
  @NotifAction addNotification;

  @Prop() show: boolean;

  public images = {
    login: require('@icons/mail.svg'),
    password: require('@icons/password.svg')
  }

  public LoginForm = {
    login: '',
    password:'',
    souvenir: false
  };
  public submitting: boolean = false;

  closeModal() {
    this.$emit("close");
  }

  async submitForm(){
    this.submitting = true;
    let loginResponse = await this.connexionRequest(this.LoginForm);
    if (!loginResponse){

    }
    this.submitting = false;
  }
}
</script>



<style lang='scss'>

</style>

