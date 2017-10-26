<template lang='html'>
  <div id='moving-search-container'>
    <div class="search-boxes">
      <FormText :required='true' placeholder='Ville de départ' :icon='images.depart' 
        :error='true' v-model='searchForm.depart' :$v='$v.searchForm.depart' description="La ville d'ou vous voulez déménager" big  />
      <FormText :required='true' placeholder="Ville d'arrivée"  :icon='images.destination' 
        :error='true' v-model='searchForm.destination' :$v='$v.searchForm.destination' big description="La ville ou vous allez déménager" />
      <FormText :required='true' placeholder='Date du déménagement' :icon='images.date' 
        :error='true' v-model='searchForm.date' :$v='$v.searchForm.date' big description="La date à laquelle vous prévoyer de déménager"/>
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
    destination: require('@icons/destination.svg'),
    date: require('@icons/date.svg')
  }

}
</script>


<style lang="scss" scoped>

#moving-search-container{
  display: flex;
  flex-flow: column wrap;

  .search-boxes {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    padding: 10px;
  }

  .submit-container {
    display: flex;
    flex-flow: row nowrap;
  }
}

</style>


