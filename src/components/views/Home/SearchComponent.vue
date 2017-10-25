<template lang='html'>
  <div id='search-container'>
    <div class='tabs'>
      <ul>
        <li v-for='tab in tabs'>
          <input :id='`radio-${tab.value}`' type="radio" :value='tab.value' v-model='tabSelected' :change='tabChange()'>
          <label :for="`radio-${tab.value}`">
            {{tab.title}}
          </label>
        </li>
      </ul>
    </div>
    <div class='search-components'>
      <SearchMovers v-if='tabSelected === "movers"' />
      <SearchMoving v-else />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { State, Getter, Mutation } from 'vuex-class';

import SearchMovers from './SearchMovers.vue';
import SearchMoving from './SearchMoving.vue'

@Component({
  components: { SearchMovers, SearchMoving }
})
export default class SearchComponent extends Vue {
  public tabSelected: string = 'moving';
  public tabs = [
    {title: 'Je déménage', value: "moving"},
    {title: "J\'aide à déménager", value: "movers"}
  ]

  tabChange(){
    
  }
}
</script>


<style lang="scss" scoped>

div#search-container {
  display: flex;
  flex-flow: column wrap;

  .tabs{
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    padding: 20px;

    ul{
      display: flex;
      flex-flow: row nowrap;
      border-radius: 50px;
      box-shadow: 0 0 10px $ombre;

      li{
        position: relative;
        font-size: 17px;
        font-weight: bold;
        flex: 0 1 auto;
        display: flex;
        flex-flow: row nowrap;

        label{
          background-color: white;
          border-right: none;
          flex: 0 1 auto;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding: 10px 30px 10px 30px;
          cursor: pointer;
        }

        input{
          display: none;

          &:checked + label{
            color: white;
            background-color: $mainStyle;
            border-color: $mainStyle;
          }
        }

        &:first-child label{
          border-radius: 50px 0 0 50px;
        }
        &:last-child label{
          border-radius: 0 50px 50px 0;
          border-right: 1px solid $w230;
        }
      }
    }
  }
}


</style>


