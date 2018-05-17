<template lang='html'>
  <div>
    Bonsoir : {{getUser.username}}
    <form @submit.prevent='submitForm()' method='post' action>
      <span>Modifier votre profil</span>
      <div>
        <FormText v-model="EditForm.username" :data='EditForm.fieldsData.username'/>
        <FormField v-model="EditForm.description" :data='EditForm.fieldsData.description'/>
        <FormText v-model="EditForm.lastname" :data='EditForm.fieldsData.lastname'/>
        <FormText v-model="EditForm.firstname" :data='EditForm.fieldsData.firstname'/>
        <FormCalendar v-model='EditForm.birthdate' :data='EditForm.fieldsData.birthdate'/>
        <FormText v-model="EditForm.pricePerHour" :data='EditForm.fieldsData.pricePerHour'/>
      </div>
      <FormButton type='submit'
                  :submitting='submitting'
                  theme='blue'>
        Valider
      </FormButton>
    </form>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {ActionsElements, AlertsElement, Forms} from '@classes';
  import {UserStore} from '@store';
  import FormField from "../../components/forms/FormField";
  import FormText from "../../components/forms/FormText";
  import FormButton from "../../components/forms/FormButton";
  import {FormCalendar} from "@components";

  @Component({
    components: {FormText, FormField, FormCalendar, FormButton}
  })

  export default class AccountDetail extends Vue {
    public $v;
    public submitting: boolean = false;

    get getUser() {
      return UserStore.state.oneUser;
    }

    public EditForm = new Forms.Form({
      username: new Forms.TextForm({
        placeholder: 'Nom d\'utilisateur',
        error: false
      }),
      description: new Forms.TextForm({
        placeholder: 'Description',
        error: false
      }),
      lastname: new Forms.TextForm({
        placeholder: 'Nom',
        error: false
      }),
      firstname: new Forms.TextForm({
        placeholder: 'Prénom',
        error: false
      }),
      birthdate: new Forms.TextForm({
        placeholder: 'Date de naissance',
        error: false
      }),
      pricePerHour: new Forms.TextForm({
        placeholder: 'Prix par heures',
        error: false
      }),

    })

    async submitForm() {
      console.log(this.EditForm.getData())
    }

  }
</script>


<style lang="scss" scoped>


</style>


