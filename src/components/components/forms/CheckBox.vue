<template>
  <div class="checkbox">
    <div class='checkbox-wrap'>
      <input :id='formId' :value='value' @change="updateValue($event.target.checked)" type="checkbox"/>
      <label :for="formId" class='button'></label>
      <span>{{data.placeholder}}</span>
    </div>
    <FormError v-if='vl' :vl='vl' :data='data'/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Prop, Watch} from "vue-property-decorator";
import {Component, Mixin, Mixins} from 'vue-mixin-decorator';
import {FormMixin} from '../Mixins/FormMixin';

@Component({
  mixins: [FormMixin]
})
export default class CheckBox extends FormMixin {
  
}
</script>



<style lang='scss' scoped>

.checkbox{
  position: relative;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  padding: 10px 10px 10px 5px;;
  height: auto;
  width: 100%;
  @include userselect;


  .checkbox-wrap {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin-left: 5px;

    span{
      font-size: 14px;
      font-weight: bold;
      margin-left: 5px;
    }

    label.button{
      position: relative;
      height: 17px;
      width: 17px;
      background-color: white;
      border-radius: 3px;
      margin-right: 5px;
      border: 1px solid $w200;
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

      &:checked + label.button{
        background-color: $mainStyle;
        background-image: url('~@icons/done_white.svg');
        border: 1px solid transparent;

        & ~ span{
          color: $mainStyle;
        }
      }
    }
  }
}

</style>

