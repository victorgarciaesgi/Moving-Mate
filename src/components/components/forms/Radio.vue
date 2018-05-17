<template>
  <div class="Radios" >
    <div class='Radio-wrap' :class='{row}'>
      <span class='title'>{{data.placeholder}}</span>
      <ul class='input-radio-list'>
        <li v-for='option in data.options' :key='option.value' class='input-radio'>
          <input :id='"radioButton" + formId + option.value' :name='formId' 
            :value='option.value'
            :checked='value === option.value'
            @change="updateValue(option.value)" 
            type="radio"/>
          <label :for='"radioButton" + formId + option.value' class='button'>
            <div class='circle'></div>
          </label>
          <label :for='"radioButton" + formId + option.value' class='radio-text'>{{option.text}}</label>
        </li>
      </ul>
    </div>
    <FormError :vl='vl' :data='data'/>
  </div>
</template>

<script lang="ts">
import {Prop, Watch} from "vue-property-decorator";
import {Component, Mixin, Mixins} from 'vue-mixin-decorator';
import {FormMixin} from '../Mixins/FormMixin';

@Component({
  mixins: [FormMixin]
})
export default class Radio extends FormMixin {
    @Prop() row: boolean;
}
</script>



<style lang='scss' scoped>

.Radios{
  position: relative;
  display: flex;
  flex-flow: column wrap;
  padding: 5px 10px 5px 5px;
  height: auto;
  width: 100%;
  @include userselect;

  .Radio-wrap {
    display: flex;
    flex-flow: column wrap;
    
    &.row {
      flex-flow: row nowrap;
      align-items: center;
    }

    .title {
      font-size: 15px;
      font-weight: bold;
      text-align: center;
    }

    ul.input-radio-list {
      display: flex;
      padding: 5px;
      flex: 1 1 auto;
      flex-flow: row wrap;
      justify-content: space-around;
      align-content: center;
      align-items: center;
      li.input-radio {
        display: flex;
        padding: 5px;
        flex-flow: row wrap;
        justify-content: space-around;
        align-content: center;
        align-items: center;

        label.button{
          position: relative;
          height: 18px;
          width: 18px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: white;
          border-radius: 100%;
          margin-right: 5px;
          border: 2px solid $w200;
          @include transition(all, 0.3s);
          @include bg-center;
          cursor: pointer;

          &:hover{
            border-color: $mainStyle;
          }
        }

        input{
          position: absolute;
          opacity: 0;
          height: 0;
          width: 0;
          padding: 0;
          margin:0;

          &:checked {
            & ~ label.button {
              border-color: $mainStyle;

              .circle {
                height: 10px;
                width: 10px;
                border-radius: 100%;
                background-color: $mainStyle;
              }
            }
            & ~ label.radio-text{
              color: $mainStyle;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}

</style>

