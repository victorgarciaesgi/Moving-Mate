<template lang='html'>
  <div id='moving-search-container'>
    <div class="search-boxes">
      <div class='boxes'>
        <FormText :required='true' placeholder='Localité' design='white' :icon='images.depart' 
          :error='true' v-model='searchForm.depart' :$v='$v.searchForm.depart' description="La ville où vous êtes disponible pour aider" big  />
      </div>
    </div>
    <div class='submit-container'>
      <div class='submit-container'>
        <div class='submit-button'>
          <span>Rechercher</span>
        </div>
      </div>
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
export default class SearchMovers extends Vue {

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
    justify-content: center;
    padding: 10px;

    .boxes {
      display: flex;
      margin: 20px;
      flex: 1 1 auto;
      justify-content: center;
    }
  }

  .submit-container {
    display: flex;
    flex-flow: row nowrap;
  }
}

</style>


