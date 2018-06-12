<template>
  <div class='Home'>
    <section class='image-home'>
      <ul class="link-list">
        <router-link to='moving' class='link'>Voir les déménagements</router-link>
        <router-link to='movers' class='link'>Liste des déménageurs</router-link>
        <router-link to='moving/create' class='link'>Créer une annonce</router-link>
      </ul>
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

    <section class='france-map'>
      <h1>Voir les déménagements en France!</h1>
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
import router, {routesNames} from '@router';
import FooterComponent from './Footer.vue';
import { StarRating, SvgIcon, MapViewer, BackgroundLoader } from '@components';
import { LoginStore, AlertsStore } from '@store';
import {AlertsElement, ActionsElements} from '@classes';

@Component({
  components: {
    StarRating, SvgIcon, MapViewer, BackgroundLoader, FooterComponent
  }
})
export default class Home extends Vue {

  public helps = [
    {icon: require('@icons/annonce.svg'), text:'Je publie une annonce gratuitement sur le site!'},
    {icon: require('@icons/people.svg'), text:'Des déménageurs répertoriés viendront proposer leur services'},
    {icon: require('@icons/phone.svg'), text:'Nous vous mettons en relation avec les déménageurs'},
    {icon: require('@icons/star_plain.svg'), text:'Je laisse un avis et une note sur les déménageurs une fois le déménagement fini'},
  ];

  handlePathSelect(path: svgPath) {
    router.push(`/moving/search/${path.title}`);
  }

  async mounted() {
    // new AlertsElement.SuccessAlert({
    //     title: "Publication réussie!",
    //     message: "Votre annonce a bien été publiée. Recrutez des déménageurs depuis la page de votre annonce ou attendez que des déménégeurs proposent leur aide",
    //     actions: [
    //       new ActionsElements.Action({
    //         type: 'action',
    //         text: 'Voir mon annonce',
    //       })
    //     ]
    //   })
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
    flex: 0 1 auto;
  }

  section.image-home {
    overflow: hidden;
    height: 400px;
    max-height: 60vh;
    background-image: url("~@images/home_image/home_image.jpg");
    @include bg-center;
    display: flex;
    justify-content: center;
    align-items: center;

    .link-list {
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      align-items: center;


      .link {
        padding: 10px 20px 10px 20px;
        background-color: white;
        border-radius: 5px;
        font-weight: bold;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        margin: 5px 10px 5px 10px;
      }

    }


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
    margin: 0 30px 30px 30px;
    padding-top: 30px;
    flex-flow: column nowrap;

    border-top: 1px solid $w220;
  }
}


</style>


