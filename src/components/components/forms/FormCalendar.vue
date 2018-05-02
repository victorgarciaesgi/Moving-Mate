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
        @input="updateValue($event.target.value)" />
              
      <div class='input-icon-contain' v-if='data.icon'>
        <img class='input-icon' v-if='data.icon && data.inlineIcon' :src="data.icon">
        <SvgIcon class='input-icon' v-if='data.icon && !data.inlineIcon' :src="data.icon" />
      </div>

      <label :for='formId' class='input-placeholder' :class='{top: isPlaceholderHere}'>
        {{data.placeholder}}
      </label>

      <img v-if='vl.$pending' class='form-valid-icon' src='~@images/loading.svg'>
      <div v-else-if='valid && dirty && data.error && !vl.$pending' class="form-valid-icon form-valid"></div>
      <div v-else-if='!valid && dirty && data.error && !vl.$pending' class="form-valid-icon form-invalid"></div>
      <div v-else-if='!dirty && !vl.required' class="form-valid-icon form-required"></div>
    </div>


    <div ref='calendar' class='calendar-wrapper' v-show='isFocused' :style='calendarStyle'>
      <div class='header'>
        <div class='left-arrow arrow'></div>
        <div class="title">
          <span class="year"></span>
          <span class="month"></span>
        </div>
        <div class='left-arrow arrow'></div>
      </div>
      <div class="calendar-dates">
        <ul class="week-days">
          <li></li>
        </ul>
        <ul class='month-days'>
          <li class='day prev-month' v-for='day of prevMonth' :key='day.id'>

          </li>
          <li class='day available' v-for='day in available' :key='day.id'>

          </li>
          <li class='day next-month' v-for='day of nextMonth' :key='day.id'>

          </li>
        </ul>
      </div>
    </div>

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
import {EventBus} from '@store';
import { SvgIcon } from "@components";
import moment,{ months } from 'moment';
import 'moment/locale/fr';

@Component({
  components: {
    SvgIcon
  }
})
export default class FormCalendar extends Vue {
  @Prop({type: [String, Number, null]}) value;
  @Prop({ required: false }) vl: IValidator;

  @Prop({required: true}) data: any;
  

  public formId = null;
  public errorMessages = {
    required: "Ce champs est requis",
  };

  public isFocused = false;
  public debounceValue = null;

  public selectedMonth;
  public selectedYear;

  public currentDay;
  public selectedDay;

  get prevMonth() {
    const prevmonth = moment().month(this.selectedMonth - 1);
    const curmonth = moment().month(this.selectedMonth);
    const numberOfDays = prevmonth.daysInMonth();
    const lastDay = prevmonth.endOf('month').date();
    const result = [];
    for (let i = numberOfDays - curmonth.startOf('month').weekday() - 1; i < numberOfDays; i++) {
      result.push(i + 1);
    }
    return result;
  };
  get available() {
    const curmonth = moment().month(this.selectedMonth);
    const numberOfDays = curmonth.daysInMonth();
    const result = [];
    for (let i = curmonth.startOf('month').date() - 1; i < numberOfDays; i++) {
      result.push(i + 1);
    }
    return result;
  };
  get nextMonth() {
    const nextmonth = moment().month(this.selectedMonth + 1);
    const curmonth = moment().month(this.selectedMonth);
    
    const result = [];
    for (let i = nextmonth.startOf('month').date() - 1; i < 7 - curmonth.endOf('month').weekday() + 1 ; i++) {
      result.push(i + 1);
    }
    console.log(result);
    return result;
  };



  public calendarStyle = {
    left: null,
    top: null,
    bottom: null,
  }

  get filterErrors() {return Object.keys(this.vl.$params).filter(key => !this.vl[key]);}
  get isPlaceholderHere() {return (this.value.length > 0 || this.isFocused);}
  get valid() {return !this.vl.$invalid}
  get dirty() {return this.vl.$dirty;}

  get formatedValue() {
    return this.value;
  }

  updateValue(value) {
    this.vl.$touch();
    this.$emit("input", value);
  }

  async handleBlur() {
    this.isFocused = false;
    this.vl.$touch();
  }

  handleFocus() {
    this.isFocused = true;
    const target = this.$refs['calendar'];
    const origin = this.$refs['input'];
    const {width, ...results} = calculatePopupPosition(origin, target);
    this.calendarStyle = {...this.calendarStyle, ...results};
    EventBus.$emit('closePopups', this);
  }

  mounted() {
    this.formId = shortid.generate();
    if (this.value && this.value.trim().length) {
      this.vl.$touch();
    }
  }

  created() {
    console.log(moment().month());
    this.selectedMonth = moment().month();
    this.currentDay = moment().date();
  }
}
</script>



<style lang='scss' scoped>


.calendar-wrapper {
  position: fixed;
  z-index: 1000;
  display: flex;
  overflow: auto;
  width: 300px;
  height: 300px;
  font-size: 15px;
  font-weight: bold;
  flex-flow: row wrap;
  background-color: white;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.2);
  border-radius: 0 0 3px 3px;
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
    padding: 15px 30px 0 15px;
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
</style>

