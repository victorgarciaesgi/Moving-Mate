<template>
  <form @submit.prevent='submitForm()' novalidate>
    
  </form>
</template>

<script lang="ts">


import Vue from 'vue'
import {Component, Prop, Watch } from 'vue-property-decorator';

@Component({})
export default class error404 extends Vue {


  submitForm() {
    this.$emit('submit');
  }

}



</script>

<style lang="scss" scoped>

</style>
