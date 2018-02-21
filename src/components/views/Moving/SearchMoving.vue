<template>

  <div class='main'>
    <div class='search-container'>
      <div class='search-wrapper'>
        <!-- <FormButton v-if='isCompatible' 
          @click='getUserLocation'> 
            L
        </FormButton> -->
        <div class='search-box'>
          <input type="text"
            class='inputSearchField'
            placeholder="Région, departement, ville"
            :value='searchValue'
            @blur='hideResults()'
            @focus='showResults()'
            @input="handleSearch($event.target.value)"
            v-focus>
          <div class='icon-contain'>
            <SvgIcon :src="require('@icons/search.svg')"/>
          </div>

          <div class='searchResults' v-if='searchResults.length  && resultsDisplay && searchValue.length > 2'>
            <ul>
              <li v-for='result in searchResults' :key='result.code'>
                {{result.nom}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class='search-options'></div>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {FormButton, SvgIcon} from '@components';
import { debounce } from 'lodash';
import { Watch } from 'vue-property-decorator';
import axios from 'axios';

@Component({
  components: {
    FormButton, SvgIcon
  },
  directives: {
    focus: {
      inserted(el, binding) {
        el.focus();
      }
    }
  },
})
export default class SearchMoving extends Vue {

  public searchValue = '';
  public searchResults = [];
  public resultsDisplay = false;
  public handleSearch = null;
  public searching = false;

  get isCompatible() {
    return !!navigator.geolocation;
  }

  hideResults() {
    this.resultsDisplay = false;
  }
  showResults() {
    this.resultsDisplay = true;
  }


  getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log(position.coords);
        });
    }
  }

  @Watch('searchValue') 
  async getResultsFromApi(newVal:string, oldVal:string) {
    let {data} = await axios.get(`https://geo.api.gouv.fr/communes?nom=${newVal}&boost=population`);
    if (data) {
      console.log(data);
      this.searchResults = data.splice(0,4);
    }
    
  }

  created() {
    this.handleSearch = debounce(e => {
      if (e.trim().length > 2) {
        this.searchValue = e;
      }
    }, 500)
  }

}
</script>


<style lang="scss" scoped>

.main {
  display: flex;
  flex-flow: columns nowrap;
  width: 100%;

  .search-container {
    position: relative;
    display: flex;
    width: 100%;
    flex-flow: row wrap;
    justify-content: center;
    padding: 15px 20px 15px 20px;
    align-items: center;

    .search-wrapper {
      display: flex;
      flex: 0 0 auto;

      .search-box {
        display: flex;
        position: relative;
        flex-flow: row wrap;
        justify-content: center;

        &:after {
          width: 100%;
          height: 100%;
          left: 0;
          bottom: -4px;
          background-color: #EDEFF5;
          position: absolute;
          content: "";
          border-radius: 5px;
          z-index: -1;
        }

        .inputSearchField {
          position: relative;
          background-color: white;
          color: $g70;
          height: 60px;
          padding: 5px 30px 5px 60px;
          width: 400px;
          line-height: 30px;
          font-size: 20px;
          border-radius: 4px;
          box-shadow: 0 0 15px rgba(10,10,10,0.1);
          
        }

        .icon-contain {
          position: absolute;
          left: 0;
          top: 0;
          width: 50px;
          height: calc(100% - 26px);
          margin-top: 13px;
          margin-bottom: 13px;
          margin-left: 5px;
          display: flex;
          justify-content: center;
          align-items: center;

          /deep/ svg {
            fill: $g90;
          }

          img {
            height: 22px;
            width: 22px;
          }
        }

        .searchResults {
          position: absolute;
          top: calc(100% + 5px);
          left: 0;
          background-color: white;
          display: flex;
          width: 100%;
          border-radius: 5px;
          overflow: hidden;
          box-shadow: 0 0 15px rgba(10,10,10,0.1);


          ul {
            display: flex;
            width: 100%;
            flex-flow: column wrap;

            li {
              padding: 10px 10px 10px 10px;
            }
          }

        }

        
      }
    }
  }
}


</style>

