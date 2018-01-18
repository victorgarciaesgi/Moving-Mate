<template lang='html'>
  <form @submit.prevent='submitForm()' novalidate method='post' action>
    <Modal :show='show' @close='close()' :width='400' :window='window'>
      <span slot='header'>Inscription</span>
      <div slot='content' style='padding: 10px 20px 0px 20px'>
        <FormText type='email' placeholder='Adresse mail'
            :icon="images.email"  v-model="SignupForm.email" :vl='$v.SignupForm.email'/>
        
        <FormText type='text' placeholder="Nom d'utilisateur"
            :icon="images.username"  v-model="SignupForm.username" :vl='$v.SignupForm.username'/>

        <FormText type='password' placeholder='Mot de passe'
            :icon="images['plainPassword[first]']"  v-model="SignupForm['plainPassword[first]']" :vl='$v.SignupForm["plainPassword[first]"]'/>

        <FormText type="password" placeholder='Confirmez le mot de passe'
            :icon="images['plainPassword[second]']"  v-model="SignupForm['plainPassword[second]']" :vl='$v.SignupForm["plainPassword[second]"]'/>

        <div class='infoMessage' v-if='infoMessage.length' :class='[errorType]'>
          {{infoMessage}}
        </div>

      </div>
      <template slot='footer'>
        <FormButton @click='close()' v-if='window'>Annuler</FormButton>
        <FormButton type='submit' :submitting='submitting' :disabled='$v.SignupForm.$invalid' color='blue'>S'inscrire</FormButton>
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
import { IValidator } from 'vuelidate';


const SignupActions = namespace('SignupModule', Action);
const SignupMutation = namespace('SignupModule', Mutation);
const NotifAction = namespace('NotificationsModule', Action);

@Component({
  components: {
    Modal, FormText, CheckBox, FormButton
  },
  validations: {
    SignupForm: {
      email: {required, email},
      username: {required, minLength: minLength(4), maxLength: maxLength(20)},
      "plainPassword[first]": {required},
      "plainPassword[second]": {required, sameAs: sameAs('fos_user_registration_form[plainPassword][first]')},
    }
  }
})
export default class Inscription extends Vue {

  @SignupActions signupRequest;
  @SignupMutation showSignup;
  @SignupMutation closeModal;

  @NotifAction addNotification;

  @Prop({default: true}) window: boolean;
  @Prop({required: false, default: true}) show: boolean;

  public infoMessage: string = '';
  public submitting: boolean = false;
  public error: boolean = true;
  public errorType: string = '';
  public $v: IValidator;

  public images = {
    email: require('@icons/mail.svg'),
    username: require('@icons/surname.svg'),
    "plainPassword[first]": require('@icons/mail.svg'),
    "plainPassword[second]": require('@icons/password.svg')
  }
  public SignupForm = {
    email: null,
    username: 'victor2',
    "plainPassword[first]": 'aaaaa',
    "plainPassword[second]": 'aaaaa',
    reset() {
      this.email = '';
      this.username = '';
      this["plainPassword[first]"] = '';
      this["plainPassword[second]"] = '';
    }
  };

  close(reset?: boolean) {
    if (this.window) {
      this.closeModal();
      this.SignupForm.reset();
    } else if (reset) {
      this.closeModal();
      this.SignupForm.reset();
      this.$v.$reset();
    }
  }

  async submitForm() {
    this.submitting = true;
    let submitResponse = await this.signupRequest(this.SignupForm);
    this.submitting = false;
    if (!submitResponse.success){
      this.errorType = submitResponse.type;
      this.infoMessage = submitResponse.message;
    }
  }
}
</script>



<style lang='scss'>

</style>

