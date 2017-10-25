<template lang='html'>
  <div id='moving-search-container'>
    <div class="search-boxes">
      <FormText :required='true' placeholder='Ville de départ' type='text' :inline='true' :icon='images.depart' :error='true'
                v-model='searchForm.depart' :$v='$v.searchForm.depart' @input='$v.searchForm.depart.$touch()'/>
    </div>
    <div class='submit-container'>
      
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { State, Getter, Mutation } from 'vuex-class';

import { FormText, FormButton } from '@components';
import { required } from 'vuelidate/lib/validators';

@Component({
  components: {
    FormText, FormButton
  },
  validations: {
    searchForm: {
      depart: {required},
      destination: {required},
      date: {required}
    }

  }
})
export default class SearchMoving extends Vue {

  public searchForm = {
    depart: '',
    destination: '',
    date: ''
  }

  public images = {
    depart: require('@icons/localisation.svg'),
    destination: require('@icons/destination.svg')
  }

}
</script>


<style lang="scss" scoped>

#moving-search-container{
  display: flex;
  flex-flow: column wrap;

  .search-boxes {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
  }

  .submit-container {
    display: flex;
    flex-flow: row nowrap;
  }
}

</style>


