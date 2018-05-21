<template>
  <div class='main'>
    <div class='search-container'>
      <div class='search-wrapper'>
        <div class='search-box' :class='{searching, locationSearching}'>
          <input ref='inputField' type="text"
            class='inputSearchField'
            placeholder="Région, departement, ville"
            :value='formSearchValue'
            @blur='hideResults()'
            @focus='showResults()'
            @keydown.down.up.prevent="modifySelected($event)"
            @keydown.esc.prevent='hideResults()'
            @keydown.enter.prevent="handleNewSearch()"
            @input="handlePlacesSearch($event.target.value)"
            v-focus>

          <transition name='slide-top'>
            <div class='searchResults' v-if='placesResultsDisplay && formSearchValue.length > 0 && !searchCommited'>
              <ul v-if='placesResults.length'>
                <li v-for='(result, index) in placesResults' 
                    :key='result.code'
                    @click='handleNewSearch(result.nom)'
                    :class='{selected: index == resultSelected}'>
                  <div class='icon'>
                    <SvgIcon v-if='result.type =="ville"' 
                      :src="require('@icons/location.svg')" 
                      :color="{[css.mainStyle]: index == resultSelected}"/>
                    <SvgIcon v-else 
                      :src="require('@icons/region.svg')" 
                      :color="{[css.mainStyle]: index == resultSelected}"/>
                  </div>
                  <span class='name'>{{result.nom}}</span>
                  <span class='code' v-if='["ville","departement"].includes(result.type)'>
                    <span v-if='result.codesPostaux'>{{result.codesPostaux[0]}}</span>
                    <span v-else>{{result.codeDepartement}}</span>
                  </span>
                </li>
              </ul>
              <div v-if='!placesResults.length && !searching && !searchCommited' class='no-result'>
                Aucun résultat ☹️
              </div>
            </div>
          </transition>

          <div class='icon-search'>
            <SvgIcon :src="require('@icons/search.svg')"/>
          </div>

          <div class='icons-container'>
            <div v-if='isGeoLocationCompatible && !locationSearching' 
              @click='getUserLocation'
              class='user-location-ask icon'>
                <SvgIcon :src='require("@icons/location_search.svg")'/>
            </div>
            <img v-if='locationSearching' class='loading icon' src='~@images/loading.svg'>
            <div class='france-map-selector'>
              <Popup class='center' :width='260'>
                <template slot='popup'>
                  <MapViewer svgPath='departements' 
                    @pathSelected='handlePathSelect' 
                    :size='250' 
                    :showInfos='false' />
                </template>
                <div class='icon-map' slot='button'>
                  <img src="~@icons/moving/france.svg"/>
                </div>
              </Popup>
            </div>
            <img v-if='searching' class='loading icon' src='~@images/loading.svg'>
          </div>
        </div>
      </div>
    </div>
    <div class='search-options' v-if='createMoving'>
      <router-link to='/moving/create'>
        <FormButton>
          <SvgIcon :src="require('@icons/add_circle.svg')" />
          Créer une annonce
        </FormButton>
      </router-link>
    </div>
  </div>

</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator'
import { FormButton, SvgIcon, Popup, MapViewer } from '@components';
import { debounce } from 'lodash';
import { svgPath } from '@types';
import { Watch } from 'vue-property-decorator';
import axios from 'axios';
import router from '@router';
import { EventBus } from '@store';

@Component({
  components: {
    FormButton, SvgIcon, Popup, MapViewer
  },
  directives: {
    focus: {
      inserted(el, binding, vnode) {
        if (!vnode.context['searchCommited'] && !vnode.context['formSearchValue']) {
          el.focus();
        }
      }
    } 
  },
})
export default class SearchMoving extends Vue {

  @Prop() store;
  @Prop() createMoving: boolean;
  @Prop() moverInvite: boolean;

  get formSearchValue() {return this.store.state.formSearchData.formSearchValue}
  get placesResults() {return this.store.state.formSearchData.placesResults}
  get searchCommited() {return this.store.state.formSearchData.searchCommited}
  public placesResultsDisplay = false;
  public handlePlacesSearch = null;
  public searching = false;
  public locationSearching = false;
  public resultSelected = 0;
  public css = require('@css');

  get isGeoLocationCompatible() {
    return !!navigator.geolocation;
  }

  hideResults() {
    this.placesResultsDisplay = false;
    // this.$refs['inputField'].blur();
  }
  showResults() {
    this.placesResultsDisplay = true;
  }

  togglePopup(popupName: string, target?: HTMLElement) {
    this.$refs[popupName].togglePopup(target);
  }

  handlePathSelect(path: svgPath) {
    this.$emit('updateRoute',path.title || '');
    EventBus.$emit('closePopups');
  }

  modifySelected(event: KeyboardEvent) {
    let touche = event.which - 39;
    if ((this.resultSelected + touche >= 0 && (this.resultSelected + touche <= (this.placesResults.length - 1)))) {
      this.resultSelected += touche;
    }
  }

  handleNewSearch(name?: string) {
    if (this.placesResults.length) {
      let value = name || this.placesResults[this.resultSelected].nom;
      this.$emit('updateRoute', value);
    } 
  }

  async getUserLocation() {
    if (navigator.geolocation && !this.searching && !this.locationSearching) {
      this.locationSearching = true;
      await this.store.actions.fetchUserLocation();
      this.locationSearching = false;
    }
  }

  @Watch('formSearchValue') 
  async getResultsFromApi(newVal:string, oldVal:string) {
    console.log(newVal);
    if (!this.searchCommited) {
      this.searching = false;
      this.placesResultsDisplay = true;
      if (newVal.trim().length > 0) {
        this.searching = true;
        this.resultSelected = 0;
        await this.store.actions.fetchPlaces(newVal);
      } else {
        this.store.mutations.updateSearchList([]);
        this.$emit('updateRoute', newVal);
      }
      this.searching = false;
    }
  }

  created() {
    this.handlePlacesSearch = debounce(e => {
      this.store.mutations.updateSearchValue(e);
    }, 300)
  }

  beforeDestroy() {
    this.store.mutations.updateSearchValue("");
  }

}
</script>


<style lang="scss" scoped>

.main {
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  background-color: white;
  justify-content: center;
  padding-bottom: 10px;

  .search-options {
    flex: 0 0 auto;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }

  .search-container {
    position: relative;
    display: flex;
    flex: 0 0 auto;
    flex-flow: row wrap;
    justify-content: center;
    padding: 15px 20px 15px 20px;
    align-items: center;
    color: $g70;

    .search-wrapper {
      display: flex;
      flex: 0 0 auto;

      .search-box {
        display: flex;
        position: relative;
        flex-flow: row wrap;
        justify-content: center;

        &.searching {
          .inputSearchField {
            padding-right: 90px;
          }

          .loading {
            right: 45px;
          }
        }

        .icons-container {
          position: absolute;
          right: 15px;
          top: 0;
          height: 100%;
          display: flex;
          flex-flow: row-reverse wrap;
          justify-content: center;
          align-items: center;

          .icon {
            margin-left: 10px;
            height: 26px;
            width: 26px;
            cursor: pointer;
            
            /deep/ svg {
              fill: $g90;
              height: 26px;
              width: 26px;
            }
          }

          .france-map-selector {
            height: 26px;
            width: 26px;
            margin-left: 10px;
            .icon-map, img {
              height: 26px;
              width: 26px;
              cursor: pointer;
            }

            /deep/ .bouton-popup.active {
              background-color: $w220;
              border-radius: 4px;
            }
          }

          .loading {
            height: 25px;
            width: 25px;
          }

          .user-location-ask {
            cursor: pointer;
            .svg {
              height: 25px;
              width: 25px;
            }
          }
        }

        &:before {
          width: 100%;
          height: 100%;
          left: 0;
          bottom: -4px;
          background-color: $w230;
          position: absolute;
          content: "";
          border-radius: 5px;
        }

        .inputSearchField {
          position: relative;
          background-color: white;
          color: $g70;
          height: 60px;
          padding: 5px 60px 5px 60px;
          width: 450px;
          line-height: 30px;
          font-size: 20px;
          border-radius: 4px;
          box-shadow: 0 0 15px rgba(0,0,0,0.15);
        }

        .icon-search {
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
            height: 26px;
            width: 26px;
          }
        }

        .searchResults {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          background-color: white;
          display: flex;
          width: 100%;
          border-radius: 5px;
          z-index: 2;
          box-shadow: 0 0 15px rgba(0,0,0,0.15);

          &:before {
            width: 100%;
            height: 100%;
            left: 0;
            bottom: -4px;
            z-index: 0;
            background-color: $w220;
            position: absolute;
            content: "";
            border-radius: 5px;
          }

          ul {
            display: flex;
            width: 100%;
            z-index: 1;
            border-radius: 5px;
            overflow: hidden;
            flex-flow: column wrap;

            li {
              display: flex;
              flex-flow: row nowrap;
              height: 45px;
              align-items: center;
              background-color: white;
              cursor: pointer;
              &:not(:last-child) {
                border-bottom: 1px solid $w240;
              }

              &:hover {
                background-color: $w250;
              }

              &.selected:not(:only-child) {
                background-color: $w245;
              }

              .icon {
                display: flex;
                flex: 0 0 auto;
                justify-content: center;
                align-items: center;
                width: 60px;
              }

              .name {
                flex: 1 1 auto;
              }

              .code {
                flex: 0 0 auto;
                color: $w150;
                padding: 0 10px 0 10px;
                font-size: 15px; 
              }
            }
          }

          .no-result {
            height: 60px;
            border-radius: 5px;
            display: flex;
            background-color: white;
            flex: 1 1 auto;
            z-index: 2;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
            font-size: 19px;
          }

        }
      }
    }
  }
}


.slide-top-enter-active,
.slide-top-leave-active {
  transition: all 0.3s;
}
.slide-top-enter, .slide-top-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}


</style>

