<template lang='html'>
  <form @submit.prevent='submitForm()' novalidate>
    <Modal :show='show' @close='closeModal(stateName)' :width='400'>
      <span slot='header'>Inscription</span>
      <div slot='content' style='padding: 10px 30px 0px 30px'>
        <FormText type='email' placeholder='Adresse mail'
            :icon="images['fos_user_registration_form[email]']"  v-model="LoginForm['fos_user_registration_form[email]']" :$v='$v.LoginForm["fos_user_registration_form[email]"]'/>
        
        <FormText type='text' placeholder="Nom d'utilisateur"
            :icon="images['fos_user_registration_form[username]']"  v-model="LoginForm['fos_user_registration_form[username]']" :$v='$v.LoginForm["fos_user_registration_form[username]"]'/>

        <FormText type='password' placeholder='Mot de passe'
            :icon="images['fos_user_registration_form[plainPassword][first]']"  v-model="LoginForm['fos_user_registration_form[plainPassword][first]']" :$v='$v.LoginForm["fos_user_registration_form[plainPassword][first]"]'/>

        <FormText type="password" placeholder='Confirmez le mot de passe'
            :icon="images['fos_user_registration_form[plainPassword][second]']"  v-model="LoginForm['fos_user_registration_form[plainPassword][second]']" :$v='$v.LoginForm["fos_user_registration_form[plainPassword][second]"]'/>

        <div class='infoMessage' v-if='infoMessage.length' :class='[errorType]'>
          {{infoMessage}}
        </div>

      </div>
      <template slot='footer'>
        <FormButton @click='closeModal(stateName)'>Annuler</FormButton>
        <FormButton type='submit' :submitting='submitting' :disabled='$v.LoginForm.$invalid' color='blue'>S'inscrire</FormButton>
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
      "fos_user_registration_form[email]": {required, email},
      "fos_user_registration_form[username]": {required, minLength: minLength(4), maxLength: maxLength(20)},
      "fos_user_registration_form[plainPassword][first]": {required},
      "fos_user_registration_form[plainPassword][second]": {required, sameAs: sameAs('password')},
    }
  }
})
export default class Inscription extends Vue {

  @LoginActions submitRequest;
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
    "fos_user_registration_form[email]": require('@icons/mail.svg'),
    "fos_user_registration_form[username]": require('@icons/surname.svg'),
    "fos_user_registration_form[plainPassword][first]": require('@icons/mail.svg'),
    "fos_user_registration_form[plainPassword][second]": require('@icons/password.svg')
  }
  public LoginForm = {
    "fos_user_registration_form[email]": '',
    "fos_user_registration_form[username]": '',
    "fos_user_registration_form[plainPassword][first]": '',
    "fos_user_registration_form[plainPassword][second]": ''
  };

  async submitForm() {
    this.submitting = true;
    let loginResponse = await this.submitRequest(this.LoginForm);
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

