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
        readonly/>
              
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


    <transition name='slide-top'>
      <div class='calendar-sticky'>
        <div ref='calendar' class='calendar-wrapper' v-show='isFocused'>
          <div class='header'>
            <div class='left-arrow arrow' @mousedown.prevent='changeMonth(-1)'>
              <SvgIcon :src="require('@icons/forms/little_arrow_left.svg')" :size='30'/>
            </div>
            <div class="title">
              <span class="month">{{stringMonth}}</span>
              <span class="year">{{selectedYear}}</span>
            </div>
            <div class='right-arrow arrow' @mousedown.prevent='changeMonth(1)'>
              <SvgIcon :src="require('@icons/forms/little_arrow_right.svg')" :size='30'/>
          </div>
          </div>
          <div class="calendar-dates">
            <ul class="week-days">
              <li v-for='day in weekDays' :key='day'>
                {{day}}
              </li>
            </ul>
            <ul class='month-days'>
              <CalendarDay v-for='dateElement of allDisplayDates' 
                :dateElement='dateElement' 
                :key='dateElement.id'
                :selected='selectedDate'
                @select='handleDateSelect' />
            </ul>
          </div>
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
import {EventBus} from '@store';
import { SvgIcon } from "@components";
import CalendarDay from './CalendarDay.vue';
import moment from 'moment';
import 'moment/locale/fr';


class MomentDate {
  date;month;year;id;type;

  constructor(date: moment.Moment, type: string) {
    this.date = date.date();
    this.month = date.month();
    this.id = shortid.generate(),
    this.year = date.year();
    this.type = type;
  }
}



@Component({
  components: {
    SvgIcon, CalendarDay
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

  public weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  public selectedMonth = null;
  public selectedYear = null;
  public selectedDate = null;
  public allDisplayDates = [];

  handleDateSelect(date: moment.Moment, type: string) {
    this.vl.$touch();
    this.selectedDate = date;
    if (type == 'prev') {
      this.changeMonth(-1)
    } else if( type == 'next') {
      this.changeMonth(1);
    }
    this.$emit('input', date.unix())
  }

  changeMonth(value: number) {
    const month = moment().year(this.selectedYear).month(this.selectedMonth).add(value, 'month');
    this.selectedMonth = month.month();
    this.selectedYear = month.year();
    this.getDays();
  }

  getPrevMonth() {
    const prevmonth = moment().month(this.selectedMonth - 1);
    const curmonth = moment().month(this.selectedMonth);
    const numberOfDays = prevmonth.daysInMonth();
    const curStart = curmonth.startOf('month').weekday();
    const result = [];
    for (let i = numberOfDays - curStart; i < numberOfDays; i++) {
      result.push(new MomentDate(prevmonth.date(i + 1), 'prev'));
    }
    this.allDisplayDates = [...result];
  };
  getAvailable() {
    const curmonth = moment().month(this.selectedMonth);
    const numberOfDays = curmonth.daysInMonth();
    const result = [];
    for (let i = curmonth.startOf('month').date() - 1; i < numberOfDays; i++) {
      result.push(new MomentDate(curmonth.date(i + 1), 'available'));
    }
    this.allDisplayDates = [...this.allDisplayDates,...result];
  };
  getNextMonth() {
    const nextmonth = moment().month(this.selectedMonth + 1);
    const curmonth = moment().month(this.selectedMonth);
    const result = [];
    for (let i = nextmonth.startOf('month').date() - 1; i < 7 - curmonth.endOf('month').weekday() - 1; i++) {
       result.push(new MomentDate(nextmonth.date(i + 1), 'next'));
    }
    this.allDisplayDates = [...this.allDisplayDates,...result];
  };

  getDays() {
    this.getPrevMonth();
    this.getAvailable();
    this.getNextMonth();
  }

  get stringMonth() {
    return moment().month(this.selectedMonth).format('MMMM');
  }

  public calendarStyle = {
    left: null,
    top: null,
    bottom: null,
  }

  get filterErrors() {return Object.keys(this.vl.$params).filter(key => !this.vl[key]);}
  get isPlaceholderHere() {return (this.value.toString().length > 0 || this.isFocused);}
  get valid() {return !this.vl.$invalid}
  get dirty() {return this.vl.$dirty;}

  get formatedValue() {
    if (this.value != '' && !!this.value) {
      return moment.unix(this.value).format('dddd Do MMMM YYYY, hh:mm');
    } else {
      return this.value;
    }
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
    this.selectedMonth = moment().month();
    this.selectedYear = moment().year();
    this.getDays();
  }
}
</script>



<style lang='scss' scoped>

.calendar-sticky {
  position: fixed;
  z-index: 1000;

  .calendar-wrapper {
    position: sticky;
    top: 0px;
    left: 0px;
    display: flex;
    overflow: auto;
    margin-top: -5px;
    width: 304px;
    font-size: 15px;
    flex-flow: column nowrap;
    background-color: white;
    box-shadow: 0px 4px 10px rgba(0,0,0,0.2);
    border-radius: 0 0 3px 3px;

    .header {
      display: flex;
      height: 35px;
      align-items: center;
      justify-content: center;
      flex-flow: row nowrap;
      font-weight: bold;
      font-size: 17px;

      .arrow {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0 0 auto;
        cursor: pointer;
      }

      .title {
        display: flex;
        flex: 1 1 auto;
        justify-content: center;
        text-transform: capitalize;
        span {
          padding: 3px;
        }
      }
    }

    .calendar-dates {
      display: flex;
      flex: 1 1 auto;
      flex-flow: column wrap;
      padding: 5px;

      ul.week-days {
        display: flex;
        flex-flow: row nowrap;
        padding: 3px 5px 3px 5px;
        border-bottom: 1px solid $w220;

        li {
          display: flex;
          flex: 0 0 calc(100% / 7);
          justify-content: center;
          font-size: 13px;
        }
      }

      ul.month-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        padding: 3px 5px 3px 5px;
      }
    }
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


.slide-top-enter-active,
.slide-top-leave-active {
  transition: all 0.3s;
}
.slide-top-enter, .slide-top-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>

