<template>
  
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';

const css = require('@css');

@Component({})
export default class SvgIcon extends Vue {

  @Prop({required: true}) src: string; // base64 svg
  @Prop({required: false}) size: number;
  @Prop({required: false, default: 'rgb(130,130,130)'}) color: string;

  
}
</script>

<style lang="scss">
  
</style>

