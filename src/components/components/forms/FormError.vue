<template>
  <div class='errorMessage' v-if='((error && data.error) || isPending)'>
    <span v-if='isPending' class='pending'>Verification...</span>
    <ul v-else-if='dirty && data.error' class='error'>
      <li v-for='key in filterErrors' :key='key'>
          <span>{{errorMessages[key]}}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop, Watch} from "vue-property-decorator";

@Component({})
export default class FormError extends Vue {
  
  @Prop({required: true}) vl;
  @Prop() data;

  get filterErrors() {return this.vl?Object.keys(this.vl.$params).filter(key => !this.vl[key]): null}
  get error() {return this.vl?this.vl.$error: null}
  get isPending() {return this.vl?this.vl.$pending: null}
  get dirty() {return this.vl?this.vl.$dirty: null}


  public errorMessages = {
    required: "Ce champs est requis",
    email: "L'adresse mail doit être valide",
    minLength: `${this.vl.$params.minLength ? this.vl.$params.minLength.min : ""} caractères minimum`,
    maxLength: `${this.vl.$params.maxLength ? this.vl.$params.maxLength.max : ""} caractères maximum`,
    sameAs: "Les mots de passe doivent être identiques",
    isMailUnique: 'Cet email est déjà utilisé',
    isNameUnique: 'Ce nom est déjà utilisé',
    phone: 'Le numéro de téléphone doit être valide',
    numeric: 'Ce champs doit être un nombre'
  };
}
</script>



<style lang='scss' scoped>

.errorMessage {
  display: flex;
  position: relative;
  flex-flow: columns wrap;
  justify-content: flex-start;
  font-size: 11px;
  font-weight: bold;
  color: $red1;
  margin-left: 5px;

  .pending {
    color: $yellow1;
  }

  ul {
    display: flex;
    flex-flow: column wrap;
  }
}
</style>

