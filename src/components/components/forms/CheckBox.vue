<template>
  <div class="checkbox">
    <div class='checkbox-wrap'>
      <input :id='formId' :value='value' @change="updateValue($event.target.checked)" type="checkbox"/>
      <label :for="formId" class='button'></label>
      <span>{{data.placeholder}}</span>
    </div>
    <div class='errorMessage' v-if='((vl.$error && data.error))'>
      <ul v-if='!vl.error && vl.dirty && data.error' class='error'>
        <li v-for='key in filterErrors' :key='key'>
            <span>{{errorMessages[key]}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import shortId from 'shortid';

@Component({})
export default class CheckBox extends Vue {

  @Prop({required: true, type: [Boolean]}) value;
  @Prop() data: any;
  @Prop() vl;
  public formId = null;

  public errorMessages = {
    required: "Ce choix est requis",
  };

  updateValue(value){
    this.$emit('input', value);
  }

  mounted() {
    this.formId = shortId.generate();
  }
}
</script>



<style lang='scss' scoped>

.checkbox{
  position: relative;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: center;
  padding: 10px 10px 10px 5px;;
  height: auto;
  width: 100%;
  @include userselect;

  .errorMessage {
    display: flex;
    position: relative;
    flex-flow: columns wrap;
    justify-content: flex-start;
    font-size: 11px;
    font-weight: bold;
    color: $red1;
    margin-left: 5px;

    ul {
      display: flex;
      flex-flow: column wrap;
    }
  }


  .checkbox-wrap {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;

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

        & ~ span{
          color: $mainStyle;
        }
      }
    }
  }
}

</style>

