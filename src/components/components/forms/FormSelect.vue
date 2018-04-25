<template>
  <div class="input-box">
    <div class='select-container'>
      <div ref='select-form' class='select-form' 
        :class='{
          formError: (!valid && dirty && data.error && !vl.$pending),
          formValid: (valid && dirty && data.error && !vl.$pending),
          icon: data.icon}'
        @click.stop="toggleOptions()">
        <div class='select-placeholder' :class='{top: isPlaceholderHere}'>
          {{data.placeholder}}
        </div>
        <div class='select-result'>
          {{getValue}}
        </div>
        <div class='select-status-icon' :class='{up: showOptions}'>
          <SvgIcon :size='28' :src="require('@icons/moving/little_arrow_down.svg')" />
        </div>
      </div>
      <ul ref='select-options' class='select-options' v-show='showOptions' :style='optionsStyle'>
        <li v-for='option of data.options' 
          :key='option.value'
          @click='updateValue(option.value)'>
          {{option.text}}
        </li>
      </ul>
    </div>

    <div class='errorMessage' v-if='((vl.$error && data.error) || vl.$pending)'>
      <ul v-if='!vl.error && dirty && data.error' class='error'>
        <li v-for='key in filterErrors' :key='key'>
            <span>{{errorMessages[key]}}</span>
        </li>
      </ul>
    </div>
  </div>

</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { IValidator } from "vuelidate";
import { EventBus } from '@store';
import {calculatePopupPosition} from '@methods'

import { SvgIcon } from "@components";

@Component({
  components: {
    SvgIcon
  }
})
export default class FormSelect extends Vue {
  @Prop({required: true, type: [String, Number, null]}) value;
  @Prop({ required: false }) vl: IValidator;
  @Prop({required: true}) data: any;
  

  public errorMessages = {
    required: "Vous devez sélectionner une option",
  };

  public optionsStyle = {
    left: null,
    top: null,
    bottom: null,
    width: null,
  }
  public showOptions = false;

  get filterErrors() {return Object.keys(this.vl.$params).filter(key => !this.vl[key]);}
  get isPlaceholderHere() {return !!this.value}
  get valid() {return !this.vl.$invalid}
  get dirty() {return this.vl.$dirty}
  get getValue() {
    if (this.value) {
      return this.data.options.find(m => m.value == this.value).text
    } else {
      return null;
    }
  }

  updateValue(value) {
    this.vl.$touch();
    this.$emit("input", value);
    this.showOptions = false;
  }

  toggleOptions() {
    if (this.showOptions) {
      this.showOptions = false;
      this.vl.$touch();
    } else {
      this.showOptions = true;
      const target = this.$refs['select-options'];
      const origin = this.$refs['select-form'];
      const results = calculatePopupPosition(origin, target);
      this.optionsStyle = {...this.optionsStyle, ...results};
      EventBus.$emit('closePopups', this);
    }
  }

  created() {
    EventBus.$on('closePopups', (element?) => {
      if (element !== this && this.showOptions) {
        this.showOptions = false;
        this.vl.$touch()
      }
    })
  }

  mounted() {
    if (this.value && this.value.toString().trim().length) {
      this.vl.$touch();
    }
  }

  
}
</script>



<style lang='scss' scoped>
.input-box {
  display: block;
  position: relative;
  flex: 1 1 auto;
  min-width: 200px;
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

  .select-container {
    display: flex;
    position: relative;
    width: 100%;
    flex-flow: column wrap;

    .select-form {
      display: flex;
      position: relative;
      background-color: white;
      flex-flow: row nowrap;
      border-radius: 5px;
      width: 100%;
      height: 45px;
      border: 1px solid $w230;
      align-items: center;
      padding: 0 5px 0 15px;
      cursor: pointer;

      .select-placeholder {
        position: absolute;
        transition: all 0.2s;
        font-size: 15px;
        width: calc(100% - 15px - 40px);
        @include ellipsis;
        font-weight: normal;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: $g90;
        cursor: text;
        
        &.top {
          font-size: 12px;
          top: 10px;
          color: $w150;
          cursor: default;
        }
      }

      .select-result {
        padding-top: 13px;
        flex: 1 1 auto;
        font-weight: bold;
      }

      .select-status-icon {
        flex: 0 0 auto;
        transition: transform 0.3s;

        &.up {
          transform: rotate(180deg);
        }
      }
    }

    ul.select-options {
      position: fixed;
      z-index: 1000;
      display: flex;
      overflow: auto;
      max-height: 200px;
      flex-flow: row wrap;
      background-color: white;
      box-shadow: 0px 3px 10px rgba(0,0,0,0.2);
      border-radius: 0 0 3px 3px;

      li {
        padding: 5px 10px 5px 10px;
        cursor: pointer;
        width: 100%;

        &:hover {
          background-color: $w240;
        }
      }
    }
  }
}
</style>

