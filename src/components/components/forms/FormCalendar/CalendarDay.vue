<template>
  <li class='CalendarDay'
    @mousedown.prevent='handleSelect()'
    :class='{
      "prev-month": dateElement.type == "prev",
      "available": dateElement.type == "available",
      "passed": isPassed,
      "next-month": dateElement.type == "next",
      "today": isToday,
      "selected": isSelected
    }'> 
    <span>{{dateNumber}}</span>
  </li>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import shortid from 'shortid';
import moment from 'moment';

@Component({
  props: ['dateElement','selected', 'isMoving']
})
export default class CalendarDay extends Vue {
  @Prop() dateElement;
  @Prop() selected;
  @Prop() isMoving: boolean;

  public fullDate: moment.Moment= null;

  get dateNumber() {return this.dateElement.date;}
  get selectedDate() {
    return moment.unix(this.selected);
  }

  get isToday() {
    const today = moment();
    return this.fullDate.isSame(today, 'day');
  }

  get isPassed() {
    if (!this.isMoving) {
      return false;
    }
    const today = moment();
    return this.fullDate.isBefore(today, 'day');
  }

  get isSelected() {
    if (this.selected) {
      return this.selectedDate.isSame(this.fullDate, 'day');
    }
    return false;
  }

  handleSelect() {
    if (!this.isPassed) {
      this.$emit('select', this.fullDate, this.dateElement.type);
    }
  }

  created() {
    this.fullDate = moment().year(this.dateElement.year).month(this.dateElement.month).date(this.dateElement.date)
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

  &:not(.today):not(.selected):not(.passed):hover span{
    background-color: $w230;
  }

  &.prev-month, &.next-month {
    color: $w180;
  }

  &.available {
    font-weight: bold;
  }

  &.passed {
    text-decoration: line-through $red1;
    cursor: not-allowed;
    color: $w180;
  }

  &.today span{
    background-color: transparentize($mainStyle, 0.2);
    color: white;
  }

  &.selected span {
    background-color: $g60;
    color: white;
  }
}

</style>

