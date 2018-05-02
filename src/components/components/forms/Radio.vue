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
    <div class='errorMessage' v-if='vl.$error && data.error'>
      <ul v-if='vl.$dirty && data.error' class='error'>
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
export default class Radio extends Vue {

  @Prop({required: true, type: [String, Number, null]}) value;
  @Prop() data: any;
  @Prop() row: boolean;
  @Prop() vl;
  public formId = null;
  public errorMessages = {
    required: "Ce choix est requis",
  };

  get filterErrors() {return Object.keys(this.vl.$params).filter(key => !this.vl[key]);}


  updateValue(value){
    this.$emit('input', value);
  }

  mounted() {
    this.formId = shortId.generate();
  }
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

