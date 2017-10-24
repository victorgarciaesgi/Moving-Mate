<template>
  <div class='view'>
    <h1>404</h1>
  </div>
</template>

<script lang="ts">


import Vue from 'vue'
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Component({})
export default class error404 extends Vue {

  created() {
    console.log('error404 created');
  }
}



</script>

<style lang="scss" scoped>

</style>
