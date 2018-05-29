<template>
  <div class="FormUpload">
    <div class='upload-wrapper'>
      <div class='dropZone'>
        <input type='file' accept="image/jpeg" style='display: none'>
      </div>
      <div class=''></div>
    </div>
    <FormError v-if='vl' :vl='vl' :data='data'/>
  </div>

</template>

<script lang="ts">
import {Prop, Watch} from "vue-property-decorator";
import {Component, Mixin, Mixins} from 'vue-mixin-decorator';
import {FormMixin} from '../Mixins/FormMixin';

@Component({
  mixins: [FormMixin]
})
export default class FormUpload extends FormMixin {
  
}
</script>



<style lang='scss' scoped>


.FormUpload {
  display: flex;
  flex-flow: column wrap;
  padding: 5px 0 5px 0;
  
  .upload-wrapper {
    display: flex;
    height: 100px;
    background-color: $w230;
  }
}

</style>

