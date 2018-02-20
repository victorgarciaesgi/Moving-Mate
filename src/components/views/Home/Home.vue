<template>
  <div class='home'>
    <section class='image-home' v-bg-blur:local.jpg="'home_image'">
      <div class='background-mask'></div>
    </section>

    <section class='help '>
      <span class='title'>Comment ça marche?</span>
      <ul class='help-wrapper'>
        <li v-for='help in helps' :key='help.text' v-once>
          <div class='icon'>
            <div class='icon-circle'>
              <SvgIcon :src='help.icon' :size='70' color='#FFF'></SvgIcon>
            </div>
          </div>
          <div class='text'>{{help.text}}</div>
        </li>
      </ul>
    </section>

    <section class='france-map line-separator'>
      <MapViewer svgPath='departements' @pathSelected='handlePathSelect' />
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { State, Getter, Mutation } from 'vuex-class';
import { svgPath } from '@types';
import router from '@router';
import { StarRating, SvgIcon, MapViewer } from '@components';
const css = require('@css');

@Component({
  components: {
    StarRating, SvgIcon, MapViewer
  }
})
export default class Home extends Vue {

  public css = css;

  public helps = [
    {icon: require('@icons/annonce.svg'), text:'Je publie une annonce gratuitement sur le site!'},
    {icon: require('@icons/people.svg'), text:'Des déménageurs répertoriés viendront proposer leur services'},
    {icon: require('@icons/payment.svg'), text:'Je prépaie en ligne. La somme sera verséee une fois le déménagement fini'},
    {icon: require('@icons/star_plain.svg'), text:'Je laisse un avis et une note sur les déménageurs'},
  ];

  handlePathSelect(path: svgPath) {
    router.push(`/movers/${path.id}`);
  }

}
</script>


<style lang="scss" scoped>

section{
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  position: relative;
}

section.image-home {
  position: relative;
  height: 500px;

  .background-mask {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: transparentize($g20, 0.7);
  }
}


section.help {
  padding: 30px 20px 30px 20px;
  align-content: center;
  align-items: center;

  span.title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  ul.help-wrapper {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-content: center;
    
    li {
      display: flex;
      flex: 0 1 auto;
      flex-flow: column nowrap;
      width: 220px;
      margin: 15px;
      height: 240px;
      padding: 20px 10px 20px 10px;
      box-shadow: 0 0 20px rgba(10,10,10,0.1);
      border-radius: 5px;
      background-color: white;

      .icon {
        display: flex;
        height: 100px;
        justify-content: center;
        align-items: center;
        

        .icon-circle {
          border-radius: 100%;
          display: flex;
          height: 100px;
          justify-content: center;
          align-items: center;
          width: 100px;
          background-color: $mainStyle;
          padding: 25px;
        }
      }

      .text {
        display: flex;
        flex: 1 1 auto;
        align-content: center;
        text-align: center;
        font-size: 15px;
        font-weight: bold;
        margin-top: 30px;
      }
    }
  }
}


section.france-map {
  height: auto;
}


</style>


