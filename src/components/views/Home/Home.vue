<template lang='html'>
  <transition name='slide'>
    <div class='home'>
      <section class='image-home'>
        <div class='background-mask'></div>
      </section>

      <section>
        <div class='help-wrapper'>
          <ul>
            <li v-for='help in helps'>
              <div class='icon' :style='{backgroundImage: `url(${help.icon})`}'></div>
              <div class='text'>{{help.text}}</div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { State, Getter, Mutation } from 'vuex-class';
import { StarRating } from '@components'

@Component({
  components: {
    StarRating
  }
})
export default class Home extends Vue {

  public helps = [
    {icon: require('@icons/annonce_blue.svg'), text:'Publiez une annonce gratuitement sur le site!'},
    {icon: require('@icons/people_blue.svg'), text:'Des déménageurs répertoriés viendront proposer leur services pour votre déménagement'},
    {icon: require('@icons/payment_blue.svg'), text:'Je valide et je prépaie en ligne. La somme sera verséee une fois le déménagement fini'},
    {icon: require('@icons/star_plain_blue.svg'), text:'Je laisse un avis et une note sur les déménageurs'},
  ]

}
</script>


<style lang="scss" scoped>

section{
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  position: relative;
}

.image-home {
  background-image: url('~@images/home_image.jpg');
  position: relative;
  height: 500px;
  @include bg-center;

  .background-mask {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: transparentize($g20, 0.7);
  }
}


</style>


