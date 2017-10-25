<template>
  <div class="checkbox">
    <input :id='name' :value='value' @change="updateValue($event.target.checked)" type="checkbox"/>
    <label :for="name" class='button'></label>
    <span>{{label}}</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({})
export default class CheckBox extends Vue {

  @Prop() value: boolean;
  @Prop() label: string;
  @Prop() name: string;

  updateValue(value){
    this.$emit('input', value);
  }
}
</script>



<style lang='scss'>

.checkbox{
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 10px 10px 10px 5px;;
  height: auto;
  width: 100%;
  @include userselect;

  &.centered{
    justify-content: center;
  }

  span{
    font-size: 14px;
    font-weight: bold;
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
      background-image: url('~@icons/done.svg');
      border: 1px solid transparent;

      & + span{
        color: $mainStyle;
      }
    }
    // &:focus + label{
    //   border: 1px solid $mainGreen2;
    // }
  }
}

</style>

