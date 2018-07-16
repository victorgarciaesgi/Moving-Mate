<template>
  <div class='Offres'>
    <a class='offre' target="_blank" :href='offre.link' v-for="offre of offres" :key='offre.id'
      :style='{backgroundImage: `url("/images/offres/${offre.id}.jpg")`}'>
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop} from 'vue-property-decorator';
import { StarRating, SvgIcon, UISwitch, FormMessage } from '@components';
import moment from 'moment';
import Movers from '@views/Movers/Movers.vue';

@Component({
  components: {
    FormMessage, SvgIcon, Movers
  },
})
export default class MovingOffers extends Vue {
  
  public offres = [
    {id: 1, link: 'https://www.hertz.fr/rentacar/reservation/'},
    {id: 2, link: 'https://www.europcar.fr/'},
    {id: 3, link: 'https://www.sixt.fr/'},
    {id: 4, link: 'https://www.ada.fr/'},

  ]

}
</script>



<style lang='scss' scoped>

.Offres {
  display: flex;
  width: 100%;
  padding: 20px;
  flex-flow: row wrap;
  justify-content: center;
  align-items: flex-start;

  .offre {
    display: flex;
    flex: 0 0 auto;
    width: 400px;
    height: 200px;
    @include bg-center;
    border-radius: 5px;
    margin-right: 20px;
    margin-bottom: 20px;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
  }
}

 
</style>

