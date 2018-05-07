<template>
  <div class="input-box">
    <div class="input-container">
      <input ref='input' class='input-form'
        :id='formId'
        :value='formatedValue'
        :class='{
          formError: (!valid && dirty && data.error && !vl.$pending),
          formValid: (valid && dirty && data.error && !vl.$pending),
          placeholder: isPlaceholderHere,
          icon: data.icon,
        }'
        :disabled='data.disabled'
        :required='data.required'
        @focus='handleFocus()'
        @blur='handleBlur()'
        @keydown.down.up.prevent="modifySelected($event)"
        @keydown.esc.prevent='forceBlur()'
        @keydown.enter.prevent="selectAddress()"
        :readonly='value != ""'
        @input='handlePlacesSearch($event.target.value)'/>
              
      <div class='input-icon-contain' v-if='data.icon'>
        <img class='input-icon' v-if='data.icon && data.inlineIcon' :src="data.icon">
        <SvgIcon class='input-icon' v-if='data.icon && !data.inlineIcon' :src="data.icon" />
      </div>

      <label :for='formId' class='input-placeholder' :class='{top: isPlaceholderHere}'>
        {{data.placeholder}}
      </label>

      <img v-if='vl.$pending || searching' class='form-valid-icon' src='~@images/loading.svg'>
      <div v-else-if='valid && dirty && data.error && !vl.$pending' class="form-valid-icon form-valid"></div>
      <div v-else-if='!valid && dirty && data.error && !vl.$pending' class="form-valid-icon form-invalid"></div>
      <div v-else-if='!dirty && !vl.required' class="form-valid-icon form-required"></div>

      <img v-if='value != ""' src='~@icons/quit.svg' class='clearValue' @click='clearValue()'>
    </div>

    <transition name='slide-top'>
      <div ref='results' class='search-results' v-show='isFocused && tempValue.length > 0 && value == ""' :style='resultsStyle'>
        <ul class='results' v-if='searchResults.length'>
          <li v-for='(result, index) in searchResults' :key='result.place_id'
            @click='selectAddress(result)'
            :class='{selected: index == resultSelected}'>
            <div class='icon'>
              <SvgIcon :src="require('@icons/location.svg')" 
                :color="{[css.mainStyle]: index == resultSelected}"/>
            </div>
            <span class='detail'>{{result.display.addressValue}}</span>
            <span class='ville'>{{result.display.addressCity}}</span>
          </li>
          <div class='logo-google'>
            <img src='~@images/powered-by-google-on-white.png'>
          </div>
        </ul>
        <div v-if='!searchResults.length && !searching && value == ""' class='no-result'>
          Aucun résultat ☹️
        </div>
      </div>
    </transition>


    <div class='errorMessage' v-if='((vl.$error && data.error) || vl.$pending)'>
      <span v-if='vl.$pending' class='pending'>Verification...</span>
      <ul v-else-if='dirty && data.error' class='error'>
        <li v-for='key in filterErrors' :key='key'>
            <span>{{errorMessages[key]}}</span>
        </li>
      </ul>
    </div>
  </div>

</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { IValidator } from "vuelidate";
import shortid from 'shortid';
import {timeout, calculatePopupPosition} from '@methods';
import {EventBus, GoogleMaps} from '@store';
import { SvgIcon } from "@components";
import {debounce} from 'lodash';


@Component({
  components: {
    SvgIcon
  }
})
export default class FormPlaceSearch extends Vue {
  @Prop() value;
  @Prop({ required: false }) vl: IValidator;
  @Prop({required: true}) data: any;
  

  public formId = null;
  public errorMessages = {
    required: "Ce champs est requis",
  };
  public resultSelected = 0;
  public css = require('@css');
  public isFocused = false;
  public tempValue = "";
  public searching = false;
  public handlePlacesSearch = null;
  public searchResults = [];

  public resultsStyle = {
    width: null
  }

  get filterErrors() {return Object.keys(this.vl.$params).filter(key => !this.vl[key]);}
  get isPlaceholderHere() {return ((this.tempValue.toString().length > 0 || this.value.length > 0) || this.isFocused);}
  get valid() {return !this.vl.$invalid}
  get dirty() {return this.vl.$dirty;}

  get formatedValue() {
    return this.tempValue;
  }

  updateValue(value: any) {
    this.vl.$touch();
    this.$emit("input", value);
  }

  async searchPlaces(value: any) {
    this.searching = true;
    try {
      const places = await GoogleMaps.actions.querySearch(value);
      places.map(m => {
        const [detail, ville, pays] = m.terms;
        m.display = {addressValue: detail.value + ' ' + ville.value , addressCity: pays.value};
        return m;
      })
      this.searchResults = places;
      this.resultSelected = 0;
    } finally {
      this.searching = false;
  }
  }

  selectAddress(result?) {
    if (this.searchResults.length) {
      const address = result || this.searchResults[this.resultSelected]
      this.$emit('input', address.display);
      this.forceBlur();
      this.tempValue = address.display.addressValue + ', ' + address.display.addressCity;
      this.searchResults = [];
    } 
  }

  modifySelected(event: KeyboardEvent) {
    let touche = event.which - 39;
    if ((this.resultSelected + touche >= 0 && (this.resultSelected + touche <= (this.searchResults.length - 1)))) {
      this.resultSelected += touche;
    }
  }

  clearValue() {
    this.tempValue = "";
    this.$emit('input', "");
    this.$refs['input'].focus();
  }

  handleFocus() {
    this.isFocused = true;
    const target = this.$refs['results'];
    const origin = this.$refs['input'];
    const {width, ...results} = calculatePopupPosition(origin, target);
    this.resultsStyle = {...this.resultsStyle, width};
    EventBus.$emit('closePopups', this);
  }

  handleBlur() {
    this.isFocused = false;
    this.vl.$touch();
  }

  forceBlur() {
    this.$refs['input'].blur();
  }

  mounted() {
    this.formId = shortid.generate();
    if (this.value != "") {
      this.tempValue = this.value.addressValue + ', ' + this.value.addressCity;
      this.vl.$touch();
    }
  }

  created() {
    const _this = this;
    this.handlePlacesSearch = debounce(e => {
      if (e.length > 0) {
        _this.tempValue = e;
      _this.searchPlaces(e);
      } else {
        _this.clearValue()
      }
    }, 400)
  }
}
</script>



<style lang='scss' scoped>

.search-results {
  position: fixed;
  width: 100%;
  background-color: white;
  z-index: 1000;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.2);
  border-radius: 5px;
  margin-top: -5px;

  ul {
    display: flex;
    overflow: hidden;
    flex-flow: column wrap;

    li {
      display: flex;
      flex-flow: row nowrap;
      height: 40px;
      font-size: 15px;
      align-items: center;
      background-color: white;
      cursor: pointer;

      .detail {
        font-size: 15px;
        color: $g60;
      }

      .ville {
        margin-left: 5px;
        color: $w150;
        font-size: 13px;
      }


      &:not(:last-child) {
        border-bottom: 1px solid $w240;
      }

      &:hover {
        background-color: $w245;
      }

      &.selected:not(:only-child) {
        background-color: $w235;
      }

      .icon {
        display: flex;
        flex: 0 0 auto;
        justify-content: center;
        align-items: center;
        width: 60px;
      }
    }
    .logo-google {
      display: none;
      justify-content: flex-end;
      align-items: center;
      padding: 5px;
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

.input-box {
  display: block;
  position: relative;
  flex: 0 1 auto;
  min-width: 250px;
  width: 100%;
  padding: 5px 0 5px 0;

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
}

.input-container {
  display: flex;
  position: relative;
  flex-flow: row wrap;

  .input-form {
    position: relative;
    display: block;
    background-color: #e0e1e4;
    color: $mainColor;
    height: 45px;
    padding: 15px 60px 0 15px;
    margin: 5px 0 5px 0;
    transition: all 0.2s;
    width: 100%;
    font-size: 15px;
    border-radius: 5px;
    border: 1px solid transparent;

    &.icon {
      padding-left: 60px;

      & ~ .input-placeholder {
        left: 60px;
      }
    }

    &:not(.placeholder)::-webkit-datetime-edit{ color: transparent; }

    &:focus::-webkit-datetime-edit{ color: $mainColor; } 

    &:focus {
      background-color: #d8d9dd;
    }

    &.formValid {
      ~ .input-icon-contain .input-icon /deep/ svg {
        fill: $mainStyle;
      }
    }

    &.formError {
      ~ .input-icon-contain .input-icon /deep/ svg {
        fill: $red1;
      }
    }
  }

  img.clearValue {
    position: absolute;
    right: 35px;
    top: 50%;
    height: 20px;
    width: 20px;
    cursor: pointer;
    transform: translateY(-50%);
  }

  .input-placeholder {
    position: absolute;
    display: flex;
    align-content: center;
    justify-content: flex-start;
    transition: all 0.2s;
    font-size: 16px;
    font-weight: normal;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: $w150;
    cursor: text;
    
    &.top {
      font-size: 12px;
      top: 16px;
      cursor: default;
    }
  }

  .input-icon-contain {
    position: absolute;
    left: 0;
    top: 0;
    width: 50px;
    height: calc(100% - 26px);
    margin-top: 13px;
    margin-bottom: 13px;
    display: flex;
    overflow: hidden;
    transition: all 0.2s;
    justify-content: center;
    align-items: center;
    border-right: 1px solid $w200;

    .input-icon {
      height: 22px;
      width: 22px;
    }
  }

  /deep/ svg {
    fill: $mainColor;
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

