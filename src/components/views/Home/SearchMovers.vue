<template lang='html'>
  <h1>Je veux aider à déménager</h1>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { State, Getter, Mutation } from 'vuex-class';

import { FormText } from '@components'

@Component({
  components: {
    FormText
  }
})
export default class SearchMovers extends Vue {

}
</script>


<style lang="scss" scoped>

</style>


