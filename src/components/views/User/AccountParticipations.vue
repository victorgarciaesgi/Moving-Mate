<template lang='html'>
  <div>
    Bonjour : {{getUser.username}}
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {ActionsElements, AlertsElement, Forms} from '@classes';
  import {UserStore} from '@store';

  @Component({

  })

  export default class AccountParticipations extends Vue {
    public $v;
    public submitting: boolean = false;

    get getUser() {
      return UserStore.state.oneUser;
    }
  }
</script>


<style lang="scss" scoped>


</style>


