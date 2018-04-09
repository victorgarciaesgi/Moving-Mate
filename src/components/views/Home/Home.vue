<template>
  <div class='Home'>
    <section class='image-home'>
      <img src='~@images/home_image/home_image.jpg' />
    </section>

    <section class='help '>
      <span class='title'>Comment ça marche ?</span>
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
      <h1>Voir les déménagements en france</h1>
      <MapViewer svgPath='departements' @pathSelected='handlePathSelect' />
    </section>

    <section>
      <FooterComponent></FooterComponent>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { svgPath } from '@types';
import router from '@router';
import FooterComponent from './Footer.vue';
import { StarRating, SvgIcon, MapViewer, BlurLoader } from '@components';

@Component({
  components: {
    StarRating, SvgIcon, MapViewer, BlurLoader, FooterComponent
  }
})
export default class Home extends Vue {

  public css = require('@css');

  public helps = [
    {icon: require('@icons/annonce.svg'), text:'Je publie une annonce gratuitement sur le site!'},
    {icon: require('@icons/people.svg'), text:'Des déménageurs répertoriés viendront proposer leur services'},
    {icon: require('@icons/payment.svg'), text:'Je prépaie en ligne. La somme sera verséee une fois le déménagement fini'},
    {icon: require('@icons/star_plain.svg'), text:'Je laisse un avis et une note sur les déménageurs'},
  ];

  handlePathSelect(path: svgPath) {
    router.push(`/moving/search/${path.title}`);
  }

}
</script>


<style lang="scss" scoped>

.Home {
  display: flex;
  width: 100%;
  flex-flow: column wrap;

  section{
    display: flex;
    position: relative;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
  }

  section.image-home {
    overflow: hidden;
    height: auto;
    max-height: 60vh;

    img {
      width: 100%;
      object-fit: cover;
      height: auto;
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
    padding: 30px;
  }
}


</style>


