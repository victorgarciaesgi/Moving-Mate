<template>
  <li class='CalendarDay'
    @mousedown.prevent='handleSelect()'
    :class='{
      "prev-month": dateElement.type == "prev",
      "available": dateElement.type == "available",
      "next-month": dateElement.type == "next",
      "today": isToday
    }'> 
    <span>{{dateNumber}}</span>
  </li>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import shortid from 'shortid';
import moment from 'moment';

@Component({})
export default class CalendarDay extends Vue {
  @Prop() dateElement;

  public fullDate = null;



  get dateNumber() {return this.dateElement.date;}

  get isToday() {
    const today = moment();
    return this.fullDate.isSame(today, 'day');
  }

  handleSelect() {
    this.$emit('select', this.fullDate);
  }

  created() {
    this.fullDate = moment().year(this.dateElement.year).month(this.dateElement.month).date(this.dateElement.date).hour(10).minute(0);
  }
}
</script>



<style lang='scss' scoped>

li.CalendarDay {
  display: flex;
  height: 40px;
  justify-content: center;
  align-content: center;
  align-items: center;
  font-size: 14px;
  cursor: pointer;

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 30px;
    border-radius: 100%;
  }

  &:not(.today):hover span{
    background-color: $w230;
  }

  &.prev-month, &.next-month {
    color: $w180;
  }
  &.available {
    font-weight: bold;
  }

  &.today span{
    background-color: $mainStyle;
    color: white;
  }
}

</style>

