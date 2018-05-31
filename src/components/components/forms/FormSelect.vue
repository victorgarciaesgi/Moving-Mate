<template>
  <div class="input-box">
    <div class='select-container'>
      <div ref='select-form' class='select-form' 
        :class='{
          formError: (!valid && dirty && data.error && !isPending),
          formValid: (valid && dirty && data.error && !isPending),
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
          :class='{selected: option.value == value}'
          @click='updateValue(option.value)'>
            <span>{{option.text}}</span>
            <SvgIcon v-if='option.value == value' class='icon' :src='require("@icons/done.svg")' :color='css.mainStyle'/>
        </li>
      </ul>
    </div>

    <FormError v-if='vl' :vl='vl' :data='data'/>

  </div>

</template>

<script lang="ts">
import {Prop, Watch} from "vue-property-decorator";
import {Component, Mixin, Mixins} from 'vue-mixin-decorator';
import {FormMixin} from '../Mixins/FormMixin';
import {timeout, calculatePopupPosition} from '@methods';
import {EventBus, GoogleMaps} from '@store';

@Component({
  mixins: [FormMixin]
})
export default class FormSelect extends FormMixin {
  
  public optionsStyle = {
    left: null,
    top: null,
    bottom: null,
    width: null,
  }
  public showOptions = false;

  get getValue() {
    if (this.value) {
      return this.data.options.find(m => m.value == this.value).text
    } else {
      return null;
    }
  }
  get isPlaceholderHere() {return !!this.value}


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
      max-height: 220px;
      font-size: 15px;
      font-weight: bold;
      flex-flow: row wrap;
      background-color: white;
      box-shadow: 0px 4px 10px rgba(0,0,0,0.2);
      border-radius: 0 0 3px 3px;

      li {
        padding: 10px 10px 10px 10px;
        cursor: pointer;
        width: 100%;
        display: flex;
        flex-flow: row nowrap;

        span {
          flex: 1 1 auto;
        }

        .icon {
          flex: 0 0 auto;
        }

        &.selected {
          color: $mainStyle;
        }

        &:hover {
          background-color: $w240;
        }
      }
    }
  }
}
</style>

