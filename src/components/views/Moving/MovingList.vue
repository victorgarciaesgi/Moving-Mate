<template>
  <div class="moving-list-root">
    <ul class='moving-list'>
      <li v-for='moving in movingList' :key='moving.id'>

      </li>
    </ul>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';
import { MovingStore } from '@store';

@Component({})
export default class MovingList extends Vue {

  get movingList() {return MovingStore.getters.formatedMovingList}

  mounted() {
    console.log(this.movingList);
  }


}
</script>


<style lang="scss" scoped>




</style>


