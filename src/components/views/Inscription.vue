<template>
  <transition name='slide'>
    <div class='view'>
      <h1>Inscription</h1>
    </div>
  </transition>
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
export default class Inscription extends Vue {

  @LoginActions connexionRequest;
  @NotifAction addNotification;

  @Prop() show: boolean;

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
    await this.connexionRequest(this.LoginForm);
    this.submitting = false;
    
    
  }
}
</script>



<style lang='scss'>

</style>

