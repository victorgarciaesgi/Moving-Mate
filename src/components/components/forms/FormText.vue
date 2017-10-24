<template>
    <div>
      <div class="input-container">
        <input  class='input-form'
                :type="type"
                :value='value'
                :class='{
                  formError: (!valid && dirty && error),
                  formValid: (valid && dirty && error),
                }'
                :placeholder="placeholder"
                :required='required'
                :disabled='disabled'
                @input="updateValue($event.target.value)" />

        <div v-if='valid && dirty && error' class="form-valid-icon form-valid"></div>
        <div v-if='!valid && dirty && error' class="form-valid-icon form-invalid"></div>
        <div v-if='!dirty && $v.required' class="form-valid-icon form-required"></div>
      </div>
      <div class="errorMessage" v-if='!valid && dirty'>
        <span v-if='$v.$error.required && $v.required'>Champs requis</span>
      </div>
      <div class="infoMessage" v-if='$v.$pending'>
        <span>Verification...</span>
      </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { IValidator } from 'vuelidate';

@Component({
  name: 'FormText',
})
export default class FormText extends Vue {

  @Prop() value: string;
  @Prop({required: false}) type: string;
  @Prop({required: false}) placeholder: string;
  @Prop({required: false}) error: boolean;
  @Prop({required: false}) disabled: boolean;
  @Prop({required: false}) required: boolean;
  @Prop({required: false}) $v: IValidator;

  updateValue(value){
    this.$emit('input', value);
  }

  get valid(){
    return !this.$v.$invalid;
  }

  get dirty(){
    return this.$v.$dirty;
  }
}
</script>



<style lang='scss'>

</style>

